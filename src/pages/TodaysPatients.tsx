import { DashboardLayout } from "@/components/DashboardLayout";
import { doctorNavItems } from "@/lib/navItems";
import { doctorTodaysPatients } from "@/lib/mockData";
import { TableComponent } from "@/components/TableComponent";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const statusStyle = {
  Waiting: "bg-warning/10 text-warning",
  Consulting: "bg-info/10 text-info",
  Completed: "bg-success/10 text-success",
};

export default function TodaysPatients() {
  const navigate = useNavigate();

  const columns = [
    { header: "Patient Name", accessor: "name" as const },
    { header: "Symptoms", accessor: "symptoms" as const },
    { header: "Appointment", accessor: "appointmentTime" as const },
    { header: "Status", accessor: (row: typeof doctorTodaysPatients[0]) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle[row.status]}`}>{row.status}</span>
    )},
    { header: "Action", accessor: (row: typeof doctorTodaysPatients[0]) => (
      <div className="flex items-center gap-2">
        {row.status !== "Completed" ? (
          <Button size="sm" variant="outline" onClick={() => navigate("/doctor/consultation")}>
            {row.status === "Consulting" ? "Continue" : "Consult"}
          </Button>
        ) : <span className="text-xs text-muted-foreground">Done</span>}
        <Button size="sm" className="bg-primary/10 text-primary hover:bg-primary/20">Admit</Button>
      </div>
    )},
  ];

  return (
    <DashboardLayout items={doctorNavItems} title="Today's Patients">
      <div className="space-y-6">
        <h2 className="section-title">Assigned Patients</h2>
        <TableComponent columns={columns} data={doctorTodaysPatients} />
      </div>
    </DashboardLayout>
  );
}
