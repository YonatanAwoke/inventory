import { useEffect, useState } from "react"
import { ShoppingBag, CheckCircle } from "lucide-react"
import { fetchPurchases } from "@/services/purchaseService"
import { createSale } from "@/services/saleService"

interface Purchase {
  id: number
  productId: number
  productName: string
  quantity: number
  costPrice: number
  expireDate?: string
  purchaseDate?: string
}

interface Sale {
  quantity?: number
  salePrice?: number
  saleDate?: string
}

function SaleCard() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [saleData, setSaleData] = useState<Record<number, Sale>>({})
  const [batchMode, setBatchMode] = useState(false)
  const [submitting, setSubmitting] = useState(false)

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
      setSubmitting(true)
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
  
      // Reset sale data for this purchase
      setSaleData(prev => {
        const newData = {...prev}
        delete newData[purchaseId]
        return newData
      })
      
      // Success notification
      alert("Sale created successfully!")
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Failed to create sale")
    } finally {
      setSubmitting(false)
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
      setSubmitting(true)
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
  
      // Reset all sale data
      setSaleData({})
      
      // Success notification
      alert("Sales created successfully!")
    } catch {
      alert("Failed to create one or more sales")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <ShoppingBag className="mr-2 h-6 w-6 text-[#8B5CF6]" />
            Create Sales
          </h2>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                id="batch-mode"
                type="checkbox"
                checked={batchMode}
                onChange={() => setBatchMode(!batchMode)}
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <label htmlFor="batch-mode" className="text-sm font-medium text-gray-700">
                Enable batch sale mode
              </label>
            </div>
            
            {batchMode && (
              <button
                onClick={handleCreateAllSales}
                disabled={submitting || Object.keys(saleData).length === 0}
                className={`px-4 py-2 rounded-md text-white font-medium transition-colors
                  ${submitting || Object.keys(saleData).length === 0 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-amber-500 hover:bg-amber-600'}`}
              >
                {submitting ? 'Processing...' : 'Create All Sales'}
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchases.map((purchase) => {
              const isOutOfStock = purchase.quantity <= 0;
              const sale = saleData[purchase.id] || {};
              const profit = sale.salePrice && sale.quantity
                ? (Number(sale.salePrice) - purchase.costPrice) * Number(sale.quantity)
                : 0;
                
              return (
                <div
                  key={purchase.id}
                  className={`relative rounded-lg overflow-hidden transition-all duration-300
                    ${isOutOfStock 
                      ? 'bg-gray-100 border border-gray-200' 
                      : 'bg-white border border-gray-200 hover:border-teal-200 hover:shadow-md'}`}
                >
                  {/* Status indicator */}
                  <div className="absolute top-3 right-3 flex items-center">
                    {isOutOfStock ? (
                      <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                        Out of Stock
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" /> Ready to sell
                      </span>
                    )}
                  </div>
                  
                  {/* Card header */}
                  <div className="bg-[#8B5CF6] p-4">
                    <h3 className="font-bold text-white text-lg truncate">{purchase.productName}</h3>
                    <div className="text-teal-100 text-sm mt-1">
                      Order #{purchase.id.toString().padStart(3, '0')}
                    </div>
                  </div>
                  
                  {/* Card content */}
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="text-gray-600 text-sm">Quantity:</div>
                      <div className="text-gray-900 font-medium">{purchase.quantity}</div>
                      
                      <div className="text-gray-600 text-sm">Cost Price:</div>
                      <div className="text-gray-900 font-medium">${purchase.costPrice.toFixed(2)}</div>
                      
                      {profit > 0 && !isOutOfStock && (
                        <>
                          <div className="text-gray-600 text-sm">Profit:</div>
                          <div className="text-green-600 font-medium">${profit.toFixed(2)}</div>
                        </>
                      )}
                    </div>
                    
                    <div className={`space-y-3 ${isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="Quantity"
                          value={sale.quantity || ""}
                          onChange={(e) => handleInputChange(purchase.id, "quantity", e.target.value)}
                          disabled={isOutOfStock}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                        />
                        <label className="absolute -top-2 left-2 px-1 bg-white text-xs text-gray-600">
                          Quantity
                        </label>
                      </div>
                      
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="Sale Price"
                          value={sale.salePrice || ""}
                          onChange={(e) => handleInputChange(purchase.id, "salePrice", e.target.value)}
                          disabled={isOutOfStock}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                        />
                        <label className="absolute -top-2 left-2 px-1 bg-white text-xs text-gray-600">
                          Sale Price ($)
                        </label>
                      </div>
                      
                      <div className="relative">
                        <input
                          type="date"
                          placeholder="Sale Date"
                          value={sale.saleDate?.split("T")[0] || ""}
                          onChange={(e) => handleInputChange(purchase.id, "saleDate", e.target.value)}
                          disabled={isOutOfStock}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                        />
                        <label className="absolute -top-2 left-2 px-1 bg-white text-xs text-gray-600">
                          Sale Date
                        </label>
                      </div>
                    </div>
                    
                    {!batchMode && !isOutOfStock && (
                      <button
                        onClick={() => handleCreateSale(purchase.id)}
                        disabled={submitting || !sale.quantity || !sale.salePrice}
                        className={`w-full py-2 px-4 rounded-md font-medium transition-colors
                          ${submitting || !sale.quantity || !sale.salePrice
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                            : 'bg-amber-500 text-white hover:bg-amber-600'}`}
                      >
                        {submitting ? 'Processing...' : 'Create Sale'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default SaleCard