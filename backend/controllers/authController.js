const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");

// ✅ User Registration
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Registration Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ User Login
exports.login = async (req, res) => {
  try {
    console.log("🔹 Login Request:", req.body);

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    console.log("✅ Login Success:", user.email);
    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Check Auth Status
exports.getAuthUser = async (req, res) => {
  try {
    if (!req.cookies || !req.cookies.token) {
      return res.status(401).json({ user: null });
    }

    const token = req.cookies.token;
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(verified.id).select("-password");

    if (!user) return res.status(404).json({ user: null });

    res.json({ user });
  } catch (err) {
    console.error("❌ Auth Error:", err);
    res.status(401).json({ user: null });
  }
};

// ✅ User Logout
exports.logout = (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "Strict" });
  res.json({ message: "Logged out successfully" });
};
