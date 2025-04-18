import { Request, Response } from "express";
import prisma from "../db";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, quantity, price, expireDate, categoryId } = req.body;

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      throw new Error("Category not found");
    }

    const product = await prisma.product.create({
      data: {
        name,
        quantity,
        price,
        expireDate: expireDate ? new Date(expireDate) : undefined,
        categoryId,
      },
    });

    res.json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });

    const filtered = products.map((product) => ({
      id: product.id,
      name: product.name,
      quantity: product.quantity,
      price: product.price,
      expireDate: product.expireDate,
      category: product.category.name,
    }));

    res.json(filtered);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, categoryId, quantity, price } = req.body;

  try {
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: { name, categoryId, quantity, price },
    });

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: "Product not found or update failed" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.product.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: "Product not found or delete failed" });
  }
};

export const getProductById = async (req: Request, res: Response) : Promise<void> =>  {
  try {
    const id = Number(req.params.id)
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid product ID" })
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    })

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const result = {
      id: product.id,
      name: product.name,
      quantity: product.quantity,
      price: product.price,
      expireDate: product.expireDate,
      categoryId: product.categoryId,
      category: product.category.name,
    }

    res.json(result)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}

