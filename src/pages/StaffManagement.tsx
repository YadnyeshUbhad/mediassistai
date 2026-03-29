import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { adminNavItems } from "@/lib/navItems";
import { TableComponent } from "@/components/TableComponent";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { staffApi } from "@/lib/api";
import { staffMembers as mockStaff } from "@/lib/mockData";

interface StaffMember {
  _id?: string;
  id: string; // Made required for TableComponent
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  shift: string;
  status: string;
  qualification?: string;
  experience?: number;
}

const emptyForm = {
  name: "", role: "Doctor", department: "", email: "",
  phone: "", shift: "Morning", qualification: "", experience: 0,
};

export default function StaffManagement() {
  const [staff, setStaff]       = useState<StaffMember[]>([]);
  const [loading, setLoading]   = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm]         = useState(emptyForm);
  const [saving, setSaving]     = useState(false);

  const update = (key: string, value: string | number) =>
    setForm((p) => ({ ...p, [key]: value }));

  const loadStaff = useCallback(async () => {
    setLoading(true);
    try {
      const res = await staffApi.list() as any;
      const data: any[] = res.data || [];
      setStaff(data.map(d => ({ ...d, id: d.id || d._id || "" })));
    } catch {
      setStaff([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadStaff(); }, [loadStaff]);

  const openAdd  = () => { setEditingId(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (s: StaffMember) => {
    setEditingId(s._id || s.id || null);
    setForm({ name: s.name, role: s.role, department: s.department, email: s.email,
               phone: s.phone, shift: s.shift, qualification: s.qualification || "", experience: s.experience || 0 });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await staffApi.delete(id);
      toast.success("Staff member removed");
      loadStaff();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.email || !form.department) {
      toast.error("Name, email, and department are required");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await staffApi.update(editingId, form);
        toast.success("Staff member updated");
      } else {
        await staffApi.add(form);
        toast.success("Staff member added");
      }
      setModalOpen(false);
      loadStaff();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { header: "Name",       accessor: "name"       as const },
    { header: "Role",       accessor: "role"       as const },
    { header: "Department", accessor: "department" as const },
    { header: "Shift",      accessor: "shift"      as const },
    { header: "Status", accessor: (row: StaffMember) => (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
        row.status === "Active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
      }`}>{row.status}</span>
    )},
    { header: "Actions", accessor: (row: StaffMember) => (
      <div className="flex gap-1">
        <button onClick={() => openEdit(row)} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <Pencil className="h-4 w-4" />
        </button>
        <button onClick={() => handleDelete(row._id || row.id || "")}
          className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    )},
  ];

  return (
    <DashboardLayout items={adminNavItems} title="Staff Management">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="section-title">Staff Members ({staff.length})</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={loadStaff} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add Staff</Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <TableComponent columns={columns} data={staff} />
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Staff" : "Add Staff"}>
        <div className="space-y-3">
          <div><label className="form-label">Name *</label><Input placeholder="Dr. Name" value={form.name} onChange={(e) => update("name", e.target.value)} /></div>
          <div>
            <label className="form-label">Role *</label>
            <select value={form.role} onChange={(e) => update("role", e.target.value)} className="form-select w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option>Doctor</option><option>Nurse</option><option>Receptionist</option>
              <option>Pharmacist</option><option>Lab Technician</option><option>Admin</option>
            </select>
          </div>
          <div><label className="form-label">Department *</label><Input placeholder="Cardiology, General..." value={form.department} onChange={(e) => update("department", e.target.value)} /></div>
          <div><label className="form-label">Email *</label><Input type="email" placeholder="staff@clinic.com" value={form.email} onChange={(e) => update("email", e.target.value)} /></div>
          <div><label className="form-label">Phone</label><Input placeholder="9876543210" value={form.phone} onChange={(e) => update("phone", e.target.value)} /></div>
          <div>
            <label className="form-label">Shift</label>
            <select value={form.shift} onChange={(e) => update("shift", e.target.value)} className="form-select w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option>Morning</option><option>Afternoon</option><option>Evening</option><option>Night</option>
            </select>
          </div>
          <div><label className="form-label">Qualification</label><Input placeholder="MBBS, MD..." value={form.qualification} onChange={(e) => update("qualification", e.target.value)} /></div>
          <div><label className="form-label">Experience (years)</label><Input type="number" placeholder="5" value={form.experience} onChange={(e) => update("experience", Number(e.target.value))} /></div>
          <Button onClick={handleSave} className="w-full" disabled={saving}>
            {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving...</> : (editingId ? "Save Changes" : "Add Staff")}
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
