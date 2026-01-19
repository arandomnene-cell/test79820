import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, CheckCircle, Clock, Heart } from "lucide-react";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const name = user.profile?.name || user.email.split("@")[0] || "User";

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id },
    include: {
      course: {
        include: {
          category: true,
        },
      },
    },
  });

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    select: { courseId: true },
  });
  const favoriteIds = new Set(favorites.map((f) => f.courseId));

  const completedCount = enrollments.filter((e) => e.status === "COMPLETED").length;
  const inProgressCount = enrollments.filter((e) => e.status === "IN_PROGRESS").length;

  const totalMinutesSpent = enrollments.reduce((acc, enrollment) => {
    const duration = enrollment.course.duration || 0;
    const progress = enrollment.progressPercent || 0;
    return acc + duration * (progress / 100);
  }, 0);
  const hoursSpent = Math.round(totalMinutesSpent / 60);

  const sortedCourses = enrollments
    .map((enrollment) => ({
      ...enrollment,
      isFavorite: favoriteIds.has(enrollment.courseId),
    }))
    .sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return b.course.updatedAt.getTime() - a.course.updatedAt.getTime();
    });

  const activeEnrollment =
    enrollments.find((e) => e.status === "IN_PROGRESS") || enrollments[0];

  return (
    <main className="bg-white p-6 lg:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-8 lg:gap-10">
        
        <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-8">
          
          <header className="pt-2">
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tighter text-slate-900 leading-tight">
              Hello, <span className="text-eduBlue">{name}</span>
            </h1>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-col gap-4">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-2 hover:bg-slate-100 transition-colors">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-eduBlue mb-1">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-3xl font-bold text-slate-900">
                {inProgressCount}
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                In Progress
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-2 hover:bg-slate-100 transition-colors">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-1">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="text-3xl font-bold text-slate-900">
                {completedCount}
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Completed
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-2 hover:bg-slate-100 transition-colors">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-1">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-3xl font-bold text-slate-900">
                {hoursSpent}
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Hours Spent
              </span>
            </div>
          </div>
        </aside>

        <div className="flex-1 w-full flex flex-col gap-8 min-w-0">
          
          {activeEnrollment ? (
            <section className="w-full shrink-0">
              <Link href={`/courses/${activeEnrollment.course.slug}`}>
                <div className="w-full bg-eduBlue rounded-3xl p-8 shadow-xl shadow-blue-900/10 text-white relative overflow-hidden group transition-transform active:scale-[0.99] duration-200 min-h-[260px] flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />

                  <div className="relative z-10 flex flex-col gap-6">
                    <div className="flex justify-between items-start">
                      <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium tracking-wide">
                        RESUME LEARNING
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl lg:text-4xl font-bold leading-tight mb-2">
                        {activeEnrollment.course.title}
                      </h2>

                      <p className="text-blue-100 text-sm font-medium">
                        {activeEnrollment.course.category.name} •{" "}
                        {activeEnrollment.course.level}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 space-y-3 w-full mt-6">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-bold text-blue-50 tracking-widest uppercase mb-1">Current Progress</span>
                      <span className="text-3xl font-bold text-white">{Math.round(activeEnrollment.progressPercent)}%</span>
                    </div>
                    <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.6)] transition-all duration-1000 ease-out"
                        style={{ width: `${activeEnrollment.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </section>
          ) : (
            <div className="p-10 bg-slate-50 rounded-3xl border border-slate-100 text-center flex flex-col items-center justify-center min-h-[260px]">
              <p className="text-slate-500 mb-6 text-lg">
                You haven't enrolled in any courses yet.
              </p>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center px-8 py-4 bg-eduBlue text-white font-bold rounded-2xl shadow-lg shadow-blue-900/20 hover:bg-blue-600 transition-all"
              >
                Start Learning
              </Link>
            </div>
          )}

          <section className="bg-slate-50 rounded-3xl border border-slate-200/60 p-6 shadow-sm flex flex-col max-h-[calc(100vh-2rem)]">
            <div className="flex items-center justify-between mb-6 shrink-0">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                My Courses
              </h2>
              <Link
                href="/courses"
                className="text-xs font-bold text-eduBlue hover:underline uppercase tracking-wide"
              >
                View All
              </Link>
            </div>

            <div className="overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              {sortedCourses.length > 0 ? (
                sortedCourses.map((item) => (
                  <Link
                    key={item.id}
                    href={`/courses/${item.course.slug}`}
                    className="group flex gap-4 p-3 bg-white border border-slate-100 rounded-2xl hover:border-eduBlue/40 hover:shadow-md transition-all duration-200 relative overflow-hidden"
                  >
                    {item.isFavorite && (
                      <div className="absolute top-0 right-0 p-2 z-10">
                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                      </div>
                    )}

                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                      <img
                        src={item.course.thumbnailUrl || "/thumbnail.jpeg"}
                        alt={item.course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                      <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-eduBlue transition-colors pr-6">
                        {item.course.title}
                      </h3>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs text-slate-500 truncate">
                          {item.course.category.name}
                        </span>
                        
                        <div className="flex items-center gap-2 shrink-0">
                            <span
                            className={`text-base font-black ${
                                item.progressPercent >= 100
                                ? "text-emerald-500"
                                : "text-slate-300 group-hover:text-eduBlue transition-colors"
                            }`}
                            >
                            {Math.round(item.progressPercent)}%
                            </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm italic">
                  <p>No active courses.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}