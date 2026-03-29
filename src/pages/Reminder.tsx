import { DashboardLayout } from "@/components/DashboardLayout";
import { patientNavItems } from "@/lib/navItems";
import { MedicineSchedule } from "@/components/MedicineSchedule";
import { patientMedicineSchedule } from "@/lib/mockData";
import { Sun, Cloud, Moon, Bell } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const timeSlots = [
  { label: "Morning", icon: Sun, time: "8:00 AM", items: patientMedicineSchedule.filter((m) => m.time.includes("AM")) },
  { label: "Afternoon", icon: Cloud, time: "2:00 PM", items: patientMedicineSchedule.filter((m) => m.time === "2:00 PM") },
  { label: "Night", icon: Moon, time: "8:00 PM", items: patientMedicineSchedule.filter((m) => m.time === "8:00 PM") },
];

export default function Reminder() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <DashboardLayout items={patientNavItems} title="Medication Schedule">
      <div className="space-y-6 max-w-2xl">
        {/* Notification Toggle */}
        <div className="stat-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Medication Reminders</p>
              <p className="text-xs text-muted-foreground">Get notified before each dose</p>
            </div>
          </div>
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`w-12 h-7 rounded-full transition-all duration-300 relative ${notificationsEnabled ? "bg-primary" : "bg-muted"}`}
          >
            <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-card shadow transition-all duration-300 ${notificationsEnabled ? "left-[22px]" : "left-0.5"}`} />
          </button>
        </div>

        {/* Time Slots */}
        {timeSlots.map((slot, i) => (
          <motion.div key={slot.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <slot.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{slot.label}</h3>
                <p className="text-xs text-muted-foreground">{slot.time}</p>
              </div>
            </div>
            <MedicineSchedule items={slot.items} />
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
}
