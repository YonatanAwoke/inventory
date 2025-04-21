import { Router } from "express";
import { createBudget, deleteBudget, getBudgetById, getBudgets, updateBudget } from "../controllers/budget";
  

export const budgetRouter: Router = Router();

budgetRouter.get("/", getBudgets);
budgetRouter.post("/create", createBudget);
budgetRouter.put("/:id", updateBudget);
budgetRouter.delete("/:id", deleteBudget);
budgetRouter.get("/:id", getBudgetById);
