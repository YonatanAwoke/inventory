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
exports.getProductById = exports.deleteProduct = exports.updateProduct = exports.getProducts = exports.createProduct = void 0;
const db_1 = __importDefault(require("../db"));
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, quantity, price, expireDate, categoryId } = req.body;
        const category = yield db_1.default.category.findUnique({ where: { id: categoryId } });
        if (!category) {
            throw new Error("Category not found");
        }
        const product = yield db_1.default.product.create({
            data: {
                name,
                quantity,
                price,
                expireDate: expireDate ? new Date(expireDate) : undefined,
                categoryId,
            },
        });
        res.json(product);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.createProduct = createProduct;
const getProducts = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield db_1.default.product.findMany({
            include: {
                category: true,
            },
        });
        const filtered = products.map((product) => ({
            id: product.id,
            name: product.name,
            quantity: product.quantity,
            price: product.price,
            expireDate: product.expireDate,
            category: product.category.name,
        }));
        res.json(filtered);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.getProducts = getProducts;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, categoryId, quantity, price } = req.body;
    try {
        const product = yield db_1.default.product.update({
            where: { id: Number(id) },
            data: { name, categoryId, quantity, price },
        });
        res.json(product);
    }
    catch (err) {
        console.error(err);
        res.status(404).json({ message: "Product not found or update failed" });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield db_1.default.product.delete({
            where: { id: Number(id) },
        });
        res.json({ message: "Product deleted successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(404).json({ message: "Product not found or delete failed" });
    }
});
exports.deleteProduct = deleteProduct;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid product ID" });
        }
        const product = yield db_1.default.product.findUnique({
            where: { id },
            include: { category: true },
        });
        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        const result = {
            id: product.id,
            name: product.name,
            quantity: product.quantity,
            price: product.price,
            expireDate: product.expireDate,
            categoryId: product.categoryId,
            category: product.category.name,
        };
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getProductById = getProductById;
