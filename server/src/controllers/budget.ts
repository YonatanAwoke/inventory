import {  Request, Response } from "express";
import prisma from "../db";

export const createBudget = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, amount } = req.body;
  
      if (!name || amount == null) {
        res.status(400).json({ error: "Name and amount are required." });
        return;
      }
  
      if (typeof amount !== "number" || amount <= 0) {
        res.status(400).json({ error: "Amount must be a positive number greater than zero." });
        return;
      }
  
      const budget = await prisma.budget.create({
        data: {
          name,
          amount,
        },
      });
  
      res.status(201).json(budget);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };
  

  export const updateBudget = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, amount } = req.body;
  
      const existingBudget = await prisma.budget.findUnique({
        where: { id: Number(id) },
      });
  
      if (!existingBudget) {
        res.status(404).json({ error: "Budget not found" });
        return;
      }

      if (amount !== undefined && (typeof amount !== "number" || amount <= 0)) {
        res.status(400).json({ error: "Amount must be a positive number greater than zero." });
        return;
      }
  
      const updatedBudget = await prisma.budget.update({
        where: { id: Number(id) },
        data: {
          name: name ?? existingBudget.name,
          amount: amount ?? existingBudget.amount,
        },
      });
  
      res.json(updatedBudget);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };
  

  export const deleteBudget = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
  
      const budget = await prisma.budget.findUnique({ where: { id: Number(id) } });
      if (!budget) {
        res.status(404).json({ error: "Budget not found" });
        return;
      }
  
      await prisma.budget.delete({ where: { id: Number(id) } });
  
      res.json({ message: "Budget deleted successfully." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };
  

export const getBudgets = async (_req: Request, res: Response): Promise<void> => {
    try {
      const budgets = await prisma.budget.findMany({
        orderBy: { createdAt: "desc" },
      });
  
      res.json(budgets);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
};
  

export const getBudgetById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
  
      const budget = await prisma.budget.findUnique({
        where: { id: Number(id) },
        include: {
          purchases: {
            include: {
              product: true, 
            },
          },
        },
      });
  
      if (!budget) {
        res.status(404).json({ error: "Budget not found" });
        return;
      }
  
      res.json(budget);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };