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

export async function createLog(userId, query, results) {
  return prisma.searchLog.upsert({
    where: {
      userId_query: { userId, query }, // compound unique
    },
    update: {
      results,
      createdAt: new Date(), // refresh timestamp if searched again
    },
    create: {
      userId,
      query,
      results,
    },
  });
}