import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-bg">
      <header className="bg-surface border-b border-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-text">Task Manager</h1>
          <div className="flex items-center gap-3">
            <span className="text-text-secondary text-sm hidden sm:block">{user?.name}</span>
            <button onClick={logout} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-text-secondary">Dashboard coming soon...</p>
      </main>
    </div>
  );
}
