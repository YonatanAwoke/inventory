"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSale = void 0;
const db_1 = __importDefault(require("../db"));
const createSale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { purchaseId, quantity, salePrice, saleDate } = req.body;
        if (quantity <= 0) {
            res.status(400).json({ message: "Sale quantity must be greater than 0" });
            return;
        }
        const purchase = yield db_1.default.purchase.findUnique({
            where: { id: Number(purchaseId) },
            include: {
                product: true,
            },
        });
        if (!purchase) {
            res.status(404).json({ message: "Purchase not found" });
            return;
        }
        if (purchase.quantity === 0) {
            res.status(400).json({ message: "No remaining stock in the purchase" });
            return;
        }
        if (quantity > purchase.quantity) {
            res.status(400).json({ message: "Not enough stock in the purchase" });
            return;
        }
        const total = quantity * salePrice;
        const sale = yield db_1.default.sale.create({
            data: {
                purchaseId: Number(purchaseId),
                quantity,
                salePrice,
                saleDate: saleDate ? new Date(saleDate) : new Date(),
                total,
            },
        });
        yield db_1.default.purchase.update({
            where: { id: Number(purchaseId) },
            data: { quantity: { decrement: quantity } },
        });
        yield db_1.default.product.update({
            where: { id: purchase.productId },
            data: { quantity: { decrement: quantity } },
        });
        res.status(201).json(sale);
    }
    catch (error) {
        console.error("Error creating sale:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createSale = createSale;
