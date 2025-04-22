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
exports.getCategoryById = exports.deleteCategory = exports.updateCategory = exports.getCategories = exports.createCategory = void 0;
const db_1 = __importDefault(require("../db"));
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const existing = yield db_1.default.category.findUnique({ where: { name } });
        if (existing) {
            throw new Error("Category already exists");
        }
        const category = yield db_1.default.category.create({
            data: { name },
        });
        res.json(category);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.createCategory = createCategory;
const getCategories = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield db_1.default.category.findMany({
            include: {
                products: true,
            },
        });
        res.json(categories);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.getCategories = getCategories;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const categories = yield db_1.default.category.update({
            where: { id: Number(id) },
            data: { name },
        });
        res.json(categories);
    }
    catch (err) {
        console.error(err);
        res.status(404).json({ message: "Category not found or update failed" });
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield db_1.default.category.delete({
            where: { id: Number(id) },
        });
        res.json({ message: "Category deleted successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(404).json({ message: "Category not found or delete failed" });
    }
});
exports.deleteCategory = deleteCategory;
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid category ID" });
        }
        const categories = yield db_1.default.category.findUnique({
            where: { id }
        });
        if (!categories) {
            res.status(404).json({ error: "category not found" });
            return;
        }
        const result = {
            id: categories.id,
            name: categories.name,
        };
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getCategoryById = getCategoryById;
