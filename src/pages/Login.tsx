import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Stethoscope, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { authApi, setAuth } from "@/lib/api";
import { toast } from "sonner";

const ROLE_ROUTES: Record<string, string> = {
  doctor:       "/doctor/dashboard",
  patient:      "/patient/dashboard",
  receptionist: "/reception/dashboard",
  staff:        "/staff/dashboard",
  clinic_admin: "/admin/dashboard",
  platform_admin:"/admin/dashboard",
};

export default function Login() {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState<"doctor" | "patient" | "receptionist" | "clinic_admin" | "staff">(
    (searchParams.get("role") as any) || "patient"
  );
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authApi.login({ email, password }) as any;
      if (res.success) {
        setAuth(res.data.token, res.data.user);
        toast.success(`Welcome back, ${res.data.user.name}!`);
        const dest = ROLE_ROUTES[res.data.user.role] || "/doctor/dashboard";
        navigate(dest);
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Quick demo login helper
  const demoLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl">MedAssist AI</span>
          </Link>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground mt-1">Sign in to your account</p>
        </div>

        {/* Role Toggle */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: "patient", label: "👤 Patient" },
            { id: "doctor", label: "🩺 Doctor" },
            { id: "receptionist", label: "📋 Reception" },
            { id: "staff", label: "🏥 Nurse/Staff" },
            { id: "clinic_admin", label: "⚙️ Admin" }
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setRole(r.id as any)}
              className={`flex-1 py-2 px-1 text-xs sm:text-sm rounded-lg font-medium transition-all ${
                role === r.id ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm mb-4">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border-0 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border-0 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? "Signing in..." : <> Login <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-medium hover:underline">Register</Link>
        </p>
      </motion.div>
    </div>
  );
}
