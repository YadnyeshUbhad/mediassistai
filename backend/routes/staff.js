const express = require("express");
const router = express.Router();
const {
  addStaff, listStaff, getStaff, updateStaff, deleteStaff,
} = require("../controllers/staffController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/add",   protect, authorize("clinic_admin", "platform_admin"), addStaff);
router.get("/list",   protect, listStaff);
router.get("/:id",    protect, getStaff);
router.put("/:id",    protect, authorize("clinic_admin", "platform_admin"), updateStaff);
router.delete("/:id", protect, authorize("clinic_admin", "platform_admin"), deleteStaff);

module.exports = router;
