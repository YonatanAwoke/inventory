import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser"; 
import { PORT } from "./secrets";
import { rootRouter } from "./routes";

dotenv.config();

const app: Express = express();
const prisma = new PrismaClient(
  {
    log: ["query"],
  }
);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,              
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Inventory API running!");
});

app.use("/api", rootRouter);

app.listen(PORT, () => {
  console.log("Server running on port 3000");

});

