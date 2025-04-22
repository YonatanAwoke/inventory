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
exports.deletePurchase = exports.updatePurchase = exports.getPurchaseById = exports.getPurchases = exports.createPurchase = void 0;
const db_1 = __importDefault(require("../db"));
const createPurchase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, quantity, costPrice, expireDate, purchaseDate, budgetId } = req.body;
        const product = yield db_1.default.product.findUnique({ where: { id: productId } });
        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        const budget = yield db_1.default.budget.findUnique({ where: { id: budgetId } });
        if (!budget) {
            res.status(404).json({ error: "Selected budget not found" });
            return;
        }
        const purchaseCost = quantity * costPrice;
        if (budget.amount < purchaseCost) {
            res.status(400).json({ error: "Insufficient budget for this purchase." });
            return;
        }
        const purchase = yield db_1.default.purchase.create({
            data: {
                productId,
                budgetId: budget.id,
                quantity,
                costPrice,
                expireDate: expireDate ? new Date(expireDate) : undefined,
                purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
            },
            include: {
                budget: {
                    select: { name: true },
                },
            },
        });
        yield db_1.default.budget.update({
            where: { id: budget.id },
            data: {
                amount: {
                    decrement: purchaseCost,
                },
            },
        });
        res.json(purchase);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.createPurchase = createPurchase;
const getPurchases = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const purchases = yield db_1.default.purchase.findMany({
            include: {
                product: true,
            },
        });
        const result = purchases.map((purchase) => ({
            id: purchase.id,
            productId: purchase.productId,
            productName: purchase.product.name,
            quantity: purchase.quantity,
            costPrice: purchase.costPrice,
            expireDate: purchase.expireDate,
            purchaseDate: purchase.purchaseDate,
        }));
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.getPurchases = getPurchases;
const getPurchaseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid purchase ID" });
            return;
        }
        const purchase = yield db_1.default.purchase.findUnique({
            where: { id },
            include: {
                product: true,
                budget: true,
            },
        });
        if (!purchase) {
            res.status(404).json({ error: "Purchase not found" });
            return;
        }
        const result = {
            id: purchase.id,
            productId: purchase.productId,
            productName: purchase.product.name,
            quantity: purchase.quantity,
            costPrice: purchase.costPrice,
            expireDate: purchase.expireDate,
            purchaseDate: purchase.purchaseDate,
            budgetId: ((_a = purchase.budget) === null || _a === void 0 ? void 0 : _a.id) || null,
        };
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getPurchaseById = getPurchaseById;
const updatePurchase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { productId, quantity, costPrice, expireDate, purchaseDate, budgetId } = req.body;
    try {
        const purchase = yield db_1.default.purchase.update({
            where: { id: Number(id) },
            data: {
                productId,
                quantity,
                costPrice,
                budgetId,
                expireDate: expireDate ? new Date(expireDate) : undefined,
                purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
            },
        });
        res.json(purchase);
    }
    catch (err) {
        res.status(400).json({ error: err.message || "Update failed" });
    }
});
exports.updatePurchase = updatePurchase;
const deletePurchase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield db_1.default.purchase.delete({
            where: { id: Number(id) },
        });
        res.json({ message: "Purchase deleted successfully" });
    }
    catch (err) {
        res.status(400).json({ error: err.message || "Delete failed" });
    }
});
exports.deletePurchase = deletePurchase;
