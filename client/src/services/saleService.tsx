export async function fetchSales() {
    const res = await fetch("http://localhost:3000/api/sales", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  
    if (!res.ok) throw new Error("Failed to fetch sales");
  
    const sales = await res.json();
  
    // Return data with editable fields
    type Sale = {
      id: number;
      purchase?: { product?: { name: string } };
      quantity: number;
      salePrice: number;
      saleDate: string;
      total: number;
      purchaseId: number;
    };

    return sales.map((sale: Sale) => ({
      id: sale.id,
      productName: sale.purchase?.product?.name || "Unknown",
      quantity: sale.quantity,       // editable
      salePrice: sale.salePrice,     // editable
      saleDate: sale.saleDate,       // editable
      total: sale.total,             // editable (or recomputed on frontend)
      purchaseId: sale.purchaseId,
    }));
  }
  

export async function createSale(data: {
    purchaseId: number;
    quantity: number;
    salePrice: number;
    saleDate?: string;
  }) {
    // Frontend validation
    if (data.quantity <= 0) {
      throw new Error("Sale quantity must be greater than 0");
    }
  
    // Fetch purchase data to validate remaining quantity
    const purchaseRes = await fetch(`http://localhost:3000/api/purchases/${data.purchaseId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  
    if (!purchaseRes.ok) {
      const errorData = await purchaseRes.json();
      throw new Error(errorData.message || "Failed to fetch purchase data");
    }
  
    const purchase = await purchaseRes.json();
  
    if (purchase.quantity <= 0) {
      throw new Error("Cannot create sale: purchase has no remaining stock");
    }
  
    if (data.quantity > purchase.quantity) {
      throw new Error("Sale quantity cannot exceed remaining purchase quantity");
    }
  
    // Create the sale
    const res = await fetch("http://localhost:3000/api/sales/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create sale");
    }
  
    return res.json();
  }
  