import { Request, Response } from "express"
import prisma from "../db"

export const createSale = async (req: Request, res: Response): Promise<void> => {
  try {
    const { purchaseId, quantity, salePrice, saleDate } = req.body

    if (quantity <= 0) {
      res.status(400).json({ message: "Sale quantity must be greater than 0" })
      return
    }

    
    const purchase = await prisma.purchase.findUnique({
      where: { id: Number(purchaseId) },
      include: {
        product: true, 
      },
    })

    if (!purchase) {
      res.status(404).json({ message: "Purchase not found" })
      return
    }

    if (purchase.quantity === 0) {
      res.status(400).json({ message: "No remaining stock in the purchase" })
      return
    }

    if (quantity > purchase.quantity) {
      res.status(400).json({ message: "Not enough stock in the purchase" })
      return
    }

    const total = quantity * salePrice

    const sale = await prisma.sale.create({
      data: {
        purchaseId: Number(purchaseId),
        quantity,
        salePrice,
        saleDate: saleDate ? new Date(saleDate) : new Date(),
        total,
      },
    })

    await prisma.purchase.update({
      where: { id: Number(purchaseId) },
      data: { quantity: { decrement: quantity } },
    })

    await prisma.product.update({
      where: { id: purchase.productId },
      data: { quantity: { decrement: quantity } },
    })

    res.status(201).json(sale)
  } catch (error) {
    console.error("Error creating sale:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
