interface StatsProps {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

export default function DashboardStats({ total, pending, inProgress, completed, overdue }: StatsProps) {
  const stats = [
    { label: "Total Tasks", value: total, color: "bg-primary" },
    { label: "Pending", value: pending, color: "bg-yellow-500" },
    { label: "In Progress", value: inProgress, color: "bg-blue-500" },
    { label: "Completed", value: completed, color: "bg-green-500" },
    { label: "Overdue", value: overdue, color: "bg-red-500" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-surface rounded-xl border border-border p-4">
          <div className={`w-2 h-2 rounded-full ${stat.color} mb-2`} />
          <p className="text-2xl font-bold text-text">{stat.value}</p>
          <p className="text-text-secondary text-sm">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
