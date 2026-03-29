import { DashboardLayout } from "@/components/DashboardLayout";
import { receptionNavItems, doctorNavItems, staffNavItems } from "@/lib/navItems";
import { patients } from "@/lib/mockData";
import { getUser } from "@/lib/api";
import { TableComponent } from "@/components/TableComponent";
import { BedDouble } from "lucide-react";

export default function AdmittedPatients() {
  const admitted = patients.slice(0, 3);

  const columns = [
    { header: "Patient Name", accessor: "name" as const },
    { header: "Age", accessor: "age" as const },
    { header: "Department", accessor: "department" as const },
    { header: "Doctor", accessor: "assignedDoctor" as const },
    { header: "Status", accessor: () => (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-info/10 text-info">Admitted</span>
    )},
    { header: "Actions", accessor: () => {
      const u = getUser();
      const isDoc = u?.role === "doctor";
      const isStaff = u?.role === "staff";
      return (
        <div className="flex gap-2">
          {isDoc && <button className="px-3 py-1 bg-destructive/10 text-destructive hover:bg-destructive text-primary-foreground hover:text-white rounded-lg text-xs font-medium transition-colors">Discharge</button>}
          {isStaff && <button className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-medium transition-colors">Log Vitals</button>}
          <button className="px-3 py-1 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-lg text-xs font-medium transition-colors">View History</button>
        </div>
      );
    }},
  ];

  const getNav = () => {
    const r = getUser()?.role;
    if (r === "doctor") return doctorNavItems;
    if (r === "staff") return staffNavItems;
    return receptionNavItems;
  };

  return (
    <DashboardLayout items={getNav()} title="Admitted Patients">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <BedDouble className="h-6 w-6 text-primary" />
          <h2 className="section-title">Admitted Patients</h2>
        </div>
        <TableComponent columns={columns} data={admitted} />
      </div>
    </DashboardLayout>
  );
}
