import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const findLogsByUserId = async (userId) => {
  return prisma.searchLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      query: true,
      createdAt: true,
      results: true,
    },
  });
}

export const createLog = async (userId, query, results) => {
  return prisma.searchLog.create({
    data: {
      userId,
      query,
      results,
    },
  });
}