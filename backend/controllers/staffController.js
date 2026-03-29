const Staff = require("../models/Staff");

// ── POST /api/staff/add ────────────────────────────────────────────────────────
exports.addStaff = async (req, res) => {
  try {
    const { name, email, phone, role, department, shift, qualification, experience } = req.body;

    if (!name || !email || !role || !department) {
      return res.status(400).json({ success: false, message: "Name, email, role, and department are required." });
    }

    const clinicId = req.user.clinicId;
    if (!clinicId) {
      return res.status(400).json({ success: false, message: "No clinic associated with your account." });
    }

    const existing = await Staff.findOne({ email: email.toLowerCase(), clinicId });
    if (existing) {
      return res.status(400).json({ success: false, message: "Staff with this email already exists in your clinic." });
    }

    const staff = await Staff.create({
      clinicId,
      name,
      email: email.toLowerCase(),
      phone: phone || "",
      role,
      department,
      shift: shift || "Morning",
      qualification: qualification || "",
      experience: experience || 0,
    });

    res.status(201).json({ success: true, message: "Staff member added", data: staff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/staff/list ────────────────────────────────────────────────────────
exports.listStaff = async (req, res) => {
  try {
    const clinicId = req.user.clinicId;
    const { role, department, shift, status } = req.query;
    
    const filter = { clinicId };
    if (role) filter.role = role;
    if (department) filter.department = department;
    if (shift) filter.shift = shift;
    if (status) filter.status = status;

    const staff = await Staff.find(filter).sort({ role: 1, name: 1 });
    res.json({ success: true, count: staff.length, data: staff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/staff/:id ─────────────────────────────────────────────────────────
exports.getStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).populate("clinicId", "name");
    if (!staff) return res.status(404).json({ success: false, message: "Staff member not found." });
    res.json({ success: true, data: staff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /api/staff/:id ─────────────────────────────────────────────────────────
exports.updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!staff) return res.status(404).json({ success: false, message: "Staff member not found." });
    res.json({ success: true, message: "Staff updated", data: staff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE /api/staff/:id ──────────────────────────────────────────────────────
exports.deleteStaff = async (req, res) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Staff member removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
