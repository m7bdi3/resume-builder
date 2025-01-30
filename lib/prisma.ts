import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const primsa = globalThis.prismaGlobal ?? prismaClientSingleton();

export default primsa;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = primsa;
