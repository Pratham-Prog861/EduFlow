import { mutation } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

const TABLE_CLEAR_ORDER = [
  "progress",
  "enrollments",
  "lectures",
  "sections",
  "courses",
  "users",
] as const;

type SeedTable = (typeof TABLE_CLEAR_ORDER)[number];

async function clearTable(ctx: any, table: SeedTable) {
  const docs = await ctx.db.query(table).collect();
  await Promise.all(docs.map((doc: { _id: string }) => ctx.db.delete(doc._id)));
  return docs.length;
}

async function clearAllTables(ctx: any) {
  const deleted: Record<SeedTable, number> = {
    progress: 0,
    enrollments: 0,
    lectures: 0,
    sections: 0,
    courses: 0,
    users: 0,
  };

  for (const table of TABLE_CLEAR_ORDER) {
    deleted[table] = await clearTable(ctx, table);
  }

  const totalDeleted = Object.values(deleted).reduce((acc, count) => acc + count, 0);
  return { deleted, totalDeleted };
}

const COURSE_CATALOG = [
  {
    title: "Master React",
    description: "Build reusable React apps with modern component architecture.",
    thumbnailUrl: "https://i.ytimg.com/vi/Tn6-PIqc4UM/hq720.jpg",
  },
  {
    title: "Next.js 16 Fullstack",
    description: "Learn App Router patterns, rendering strategies, and production setup.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "TypeScript for Teams",
    description: "Ship safer code with practical TypeScript patterns for frontend and backend.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Node.js API Essentials",
    description: "Design robust APIs with validation, auth, and scalable architecture.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "UI Systems with Tailwind",
    description: "Create consistent design systems and premium UI components.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "AI Apps with Gemini",
    description: "Integrate generative AI into real apps using practical workflows.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Convex Realtime Mastery",
    description: "Build reactive backends with Convex queries, mutations, and schema design.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Cloudinary Media Workflows",
    description: "Handle image and video uploads for modern LMS experiences.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Productive React Forms",
    description: "Master form UX, validation, and state with reusable patterns.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Advanced JavaScript",
    description: "Deepen your JS fundamentals and performance intuition.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "System Design Basics",
    description: "Understand reliability, scaling, and architecture tradeoffs.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Frontend Performance",
    description: "Speed up loading and interaction for better user outcomes.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "GraphQL in Practice",
    description: "Build typed APIs and client integrations with clean data flows.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Testing React Apps",
    description: "Write confidence-building tests for components and interactions.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Designing SaaS Dashboards",
    description: "Craft data-first interfaces that feel clear and premium.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Authentication with Clerk",
    description: "Implement secure auth flows with role-based experiences.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Analytics for Instructors",
    description: "Track learning outcomes and interpret course performance metrics.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1551281044-8b5bd9f17f75?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Career Launch for Developers",
    description: "Portfolio strategy, interview prep, and practical growth roadmap.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
  },
];

const FIRST_NAMES = [
  "Aarav",
  "Ishita",
  "Vivaan",
  "Anaya",
  "Kabir",
  "Diya",
  "Reyansh",
  "Kiara",
  "Advait",
  "Saanvi",
  "Arjun",
  "Myra",
  "Vihaan",
  "Aadhya",
  "Rudra",
  "Navya",
  "Krish",
  "Riya",
  "Dev",
  "Siya",
  "Aditya",
  "Naina",
  "Ira",
  "Atharv",
  "Tara",
  "Neel",
  "Pari",
  "Samarth",
  "Meera",
  "Pranav",
  "Anika",
];

const LAST_NAMES = [
  "Sharma",
  "Patel",
  "Verma",
  "Reddy",
  "Mehta",
  "Nair",
  "Kapoor",
  "Saxena",
];

function rotate<T>(items: T[], start: number, count: number): T[] {
  const result: T[] = [];
  for (let i = 0; i < count; i += 1) {
    result.push(items[(start + i) % items.length]);
  }
  return result;
}

export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const { deleted, totalDeleted } = await clearAllTables(ctx);

    return {
      ok: true,
      message: "All seedable data cleared successfully.",
      totalDeleted,
      deleted,
    };
  },
});

