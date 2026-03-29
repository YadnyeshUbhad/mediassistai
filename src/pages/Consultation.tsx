import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { doctorNavItems } from "@/lib/navItems";
import { TranscriptPanel } from "@/components/TranscriptPanel";
import { patientApi } from "@/lib/api";
import { patients as mockPatients } from "@/lib/mockData";
import { User, Loader2 } from "lucide-react";

interface Patient {
  _id?: string;
  id?: string;
  name: string;
  age: number;
  patientId?: string;
}

export default function Consultation() {
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedPatientName, setSelectedPatientName] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await patientApi.list({ status: "Waiting" }) as any;
        const data: Patient[] = res.data || [];
        setPatients(data);
      } catch {
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedPatientId(id);
    const found = patients.find((p) => (p._id || p.id) === id);
    setSelectedPatientName(found?.name || "");
  };

  return (
    <DashboardLayout items={doctorNavItems} title="Start Consultation">
      <div className="space-y-6 max-w-4xl">
        {/* Patient selector */}
        <div className="stat-card">
          <label className="text-sm font-medium mb-2 block">Select Patient</label>
          <div className="relative">
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground p-3">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading patients...
              </div>
            ) : (
              <>
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  value={selectedPatientId}
                  onChange={handleSelect}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border-0 text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
                >
                  <option value="">Choose a patient...</option>
                  {patients.map((p) => {
                    const id = p._id || p.id || "";
                    return (
                      <option key={id} value={id}>
                        {p.name} — Age {p.age} {p.patientId ? `(${p.patientId})` : ""}
                      </option>
                    );
                  })}
                </select>
              </>
            )}
          </div>
          {selectedPatientName && (
            <p className="mt-2 text-sm text-primary font-medium">
              ✓ Selected: {selectedPatientName}
            </p>
          )}
        </div>

        <TranscriptPanel
          patientId={selectedPatientId || undefined}
          patientName={selectedPatientName || undefined}
        />
      </div>
    </DashboardLayout>
  );
}
