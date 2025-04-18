import { Router } from "express";
import { login, signup } from "../controllers/auth";
import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from "../controllers/category";

export const categoryRouter: Router = Router();

categoryRouter.get("/", getCategories); 
categoryRouter.post("/create", createCategory);
categoryRouter.put("/:id", updateCategory);
categoryRouter.delete("/:id", deleteCategory)
categoryRouter.get("/:id", getCategoryById)