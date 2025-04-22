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
exports.calculateRevenueForAllSales = exports.calculateRevenueForSale = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const calculateRevenueForSale = (saleId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const sale = yield prisma.sale.findUnique({
        where: { id: saleId },
        include: {
            purchase: {
                include: {
                    product: true,
                },
            },
        },
    });
    if (!sale)
        throw new Error('Sale not found');
    const revenue = (sale.salePrice - sale.purchase.costPrice) * sale.quantity;
    return {
        saleId: sale.id,
        revenue,
        salePrice: sale.salePrice,
        costPrice: sale.purchase.costPrice,
        quantity: sale.quantity,
        productName: ((_a = sale.purchase.product) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown',
        saleDate: sale.saleDate,
    };
});
exports.calculateRevenueForSale = calculateRevenueForSale;
const calculateRevenueForAllSales = () => __awaiter(void 0, void 0, void 0, function* () {
    const sales = yield prisma.sale.findMany({
        include: {
            purchase: {
                include: {
                    product: true,
                },
            },
        },
    });
    return sales.map((sale) => {
        var _a;
        return ({
            saleId: sale.id,
            revenue: (sale.salePrice - sale.purchase.costPrice) * sale.quantity,
            salePrice: sale.salePrice,
            costPrice: sale.purchase.costPrice,
            quantity: sale.quantity,
            productName: ((_a = sale.purchase.product) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown',
            saleDate: sale.saleDate,
        });
    });
});
exports.calculateRevenueForAllSales = calculateRevenueForAllSales;
