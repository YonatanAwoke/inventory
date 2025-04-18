import { Router } from "express";
import { authRouter } from "./auth";
import { productRouter } from "./product";
import { categoryRouter } from "./category";
import { purchaseRouter } from "./purchase";
import { saleRouter } from "./sale";

export const rootRouter: Router = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/products", productRouter);
rootRouter.use("/categories", categoryRouter);
rootRouter.use("/purchases", purchaseRouter);
rootRouter.use("/sales", saleRouter);