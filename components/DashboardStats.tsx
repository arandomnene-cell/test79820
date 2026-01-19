import { BookOpen, CheckCircle, Clock } from "lucide-react";

interface DashboardStatsProps {
  inProgressCount: number;
  completedCount: number;
  hoursSpent: number;
}

export function DashboardStats({
  inProgressCount,
  completedCount,
  hoursSpent,
}: DashboardStatsProps) {
  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-3">
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-1.5 hover:bg-slate-100 transition-colors">
        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-eduBlue mb-0.5">
          <BookOpen className="w-4 h-4" />
        </div>
        <span className="text-2xl font-bold text-slate-900">
          {inProgressCount}
        </span>
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          In Progress
        </span>
      </div>

      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-1.5 hover:bg-slate-100 transition-colors">
        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-0.5">
          <CheckCircle className="w-4 h-4" />
        </div>
        <span className="text-2xl font-bold text-slate-900">
          {completedCount}
        </span>
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Completed
        </span>
      </div>

      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-1.5 hover:bg-slate-100 transition-colors">
        <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-0.5">
          <Clock className="w-4 h-4" />
        </div>
        <span className="text-2xl font-bold text-slate-900">
          {hoursSpent}
        </span>
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Hours Spent
        </span>
      </div>
    </aside>
  );
}