import { DashboardLayout } from "@/components/DashboardLayout";
import { adminNavItems } from "@/lib/navItems";
import { StatCard } from "@/components/StatCard";
import { Users, CalendarClock, Building2, UserPlus, Stethoscope } from "lucide-react";
import { staffMembers, patients } from "@/lib/mockData";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const doctors = staffMembers.filter((s) => s.role === "Doctor").length;
  const active = staffMembers.filter((s) => s.status === "Active").length;

  const newPatients = patients.slice(0, 3);
  const patientsByDoctor = [
    { doc: "Dr. Anand Mehta", patients: ["Rajesh Kumar", "Sunita Sharma"] },
    { doc: "Dr. Sarah Lee", patients: ["Amit Patel", "Priya Singh", "Neha Deshmukh"] },
  ];

  return (
    <DashboardLayout items={adminNavItems} title="Clinic Admin">
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard title="Total Staff" value={staffMembers.length} icon={Users} color="primary" />
          <StatCard title="Doctors" value={doctors} icon={Building2} color="secondary" />
          <StatCard title="Active Staff" value={active} icon={CalendarClock} color="success" />
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <a href="/admin/staff" className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">Manage Staff</a>
            <a href="/admin/shifts" className="px-4 py-2 rounded-lg bg-secondary/10 text-secondary text-sm font-medium hover:bg-secondary/20 transition-colors">Manage Shifts</a>
            <a href="/register-clinic" className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80 transition-colors">Register Clinic</a>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Newly Registered Patients */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" /> Newly Registered Patients
            </h3>
            <div className="space-y-3">
              {newPatients.map((p, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl border border-border/50 bg-background">
                  <div>
                    <p className="font-medium text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Age: {p.age} • {p.assignedDoctor}</p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full">New</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Patients by Doctor */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-secondary" /> Patients per Doctor
            </h3>
            <div className="space-y-4">
              {patientsByDoctor.map((item, i) => (
                <div key={i} className="space-y-2">
                  <h4 className="text-sm font-bold text-muted-foreground">{item.doc}</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.patients.map((pName, j) => (
                      <span key={j} className="text-xs font-medium px-2.5 py-1 bg-muted rounded-md">{pName}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
