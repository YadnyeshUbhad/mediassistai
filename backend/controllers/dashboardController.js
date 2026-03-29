const Patient = require("../models/Patient");
const Prescription = require("../models/Prescription");
const Staff = require("../models/Staff");
const Clinic = require("../models/Clinic");
const User = require("../models/User");

// ── GET /api/dashboard/admin ───────────────────────────────────────────────────
exports.adminDashboard = async (req, res) => {
  try {
    const [
      totalClinics, activeClinics,
      totalUsers, totalPatients,
      totalPrescriptions, totalStaff,
    ] = await Promise.all([
      Clinic.countDocuments(),
      Clinic.countDocuments({ isActive: true }),
      User.countDocuments(),
      Patient.countDocuments(),
      Prescription.countDocuments(),
      Staff.countDocuments(),
    ]);

    // New registrations in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [newClinics, newUsers, newPatients] = await Promise.all([
      Clinic.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Patient.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    ]);

    const recentClinics = await Clinic.find().sort({ createdAt: -1 }).limit(5).populate("ownerId", "name email");

    res.json({
      success: true,
      data: {
        stats: {
          totalClinics, activeClinics,
          totalUsers, totalPatients,
          totalPrescriptions, totalStaff,
          newClinicsThisMonth: newClinics,
          newUsersThisMonth: newUsers,
          newPatientsThisMonth: newPatients,
        },
        recentClinics,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/dashboard/doctor ──────────────────────────────────────────────────
exports.doctorDashboard = async (req, res) => {
  try {
    const clinicId = req.user.clinicId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalPatients, todayPatients,
      totalPrescriptions, todayPrescriptions,
      waitingPatients, completedToday,
    ] = await Promise.all([
      Patient.countDocuments({ clinicId }),
      Patient.countDocuments({ clinicId, createdAt: { $gte: today } }),
      Prescription.countDocuments({ clinicId }),
      Prescription.countDocuments({ clinicId, createdAt: { $gte: today } }),
      Patient.countDocuments({ clinicId, status: "Waiting" }),
      Patient.countDocuments({ clinicId, status: "Completed", updatedAt: { $gte: today } }),
    ]);

    const recentPatients = await Patient.find({ clinicId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("doctorAssigned", "name");

    const recentPrescriptions = await Prescription.find({ clinicId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("patientId", "name age");

    // Weekly consultation chart (last 7 days)
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      day.setHours(0, 0, 0, 0);
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);

      const count = await Patient.countDocuments({
        clinicId,
        createdAt: { $gte: day, $lt: nextDay },
      });
      weeklyData.push({
        day: day.toLocaleDateString("en-US", { weekday: "short" }),
        patients: count,
      });
    }

    res.json({
      success: true,
      data: {
        stats: {
          totalPatients, todayPatients,
          totalPrescriptions, todayPrescriptions,
          waitingPatients, completedToday,
        },
        recentPatients,
        recentPrescriptions,
        weeklyData,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/dashboard/reception ──────────────────────────────────────────────
exports.receptionDashboard = async (req, res) => {
  try {
    const clinicId = req.user.clinicId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalToday, waiting, consulting, completed, admitted,
    ] = await Promise.all([
      Patient.countDocuments({ clinicId, createdAt: { $gte: today } }),
      Patient.countDocuments({ clinicId, status: "Waiting" }),
      Patient.countDocuments({ clinicId, status: "Consulting" }),
      Patient.countDocuments({ clinicId, status: "Completed", updatedAt: { $gte: today } }),
      Patient.countDocuments({ clinicId, status: "Admitted" }),
    ]);

    const queue = await Patient.find({
      clinicId,
      status: { $in: ["Waiting", "Consulting"] },
    })
      .sort({ queueNumber: 1 })
      .limit(10)
      .populate("doctorAssigned", "name department");

    res.json({
      success: true,
      data: {
        stats: { totalToday, waiting, consulting, completed, admitted },
        queue,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
