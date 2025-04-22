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
Object.defineProperty(exports, "__esModule", { value: true });
exports.revenueRouter = void 0;
const express_1 = require("express");
const revenue_1 = require("../controllers/revenue");
exports.revenueRouter = (0, express_1.Router)();
exports.revenueRouter.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, revenue_1.calculateRevenueForAllSales)();
        res.json(result);
    }
    catch (error) {
        next(error);
    }
}));
exports.revenueRouter.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const saleId = parseInt(req.params.id, 10);
        const result = yield (0, revenue_1.calculateRevenueForSale)(saleId);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
}));
