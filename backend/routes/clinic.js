const express = require("express");
const router = express.Router();
const {
  registerClinic, getClinic, getAllClinics, updateClinic,
} = require("../controllers/clinicController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/register",  protect, registerClinic);
router.get("/",           protect, authorize("platform_admin"), getAllClinics);
router.get("/:id",        protect, getClinic);
router.put("/:id",        protect, authorize("platform_admin", "clinic_admin"), updateClinic);

module.exports = router;