export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    const clearResult = await clearAllTables(ctx);

    const instructorId = await ctx.db.insert("users", {
      name: "Priya Instructor",
      email: "instructor@eduflow.dev",
      externalId: "seed_instructor_1",
      role: "instructor",
    });

    const assistantInstructorId = await ctx.db.insert("users", {
      name: "Rahul Mentor",
      email: "instructor2@eduflow.dev",
      externalId: "seed_instructor_2",
      role: "instructor",
    });

    const studentIds: Id<"users">[] = [];
    for (let i = 0; i < 30; i += 1) {
      const first = FIRST_NAMES[i % FIRST_NAMES.length];
      const last = LAST_NAMES[i % LAST_NAMES.length];
      const id = await ctx.db.insert("users", {
        name: `${first} ${last}`,
        email: `student${i + 1}@eduflow.dev`,
        externalId: `seed_student_${i + 1}`,
        role: "student",
      });
      studentIds.push(id);
    }

    const primaryCourses = COURSE_CATALOG.slice(0, 15);
    const secondaryCourses = COURSE_CATALOG.slice(15);
    const courseIds: Id<"courses">[] = [];
    const courseLectureIds = new Map<string, Id<"lectures">[]>();

    let createdSections = 0;
    let createdLectures = 0;

    for (let i = 0; i < primaryCourses.length; i += 1) {
      const template = primaryCourses[i];
      const courseId = await ctx.db.insert("courses", {
        title: template.title,
        description: template.description,
        thumbnailUrl: template.thumbnailUrl,
        instructorId,
        aiSummary: `Summary: ${template.description}`,
        isPublished: true,
      });
      courseIds.push(courseId);

      const lecturesForCourse: Id<"lectures">[] = [];
      for (let s = 1; s <= 3; s += 1) {
        const sectionId = await ctx.db.insert("sections", {
          courseId,
          title: `Section ${s}: Core Concepts`,
          order: s,
        });
        createdSections += 1;

        for (let l = 1; l <= 3; l += 1) {
          const lectureOrder = (s - 1) * 3 + l;
          const lectureId = await ctx.db.insert("lectures", {
            sectionId,
            courseId,
            title: `Lecture ${lectureOrder}: Practical Walkthrough`,
            videoUrl: "https://res.cloudinary.com/demo/video/upload/dog.mp4",
            isPreview: lectureOrder === 1,
            order: lectureOrder,
            duration: 240 + lectureOrder * 70,
          });
          lecturesForCourse.push(lectureId);
          createdLectures += 1;
        }
      }

      courseLectureIds.set(String(courseId), lecturesForCourse);
    }

    for (let i = 0; i < secondaryCourses.length; i += 1) {
      const template = secondaryCourses[i];
      const courseId = await ctx.db.insert("courses", {
        title: template.title,
        description: template.description,
        thumbnailUrl: template.thumbnailUrl,
        instructorId: assistantInstructorId,
        aiSummary: `Summary: ${template.description}`,
        isPublished: i % 2 === 0,
      });
      courseIds.push(courseId);

      const lecturesForCourse: Id<"lectures">[] = [];
      for (let s = 1; s <= 2; s += 1) {
        const sectionId = await ctx.db.insert("sections", {
          courseId,
          title: `Section ${s}: Essentials`,
          order: s,
        });
        createdSections += 1;

        for (let l = 1; l <= 2; l += 1) {
          const lectureOrder = (s - 1) * 2 + l;
          const lectureId = await ctx.db.insert("lectures", {
            sectionId,
            courseId,
            title: `Lecture ${lectureOrder}: Guided Session`,
            videoUrl: "https://res.cloudinary.com/demo/video/upload/dog.mp4",
            isPreview: lectureOrder === 1,
            order: lectureOrder,
            duration: 300 + lectureOrder * 60,
          });
          lecturesForCourse.push(lectureId);
          createdLectures += 1;
        }
      }

      courseLectureIds.set(String(courseId), lecturesForCourse);
    }

    let createdEnrollments = 0;
    let createdProgress = 0;
    let completedProgress = 0;

    for (let i = 0; i < courseIds.length; i += 1) {
      const courseId = courseIds[i];
      const lectures = courseLectureIds.get(String(courseId)) ?? [];
      if (lectures.length === 0) continue;

      const enrollmentCount = 8 + (i % 7);
      const selectedStudents = rotate(studentIds, i * 2, enrollmentCount);

      for (let s = 0; s < selectedStudents.length; s += 1) {
        const studentId = selectedStudents[s];
        await ctx.db.insert("enrollments", {
          userId: studentId,
          courseId,
        });
        createdEnrollments += 1;

        const completionPattern = (i + s) % 3;
        const completedLecturesCount =
          completionPattern === 0
            ? lectures.length
            : completionPattern === 1
              ? Math.max(1, Math.floor(lectures.length / 2))
              : 1;

        for (let l = 0; l < completedLecturesCount; l += 1) {
          await ctx.db.insert("progress", {
            userId: studentId,
            courseId,
            lectureId: lectures[l],
            completed: true,
          });
          createdProgress += 1;
          completedProgress += 1;
        }

        if (completedLecturesCount < lectures.length) {
          await ctx.db.insert("progress", {
            userId: studentId,
            courseId,
            lectureId: lectures[completedLecturesCount],
            completed: false,
          });
          createdProgress += 1;
        }
      }
    }

    return {
      ok: true,
      message: "Large seed dataset inserted successfully.",
      clearedBeforeSeed: clearResult,
      created: {
        users: 32,
        courses: COURSE_CATALOG.length,
        sections: createdSections,
        lectures: createdLectures,
        enrollments: createdEnrollments,
        progress: createdProgress,
        completedProgress,
      },
      ids: {
        instructorId,
        assistantInstructorId,
        firstCourseId: courseIds[0],
        firstStudentId: studentIds[0],
      },
    };
  },
});
