"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const secrets_1 = require("./secrets");
const routes_1 = require("./routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient({
    log: ["query"],
});
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.get("/", (req, res) => {
    res.send("Inventory API running!");
});
app.use("/api", routes_1.rootRouter);
app.listen(secrets_1.PORT, () => {
    console.log("Server running on port 3000");
});
