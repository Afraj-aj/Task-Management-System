import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login as loginApi } from "../services/authService";
import { ListTodo } from "lucide-react";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { token, user } = await loginApi(email, password);
      login(token, user);
      toast.success(`Welcome back, ${user.name}!`);
      navigate("/");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg relative overflow-hidden px-4">
      <div className="bg-mesh" />

      {/* Decorative floating shapes */}
      <div className="floating-shape w-72 h-72 bg-primary top-[-10%] left-[-5%] animate-float" style={{ animationDelay: "0s" }} />
      <div className="floating-shape w-48 h-48 bg-blue-500 bottom-[10%] right-[-5%] animate-float" style={{ animationDelay: "1.5s" }} />
      <div className="floating-shape w-24 h-24 bg-green-500 top-[60%] left-[10%] animate-float" style={{ animationDelay: "3s" }} />
      <div className="floating-shape w-16 h-16 bg-purple-500 top-[20%] right-[15%] animate-float" style={{ animationDelay: "0.8s" }} />

      {/* Login Card */}
      <div className="w-full max-w-md glass-strong rounded-3xl p-8 relative z-10 animate-fade-in-up glow-gold">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/30 animate-float">
            <ListTodo className="text-white" size={30} />
          </div>
          <h1 className="text-2xl font-bold text-text">TaskFlow</h1>
          <p className="text-text-secondary mt-1 text-sm">Sign in to manage your tasks</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-danger/10 text-danger p-3 rounded-xl text-sm animate-fade-in">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border text-text focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="name@test.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border text-text focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover glow-gold disabled:opacity-50 active:scale-100"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-text-secondary text-xs mt-6">
          Demo: admin@test.com / 123456
        </p>
      </div>
    </div>
  );
}
