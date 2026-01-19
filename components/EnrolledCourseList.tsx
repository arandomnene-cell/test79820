import { EnrolledCourseCard } from "@/components/EnrolledCourseCard";

interface EnrolledCourseListProps {
  courses: any[];
}

export function EnrolledCourseList({ courses }: EnrolledCourseListProps) {
  return (
    <div className="flex-1 w-full min-w-0">
      <section className="bg-slate-50 rounded-3xl border border-slate-200/60 p-5 shadow-sm flex flex-col h-auto lg:h-[26rem]">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            My Courses
          </h2>
        </div>

        <div className="overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent flex-1">
          {courses.length > 0 ? (
            courses.map((item) => (
              <EnrolledCourseCard key={item.id} enrollment={item} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs italic">
              <p>No active courses.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}