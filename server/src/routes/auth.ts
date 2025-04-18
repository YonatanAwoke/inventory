import { Router } from "express";
import { login, signup } from "../controllers/auth";

export const authRouter: Router = Router();

authRouter.use("/login", login);
authRouter.use("/signup", signup); 