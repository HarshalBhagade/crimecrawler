import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const findUserById = (id) => prisma.user.findUnique({ where: { id } });
export const findUserByEmail = (email) => prisma.user.findUnique({ where: { email } });
export const createUser = (email, password) => prisma.user.create({ data: { email, password } });