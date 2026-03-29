import { Users, Calendar, FileText, Sparkles, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { StatCard } from "@/components/StatCard";
import { DashboardLayout } from "@/components/DashboardLayout";
import { doctorNavItems } from "@/lib/navItems";
import { consultationChartData, medicineUsageData } from "@/lib/mockData";
import { motion } from "framer-motion";

export default function DoctorDashboard() {
  return (
    <DashboardLayout items={doctorNavItems} title="Dashboard">
      <div className="space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Patients" value={248} icon={Users} trend="12% from last month" trendUp color="primary" />
          <StatCard title="Today's Consultations" value={12} icon={Calendar} trend="3 more than yesterday" trendUp color="secondary" />
          <StatCard title="Active Prescriptions" value={86} icon={FileText} color="success" />
          <StatCard title="AI Suggestions" value={34} icon={Sparkles} trend="Used this week" trendUp color="warning" />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Consultations Per Week</h3>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={consultationChartData}>
                <defs>
                  <linearGradient id="colorConsultations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(210, 90%, 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(210, 90%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(215, 15%, 50%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 15%, 50%)" />
                <Tooltip />
                <Area type="monotone" dataKey="consultations" stroke="hsl(210, 90%, 50%)" fillOpacity={1} fill="url(#colorConsultations)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="stat-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Medicine Usage</h3>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={medicineUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(215, 15%, 50%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 15%, 50%)" />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(174, 60%, 45%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
