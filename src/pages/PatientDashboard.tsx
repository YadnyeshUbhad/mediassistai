import { Pill, Calendar, Stethoscope, Clock, Star, MapPin } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MedicineSchedule } from "@/components/MedicineSchedule";
import { patientNavItems } from "@/lib/navItems";
import { patientMedicineSchedule } from "@/lib/mockData";
import { motion } from "framer-motion";

export default function PatientDashboard() {
  return (
    <DashboardLayout items={patientNavItems} title="Dashboard">
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard title="Active Medicines" value={3} icon={Pill} color="primary" />
          <StatCard title="Upcoming Doses" value={4} icon={Clock} color="warning" />
          <StatCard title="Doctor Visits" value={2} icon={Stethoscope} trend="Next: March 28" trendUp color="secondary" />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Today's Medicine Schedule</h3>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
          <MedicineSchedule items={patientMedicineSchedule} />
        </motion.div>

        {/* Book Appointment Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="stat-card">
          <h3 className="font-semibold mb-4 text-lg">Book an Appointment</h3>
          <p className="text-sm text-muted-foreground mb-4">Browse doctors available in your network and easily schedule consultations.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { id: 1, name: "Dr. Smith", spec: "General Medicine", fee: "₹500", rating: 4.8, location: "City Care Hospital" },
              { id: 2, name: "Dr. Allen", spec: "Cardiology", fee: "₹1200", rating: 4.9, location: "LifeLine Multi-Specialty" },
              { id: 3, name: "Dr. Lee", spec: "Neurology", fee: "₹900", rating: 4.7, location: "MedPlus Hospital" }
            ].map(doc => (
              <div key={doc.id} className="p-4 border border-border rounded-xl bg-background hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold">{doc.name}</h4>
                    <p className="text-xs text-primary bg-primary/10 inline-block px-2 py-0.5 rounded-full mt-1 mb-2">{doc.spec}</p>
                  </div>
                  <span className="flex items-center text-sm font-medium bg-warning/10 text-warning px-2 py-0.5 rounded-full"><Star className="h-3 w-3 mr-1 fill-warning" />{doc.rating}</span>
                </div>
                <p className="text-sm text-muted-foreground flex items-center mb-1"><MapPin className="h-3.5 w-3.5 mr-1" />{doc.location}</p>
                <div className="flex justify-between items-end mt-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Consultation Fee</p>
                    <p className="text-sm font-semibold">{doc.fee}</p>
                  </div>
                  <button className="px-5 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors">Book</button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
