import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import PathDetails from "@/components/PathDetail";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const path = await prisma.learningPath.findUnique({
    where: { slug },
  });

  if (!path) {
    return {
      title: "Path Not Found",
    };
  }

  return {
    title: `${path.title} | Learning Path`,
    description: path.description,
  };
}

export default async function PathDetailsPage({ params }: Props) {
  const { slug } = await params;

  const path = await prisma.learningPath.findUnique({
    where: {
      slug,
    },
    include: {
      items: {
        include: {
          course: {
            include: {
              category: true,
              _count: {
                select: {
                  items: true,
                },
              },
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!path) {
    notFound();
  }

  return <PathDetails path={path} />;
}
