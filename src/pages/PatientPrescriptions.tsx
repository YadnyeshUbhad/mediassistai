import { DashboardLayout } from "@/components/DashboardLayout";
import { PrescriptionCard } from "@/components/PrescriptionCard";
import { patientNavItems } from "@/lib/navItems";
import { patientPrescriptions } from "@/lib/mockData";

export default function PatientPrescriptions() {
  return (
    <DashboardLayout items={patientNavItems} title="My Prescriptions">
      <div className="grid md:grid-cols-2 gap-6">
        {patientPrescriptions.map((p) => (
          <PrescriptionCard key={p.id} doctorName={p.doctorName} medicine={p.medicine} dosage={p.dosage} frequency={p.frequency} duration={p.duration} instructions={p.instructions} date={p.date} />
        ))}
      </div>
    </DashboardLayout>
  );
}
