import { DashboardLayout } from "@/components/DashboardLayout";
import { doctorNavItems } from "@/lib/navItems";
import { PrescriptionCard } from "@/components/PrescriptionCard";
import { prescriptions } from "@/lib/mockData";

export default function Prescriptions() {
  return (
    <DashboardLayout items={doctorNavItems} title="Prescriptions">
      <div className="grid md:grid-cols-2 gap-6">
        {prescriptions.map((p) => (
          <PrescriptionCard key={p.id} patientName={p.patientName} medicine={p.medicine} dosage={p.dosage} frequency={p.frequency} duration={p.duration} instructions={p.instructions} date={p.date} onView={() => {}} />
        ))}
      </div>
    </DashboardLayout>
  );
}
