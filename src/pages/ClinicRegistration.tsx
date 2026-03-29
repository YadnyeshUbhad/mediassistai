import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export default function ClinicRegistration() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    clinicName: "", clinicType: "Clinic", address: "", city: "", state: "",
    phone: "", email: "", numDoctors: "", numStaff: "",
  });

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => navigate("/admin/dashboard"), 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="stat-card text-center max-w-md space-y-4">
          <CheckCircle className="h-16 w-16 text-success mx-auto" />
          <h2 className="text-2xl font-bold">Clinic Registered!</h2>
          <p className="text-muted-foreground">Redirecting to your admin dashboard…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="stat-card w-full max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Register Your Clinic</h1>
            <p className="text-sm text-muted-foreground">Set up your clinic on MedAssist AI</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-sm font-medium mb-1 block">Clinic Name</label>
            <Input value={form.clinicName} onChange={(e) => update("clinicName", e.target.value)} required placeholder="MedAssist Clinic" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Clinic Type</label>
            <select value={form.clinicType} onChange={(e) => update("clinicType", e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option>Clinic</option>
              <option>Hospital</option>
              <option>Telemedicine</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required placeholder="clinic@email.com" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium mb-1 block">Address</label>
            <Input value={form.address} onChange={(e) => update("address", e.target.value)} required placeholder="123 Health Street" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">City</label>
            <Input value={form.city} onChange={(e) => update("city", e.target.value)} required placeholder="Mumbai" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">State</label>
            <Input value={form.state} onChange={(e) => update("state", e.target.value)} required placeholder="Maharashtra" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Phone</label>
            <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} required placeholder="9876543210" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">No. of Doctors</label>
            <Input type="number" value={form.numDoctors} onChange={(e) => update("numDoctors", e.target.value)} placeholder="5" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">No. of Staff</label>
            <Input type="number" value={form.numStaff} onChange={(e) => update("numStaff", e.target.value)} placeholder="10" />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" className="w-full" size="lg">Register Clinic</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
