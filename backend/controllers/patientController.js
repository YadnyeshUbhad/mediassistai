const Patient = require("../models/Patient");

// ── POST /api/patient/register ─────────────────────────────────────────────────
exports.registerPatient = async (req, res) => {
  try {
    const {
      name, age, gender, phone, address, email,
      bloodGroup, symptoms, medicalHistory, allergies,
      department, doctorName, doctorAssigned,
    } = req.body;

    if (!name || !age || !gender || !symptoms) {
      return res.status(400).json({ success: false, message: "Name, age, gender, and symptoms are required." });
    }

    const clinicId = req.user.clinicId;
    if (!clinicId) {
      return res.status(400).json({ success: false, message: "No clinic associated with your account." });
    }

    const patient = await Patient.create({
      name,
      age: Number(age),
      gender,
      phone: phone || "",
      address: address || "",
      email: email || "",
      bloodGroup: bloodGroup || "",
      symptoms,
      medicalHistory: medicalHistory || "",
      allergies: allergies || [],
      department: department || "General",
      doctorName: doctorName || "",
      doctorAssigned: doctorAssigned || null,
      clinicId,
      registeredBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Patient registered successfully",
      data: patient,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/patient/list ──────────────────────────────────────────────────────
exports.listPatients = async (req, res) => {
  try {
    const clinicId = req.user.clinicId;
    const { status, department, search, page = 1, limit = 20 } = req.query;
    
    const filter = { clinicId };
    if (status) filter.status = status;
    if (department) filter.department = department;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { patientId: { $regex: search, $options: "i" } },
        { symptoms: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [patients, total] = await Promise.all([
      Patient.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("doctorAssigned", "name department"),
      Patient.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count: patients.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: patients,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/patient/:id ───────────────────────────────────────────────────────
exports.getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate("doctorAssigned", "name department")
      .populate("clinicId", "name address")
      .populate("registeredBy", "name");
    
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found." });
    res.json({ success: true, data: patient });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /api/patient/:id ───────────────────────────────────────────────────────
exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found." });
    res.json({ success: true, message: "Patient updated", data: patient });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/patient/queue ─────────────────────────────────────────────────────
exports.getQueue = async (req, res) => {
  try {
    const clinicId = req.user.clinicId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const patients = await Patient.find({
      clinicId,
      status: { $in: ["Waiting", "Consulting"] },
      createdAt: { $gte: today },
    })
      .sort({ queueNumber: 1 })
      .populate("doctorAssigned", "name department");

    res.json({ success: true, count: patients.length, data: patients });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
