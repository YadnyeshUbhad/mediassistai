import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { receptionNavItems } from "@/lib/navItems";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/Modal";
import { CheckCircle, UserPlus } from "lucide-react";

export default function PatientRegistration() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [generatedData, setGeneratedData] = useState({ patientId: "", queueNumber: 0 });
  const [form, setForm] = useState({
    name: "", age: "", gender: "Male", phone: "", address: "", symptoms: "", department: "General", assignDoctor: "", timeSlot: "",
  });

  const update = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratedData({ patientId: `P-${Date.now().toString().slice(-6)}`, queueNumber: Math.floor(Math.random() * 20) + 1 });
    setShowConfirm(true);
  };

  return (
    <DashboardLayout items={receptionNavItems} title="Register Patient">
      <div className="max-w-2xl space-y-6">
        <div className="stat-card space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><UserPlus className="h-5 w-5 text-primary" /></div>
            <h2 className="text-lg font-semibold">New Patient Registration</h2>
          </div>

          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium mb-1 block">Patient Name</label>
              <Input value={form.name} onChange={(e) => update("name", e.target.value)} required placeholder="Full name" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Age</label>
              <Input type="number" value={form.age} onChange={(e) => update("age", e.target.value)} required placeholder="30" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Gender</label>
              <select value={form.gender} onChange={(e) => update("gender", e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Phone</label>
              <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} required placeholder="9876543210" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Department</label>
              <select value={form.department} onChange={(e) => update("department", e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>General</option><option>Cardiology</option><option>Neurology</option><option>Pulmonology</option><option>Endocrinology</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Time Slot</label>
              <Input type="time" value={form.timeSlot} onChange={(e) => update("timeSlot", e.target.value)} required />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium mb-1 block">Address</label>
              <Input value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Address" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium mb-1 block">Symptoms</label>
              <Input value={form.symptoms} onChange={(e) => update("symptoms", e.target.value)} required placeholder="Describe symptoms" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium mb-1 block">Assign Doctor</label>
              <Input value={form.assignDoctor} onChange={(e) => update("assignDoctor", e.target.value)} placeholder="Dr. Name" />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" className="w-full" size="lg">Register Patient</Button>
            </div>
          </form>
        </div>
      </div>

      <Modal open={showConfirm} onClose={() => setShowConfirm(false)} title="Registration Successful">
        <div className="text-center space-y-4">
          <CheckCircle className="h-12 w-12 text-success mx-auto" />
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Patient ID</p>
            <p className="text-xl font-bold text-primary">{generatedData.patientId}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Queue Number</p>
            <p className="text-3xl font-bold">{generatedData.queueNumber}</p>
          </div>
          <Button onClick={() => setShowConfirm(false)} className="w-full">Done</Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
