import {
  LearningPath,
  LearningPathItem,
  Course,
  Category,
} from "@prisma/client";

export type PathUI = LearningPath & {
  items: (LearningPathItem & {
    course: Course;
  })[];
};

export type PathDetailUI = LearningPath & {
  items: (LearningPathItem & {
    course: Course & {
      category: Category;
      _count: { items: number };
    };
  })[];
};
