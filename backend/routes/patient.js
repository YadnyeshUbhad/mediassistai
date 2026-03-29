const express = require("express");
const router = express.Router();
const {
  registerPatient, listPatients, getPatient, updatePatient, getQueue,
} = require("../controllers/patientController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/register",    protect, authorize("receptionist", "clinic_admin", "doctor", "platform_admin"), registerPatient);
router.get("/list",         protect, listPatients);
router.get("/queue",        protect, getQueue);
router.get("/:id",          protect, getPatient);
router.put("/:id",          protect, updatePatient);

module.exports = router;
