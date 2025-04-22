import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { createSale } from "@/services/saleService"
import { fetchPurchases } from "@/services/purchaseService"

interface Purchase {
  id: number
  productId: number
  productName: string
  quantity: number
  costPrice: number
  expireDate?: string
  purchaseDate?: string
}

function SaleCard() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)

  interface Sale {
    quantity?: number
    salePrice?: number
    saleDate?: string
  }

  const [saleData, setSaleData] = useState<Record<number, Sale>>({})
  const [batchMode, setBatchMode] = useState(false)

  useEffect(() => {
    fetchPurchases()
      .then(setPurchases)
      .finally(() => setLoading(false))
  }, [])

  const handleInputChange = (id: number, field: string, value: unknown) => {
    setSaleData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }))
  }

  const handleCreateSale = async (purchaseId: number) => {
    const sale = saleData[purchaseId]
    const quantityToSell = Number(sale?.quantity || 0)
  
    if (quantityToSell <= 0) {
      alert("Quantity must be greater than 0")
      return
    }
  
    try {
      await createSale({
        purchaseId,
        quantity: quantityToSell,
        salePrice: Number(sale?.salePrice || 0),
        saleDate: sale?.saleDate || new Date().toISOString(),
      })
  
      // Update local state for remaining quantity
      setPurchases((prev) =>
        prev.map((p) =>
          p.id === purchaseId
            ? { ...p, quantity: p.quantity - quantityToSell }
            : p
        )
      )
  
      alert("Sale created successfully!")
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Failed to create sale")
    }
  }
  
  const handleCreateAllSales = async () => {
    const saleEntries = Object.entries(saleData)
  
    const validSales = saleEntries.filter(([idStr, sale]) => {
      const id = Number(idStr)
      const purchase = purchases.find((p) => p.id === id)
      return (
        purchase &&
        purchase.quantity > 0 &&
        Number(sale.quantity) > 0 &&
        Number(sale.quantity) <= purchase.quantity &&
        sale.salePrice &&
        sale.saleDate
      )
    })
  
    if (validSales.length === 0) {
      alert("No valid sales to process.")
      return
    }
  
    try {
      await Promise.all(
        validSales.map(([idStr, sale]) =>
          createSale({
            purchaseId: Number(idStr),
            quantity: Number(sale.quantity),
            salePrice: Number(sale.salePrice),
            saleDate: sale.saleDate || new Date().toISOString(),
          })
        )
      )
  
      // Update local state quantities
      setPurchases((prev) =>
        prev.map((purchase) => {
          const sale = saleData[purchase.id]
          if (
            sale &&
            Number(sale.quantity) > 0 &&
            Number(sale.quantity) <= purchase.quantity
          ) {
            return {
              ...purchase,
              quantity: purchase.quantity - Number(sale.quantity),
            }
          }
          return purchase
        })
      )
  
      alert("Sales created successfully!")
    } catch {
      alert("Failed to create one or more sales")
    }
  }
  

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Create Sales</h2>
        <div className="flex items-center space-x-2">
          <Label htmlFor="batch-mode">Enable batch sale mode</Label>
          <Switch
            id="batch-mode"
            checked={batchMode}
            onCheckedChange={setBatchMode}
          />
        </div>
        {batchMode && (
        <Button onClick={handleCreateAllSales} className="mb-4">
          Create Sales
        </Button>
      )}
      </div>

      

      {loading ? (
        <p>Loading purchases...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {purchases.map((purchase) => {
            const isOutOfStock = purchase.quantity <= 0
            const isDisabled = isOutOfStock

            return (
              <div
                key={purchase.id}
                className={`border p-4 rounded-lg shadow-md bg-white space-y-3 transition ${
                  isDisabled ? "opacity-50 grayscale pointer-events-none" : ""
                }`}
              >
                <h3 className="font-semibold text-lg">{purchase.productName}</h3>
                <p>
                  <strong>Remaining Quantity:</strong> {purchase.quantity}
                </p>
                <p>
                  <strong>Cost Price:</strong> ${purchase.costPrice}
                </p>
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={saleData[purchase.id]?.quantity || ""}
                  onChange={(e) =>
                    handleInputChange(purchase.id, "quantity", e.target.value)
                  }
                  disabled={isDisabled}
                />
                <Input
                  type="number"
                  placeholder="Sale Price"
                  value={saleData[purchase.id]?.salePrice || ""}
                  onChange={(e) =>
                    handleInputChange(purchase.id, "salePrice", e.target.value)
                  }
                  disabled={isDisabled}
                />
                <Input
                  type="date"
                  placeholder="Sale Date"
                  value={
                    saleData[purchase.id]?.saleDate?.split("T")[0] || ""
                  }
                  onChange={(e) =>
                    handleInputChange(purchase.id, "saleDate", e.target.value)
                  }
                  disabled={isDisabled}
                />
                {!batchMode && (
                  <Button
                    onClick={() => handleCreateSale(purchase.id)}
                    disabled={isDisabled}
                  >
                    Create Sale
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SaleCard
