import { prisma } from "@/lib/prisma";

export async function getPaths() {
  return await prisma.learningPath.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: {
      items: {
        include: {
          course: true,
        },
        orderBy: { position: "asc" },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
