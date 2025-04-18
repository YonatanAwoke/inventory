import { Router } from "express";
import {
    createPurchase,
    getPurchaseById,
    getPurchases,
    updatePurchase,
    deletePurchase,
  } from "../controllers/purchase";
  

export const purchaseRouter: Router = Router();

purchaseRouter.get("/", getPurchases);
purchaseRouter.post("/create", createPurchase);
purchaseRouter.put("/:id", updatePurchase);
purchaseRouter.delete("/:id", deletePurchase)
purchaseRouter.get("/:id", getPurchaseById)