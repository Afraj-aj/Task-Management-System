import { type TaskStats } from "../../types";
import { ClipboardList, Clock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface StatsProps {
  stats: TaskStats;
  onStatClick?: (filter: string) => void;
}

export default function DashboardStats({ stats, onStatClick }: StatsProps) {
  const items = [
    { key: "total", label: "Total", value: stats.total, icon: ClipboardList, accent: "text-primary", bg: "bg-primary/10", glow: "glow-gold", filter: "" },
    { key: "pending", label: "Pending", value: stats.pending, icon: Clock, accent: "text-yellow-600", bg: "bg-yellow-100", glow: "glow-yellow", filter: "Pending" },
    { key: "in_progress", label: "In Progress", value: stats.in_progress, icon: Loader2, accent: "text-blue-600", bg: "bg-blue-100", glow: "glow-blue", filter: "In Progress" },
    { key: "completed", label: "Completed", value: stats.completed, icon: CheckCircle2, accent: "text-green-600", bg: "bg-green-100", glow: "glow-green", filter: "Completed" },
    { key: "overdue", label: "Overdue", value: stats.overdue, icon: AlertCircle, accent: "text-red-600", bg: "bg-red-100", glow: "glow-red", filter: "overdue" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {items.map((stat, i) => {
        const Icon = stat.icon;
        const clickable = onStatClick;
        return (
          <div
            key={stat.key}
            onClick={() => clickable && onStatClick(stat.filter)}
            className={`glass rounded-2xl p-5 animate-fade-in-up delay-${i + 1} ${stat.glow} ${clickable ? "cursor-pointer" : "cursor-default"}`}
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <Icon className={stat.accent} size={20} />
            </div>
            <p className="text-3xl font-bold text-text">{stat.value}</p>
            <p className="text-text-secondary text-sm mt-0.5">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
