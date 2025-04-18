import { Request, Response } from "express";
import prisma from "../db";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const existing = await prisma.category.findUnique({ where: { name } });
    if (existing) {
      throw new Error("Category already exists");
    }

    const category = await prisma.category.create({
      data: { name },
    });

    res.json(category);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: true,
      },
    });

    res.json(categories);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const categories = await prisma.category.update({
      where: { id: Number(id) },
      data: { name },
    });

    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: "Category not found or update failed" });
  }
};


export const deleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      await prisma.category.delete({
        where: { id: Number(id) },
      });
  
      res.json({ message: "Category deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(404).json({ message: "Category not found or delete failed" });
    }
  };

export const getCategoryById = async (req: Request, res: Response) : Promise<void> =>  {
try {
    const id = Number(req.params.id)
    if (isNaN(id)) {
    res.status(400).json({ error: "Invalid category ID" })
    }

    const categories = await prisma.category.findUnique({
    where: { id }
    })

    if (!categories) {
    res.status(404).json({ error: "category not found" });
    return;
    }

    const result = {
    id: categories.id,
    name: categories.name,
    }

    res.json(result)
} catch (err: any) {
    res.status(500).json({ error: err.message })
}
}