import {  Request, Response } from "express";
import prisma from "../db";

export const createPurchase = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, quantity, costPrice, expireDate, purchaseDate, budgetId } = req.body;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const budget = await prisma.budget.findUnique({ where: { id: budgetId } });
    if (!budget) {
      res.status(404).json({ error: "Selected budget not found" });
      return;
    }

    const purchaseCost = quantity * costPrice;

    if (budget.amount < purchaseCost) {
      res.status(400).json({ error: "Insufficient budget for this purchase." });
      return;
}

    const purchase = await prisma.purchase.create({
      data: {
        productId,
        budgetId: budget.id,
        quantity,
        costPrice,
        expireDate: expireDate ? new Date(expireDate) : undefined,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
      },
      include: {
        budget: {
          select: { name: true },
        },
      },
    });

    await prisma.budget.update({
      where: { id: budget.id },
      data: {
        amount: {
          decrement: purchaseCost,
        },
      },
    });

    res.json(purchase);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};


  

  export const getPurchases = async (_req: Request, res: Response) => {
    try {
      const purchases = await prisma.purchase.findMany({
        include: {
          product: true,
        },
      });
  
      const result = purchases.map((purchase) => ({
        id: purchase.id,
        productId: purchase.productId,
        productName: purchase.product.name,
        quantity: purchase.quantity,
        costPrice: purchase.costPrice,
        expireDate: purchase.expireDate,
        purchaseDate: purchase.purchaseDate,
      }));
  
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };
    

  export const getPurchaseById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid purchase ID" });
        return;
      }
  
      const purchase = await prisma.purchase.findUnique({
        where: { id },
        include: { 
          product: true,
          budget: true,
        },
      });
  
      if (!purchase) {
        res.status(404).json({ error: "Purchase not found" });
        return;
      }
  
      const result = {
        id: purchase.id,
        productId: purchase.productId,
        productName: purchase.product.name,
        quantity: purchase.quantity,
        costPrice: purchase.costPrice,
        expireDate: purchase.expireDate,
        purchaseDate: purchase.purchaseDate,
        budgetId: purchase.budget?.id || null,
      };
  
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };
  

export const updatePurchase = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { productId, quantity, costPrice, expireDate, purchaseDate, budgetId } = req.body;

  try {
    const purchase = await prisma.purchase.update({
      where: { id: Number(id) },
      data: {
        productId,
        quantity,
        costPrice,
        budgetId,
        expireDate: expireDate ? new Date(expireDate) : undefined,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
      },
    });

    res.json(purchase);
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Update failed" });
  }
};



export const deletePurchase = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.purchase.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Purchase deleted successfully" });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Delete failed" });
  }
};
