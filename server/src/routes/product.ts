import { Router } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/product";

export const productRouter: Router = Router();

productRouter.get("/", getProducts);
productRouter.post("/create", createProduct);
productRouter.put("/:id", updateProduct);
productRouter.delete("/:id", deleteProduct)
productRouter.get("/:id", getProductById)
