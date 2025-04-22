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
exports.getBudgetById = exports.getBudgets = exports.deleteBudget = exports.updateBudget = exports.createBudget = void 0;
const db_1 = __importDefault(require("../db"));
const createBudget = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, amount } = req.body;
        if (!name || amount == null) {
            res.status(400).json({ error: "Name and amount are required." });
            return;
        }
        if (typeof amount !== "number" || amount <= 0) {
            res.status(400).json({ error: "Amount must be a positive number greater than zero." });
            return;
        }
        const budget = yield db_1.default.budget.create({
            data: {
                name,
                amount,
            },
        });
        res.status(201).json(budget);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.createBudget = createBudget;
const updateBudget = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, amount } = req.body;
        const existingBudget = yield db_1.default.budget.findUnique({
            where: { id: Number(id) },
        });
        if (!existingBudget) {
            res.status(404).json({ error: "Budget not found" });
            return;
        }
        if (amount !== undefined && (typeof amount !== "number" || amount <= 0)) {
            res.status(400).json({ error: "Amount must be a positive number greater than zero." });
            return;
        }
        const updatedBudget = yield db_1.default.budget.update({
            where: { id: Number(id) },
            data: {
                name: name !== null && name !== void 0 ? name : existingBudget.name,
                amount: amount !== null && amount !== void 0 ? amount : existingBudget.amount,
            },
        });
        res.json(updatedBudget);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.updateBudget = updateBudget;
const deleteBudget = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const budget = yield db_1.default.budget.findUnique({ where: { id: Number(id) } });
        if (!budget) {
            res.status(404).json({ error: "Budget not found" });
            return;
        }
        yield db_1.default.budget.delete({ where: { id: Number(id) } });
        res.json({ message: "Budget deleted successfully." });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.deleteBudget = deleteBudget;
const getBudgets = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const budgets = yield db_1.default.budget.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.json(budgets);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getBudgets = getBudgets;
const getBudgetById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const budget = yield db_1.default.budget.findUnique({
            where: { id: Number(id) },
            include: {
                purchases: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!budget) {
            res.status(404).json({ error: "Budget not found" });
            return;
        }
        res.json(budget);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getBudgetById = getBudgetById;
