import { Router } from "express";
import { createSale } from "../controllers/sale";

export const saleRouter: Router = Router();

saleRouter.post("/create", createSale);
