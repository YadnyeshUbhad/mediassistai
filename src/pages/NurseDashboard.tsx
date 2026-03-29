import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { staffNavItems } from "@/lib/navItems";
import { StatCard } from "@/components/StatCard";
import { BedDouble, AlertCircle, Clock, CalendarDays, Lock } from "lucide-react";

export default function NurseDashboard() {
  const [isWorkingHours, setIsWorkingHours] = useState(true);

  // Example check for working hours
  useEffect(() => {
    const hour = new Date().getHours();
    // Assuming 8 AM to 6 PM is working time
    if (hour < 8 || hour >= 18) {
      setIsWorkingHours(false);
    }
  }, []);

  if (!isWorkingHours) {
    return (
      <DashboardLayout items={staffNavItems} title="Access Restricted">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <Lock className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Outside Working Hours</h2>
          <p className="text-muted-foreground max-w-md">
            You are currently trying to access the portal outside your designated shift. 
            If you are working overtime, a doctor must grant you access to the patient records.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout items={staffNavItems} title="Nurse / Staff Dashboard">
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard title="Admitted Patients" value={12} icon={BedDouble} color="primary" />
          <StatCard title="Critical Priority" value={3} icon={AlertCircle} color="destructive" />
          <StatCard title="Upcoming Rounds" value={5} icon={Clock} color="warning" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="stat-card">
            <h3 className="font-semibold mb-4 text-lg flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Doctor Visit Plan (AI Generated)
            </h3>
            <div className="space-y-4">
               {[
                 { time: "10:00 AM", doc: "Dr. Smith", patient: "John Doe", type: "Routine Checkup" },
                 { time: "11:30 AM", doc: "Dr. Allen", patient: "Sarah Lee", type: "Post-surgery observation" },
                 { time: "01:00 PM", doc: "Dr. Smith", patient: "Mike Ross", type: "Symptom Review" }
               ].map((plan, i) => (
                 <div key={i} className="flex justify-between items-center p-3 sm:p-4 rounded-xl border border-border/50 bg-background hover:bg-muted/50 transition">
                   <div>
                     <p className="font-medium">{plan.patient} <span className="text-sm font-normal text-muted-foreground">with {plan.doc}</span></p>
                     <p className="text-xs text-muted-foreground mt-1">{plan.type}</p>
                   </div>
                   <div className="text-sm font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">{plan.time}</div>
                 </div>
               ))}
            </div>
          </div>
          
          <div className="stat-card">
             <h3 className="font-semibold mb-4 text-lg">Quick Actions</h3>
             <p className="text-sm text-muted-foreground mb-4">View and update the health condition and priorities of admitted patients.</p>
             <a href="/staff/admitted" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
               Manage Admitted Patients
             </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
