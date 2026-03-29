import { DashboardLayout } from "@/components/DashboardLayout";
import { patientNavItems } from "@/lib/navItems";
import { Calendar, FileText, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";

const history = [
  { date: "2026-03-22", doctor: "Dr. Anand Mehta", diagnosis: "Viral Fever", prescriptions: 2 },
  { date: "2026-03-10", doctor: "Dr. Anand Mehta", diagnosis: "Routine Checkup", prescriptions: 0 },
  { date: "2026-02-15", doctor: "Dr. Priya Shah", diagnosis: "Sinus Infection", prescriptions: 3 },
  { date: "2026-01-20", doctor: "Dr. Anand Mehta", diagnosis: "Blood Pressure Review", prescriptions: 1 },
];

export default function PatientHistory() {
  return (
    <DashboardLayout items={patientNavItems} title="Health History">
      <div className="space-y-4 max-w-3xl">
        {history.map((h, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Stethoscope className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium">{h.diagnosis}</p>
              <p className="text-sm text-muted-foreground">{h.doctor}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {h.date}
              </div>
              {h.prescriptions > 0 && (
                <div className="flex items-center gap-1 text-xs text-primary mt-1">
                  <FileText className="h-3 w-3" />
                  {h.prescriptions} prescription{h.prescriptions > 1 ? "s" : ""}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
}
