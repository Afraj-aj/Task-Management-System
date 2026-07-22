import { ClipboardList, Clock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface StatsProps {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

export default function DashboardStats({ total, pending, inProgress, completed, overdue }: StatsProps) {
  const stats = [
    { label: "Total", value: total, icon: ClipboardList, accent: "text-primary", bg: "bg-primary/10", glow: "glow-gold" },
    { label: "Pending", value: pending, icon: Clock, accent: "text-yellow-600", bg: "bg-yellow-100", glow: "glow-yellow" },
    { label: "In Progress", value: inProgress, icon: Loader2, accent: "text-blue-600", bg: "bg-blue-100", glow: "glow-blue" },
    { label: "Completed", value: completed, icon: CheckCircle2, accent: "text-green-600", bg: "bg-green-100", glow: "glow-green" },
    { label: "Overdue", value: overdue, icon: AlertCircle, accent: "text-red-600", bg: "bg-red-100", glow: "glow-red" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className={`glass rounded-2xl p-5 animate-fade-in-up delay-${i + 1} ${stat.glow} cursor-default`}>
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
