"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function getNextCourseItem(courseId: string) {
  const user = await getCurrentUser();

  if (!user) return null;

  return await prisma.courseItem.findFirst({
    where: {
      courseId,
      OR: [
        {
          type: "MODULE",
          module: {
            progresses: {
              none: { userId: user.id },
            },
          },
        },
        {
          type: "WORKSHOP",
          workshop: {
            submissions: {
              none: { userId: user.id },
            },
          },
        },
      ],
    },
    orderBy: { position: "asc" },
    select: {
      id: true,
    },
  });
}

// export async function getNextPathCourse(pathId: string) {
//   const user = await requireUser();
// }
