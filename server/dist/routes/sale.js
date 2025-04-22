"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saleRouter = void 0;
const express_1 = require("express");
const sale_1 = require("../controllers/sale");
exports.saleRouter = (0, express_1.Router)();
exports.saleRouter.post("/create", sale_1.createSale);
