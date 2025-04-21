import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const calculateRevenueForSale = async (saleId: number) => {
  const sale = await prisma.sale.findUnique({
    where: { id: saleId },
    include: {
      purchase: {
        include: {
          product: true, 
        },
      },
    },
  });

  if (!sale) throw new Error('Sale not found');

  const revenue = (sale.salePrice - sale.purchase.costPrice) * sale.quantity;

  return {
    saleId: sale.id,
    revenue,
    salePrice: sale.salePrice,
    costPrice: sale.purchase.costPrice,
    quantity: sale.quantity,
    productName: sale.purchase.product?.name || 'Unknown',
    saleDate: sale.saleDate,
  };
};

export const calculateRevenueForAllSales = async () => {
  const sales = await prisma.sale.findMany({
    include: {
      purchase: {
        include: {
          product: true,
        },
      },
    },
  });

  return sales.map((sale) => ({
    saleId: sale.id,
    revenue: (sale.salePrice - sale.purchase.costPrice) * sale.quantity,
    salePrice: sale.salePrice,
    costPrice: sale.purchase.costPrice,
    quantity: sale.quantity,
    productName: sale.purchase.product?.name || 'Unknown',
    saleDate: sale.saleDate,
  }));
};
