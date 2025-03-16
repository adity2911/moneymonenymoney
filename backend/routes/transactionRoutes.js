const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getTransactions,
  addTransaction,
  updateTransaction, // Import the update function
  deleteTransaction,
} = require("../controllers/transactionController");

const router = express.Router();

router.get("/", authMiddleware, getTransactions);
router.post("/", authMiddleware, addTransaction);
router.put("/:id", authMiddleware, updateTransaction); // Route to edit a transaction
router.delete("/:id", authMiddleware, deleteTransaction);

module.exports = router;
