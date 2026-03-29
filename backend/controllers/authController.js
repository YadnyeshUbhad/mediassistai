const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Clinic = require("../models/Clinic");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

// ── POST /api/auth/register ────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, clinicId, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered." });
    }

    // Validate clinicId if provided
    if (clinicId) {
      const clinic = await Clinic.findById(clinicId);
      if (!clinic) {
        return res.status(400).json({ success: false, message: "Invalid clinic ID." });
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "patient",
      clinicId: clinicId || null,
      phone: phone || "",
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        token: generateToken(user._id),
        user: user.toJSON(),
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Registration failed", error: err.message });
  }
};

// ── POST /api/auth/login ───────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const query = { email: email.toLowerCase() };
    if (role) query.role = role;

    const user = await User.findOne(query).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Account is deactivated. Contact admin." });
    }

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token: generateToken(user._id),
        user: user.toJSON(),
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Login failed", error: err.message });
  }
};

// ── GET /api/auth/me ───────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("clinicId", "name address");
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
