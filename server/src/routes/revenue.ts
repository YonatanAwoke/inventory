import { Router } from "express";
import { calculateRevenueForAllSales, calculateRevenueForSale } from "../controllers/revenue";
  

export const revenueRouter: Router = Router();

revenueRouter.get("/", async (req, res, next) => {
  try {
	const result = await calculateRevenueForAllSales();
	res.json(result);
  } catch (error) {
	next(error);
  }
});
revenueRouter.get("/:id", async (req, res, next) => {
  try {
	const saleId = parseInt(req.params.id, 10);
	const result = await calculateRevenueForSale(saleId);
	res.json(result);
  } catch (error) {
	next(error);
  }
});