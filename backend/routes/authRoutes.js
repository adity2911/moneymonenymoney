const express = require("express");
const {
  register,
  login,
  getAuthUser,
  logout,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user", getAuthUser);
router.post("/logout", logout);

module.exports = router;
