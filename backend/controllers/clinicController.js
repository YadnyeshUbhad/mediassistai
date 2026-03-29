const Clinic = require("../models/Clinic");
const User = require("../models/User");

// ── POST /api/clinic/register ──────────────────────────────────────────────────
exports.registerClinic = async (req, res) => {
  try {
    const { name, address, city, phone, email, departments, licenseNo } = req.body;

    if (!name || !address) {
      return res.status(400).json({ success: false, message: "Clinic name and address are required." });
    }

    const clinic = await Clinic.create({
      name,
      address,
      city: city || "",
      phone: phone || "",
      email: email || "",
      ownerId: req.user._id,
      departments: departments || ["General"],
      licenseNo: licenseNo || "",
    });

    // Update user's clinicId
    await User.findByIdAndUpdate(req.user._id, { clinicId: clinic._id, role: "clinic_admin" });

    res.status(201).json({
      success: true,
      message: "Clinic registered successfully",
      data: clinic,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/clinic/:id ────────────────────────────────────────────────────────
exports.getClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id).populate("ownerId", "name email");
    if (!clinic) return res.status(404).json({ success: false, message: "Clinic not found." });
    res.json({ success: true, data: clinic });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/clinic ────────────────────────────────────────────────────────────
exports.getAllClinics = async (req, res) => {
  try {
    const clinics = await Clinic.find({ isActive: true }).populate("ownerId", "name email").sort({ createdAt: -1 });
    res.json({ success: true, count: clinics.length, data: clinics });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /api/clinic/:id ────────────────────────────────────────────────────────
exports.updateClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!clinic) return res.status(404).json({ success: false, message: "Clinic not found." });
    res.json({ success: true, message: "Clinic updated", data: clinic });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
