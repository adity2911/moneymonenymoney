const Transaction = require("../Models/Transaction");

// Get all transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching transactions" });
  }
};

// Add a new transaction
exports.addTransaction = async (req, res) => {
  try {
    const transaction = new Transaction({ ...req.body, userId: req.user.id });
    await transaction.save();
    res.json(transaction);
  } catch (error) {
    console.log("Error adding transaction:", error);
    res.status(500).json({ error: "Error adding transaction" });
  }
};

// Edit (Update) a transaction
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, type, date } = req.body;

    // Ensure the transaction exists and belongs to the logged-in user
    const transaction = await Transaction.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    // Update transaction fields if provided
    if (description !== undefined) transaction.description = description;
    if (amount !== undefined) transaction.amount = amount;
    if (type !== undefined) transaction.type = type;
    if (date !== undefined) transaction.date = date;

    await transaction.save();
    res.json(transaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ error: "Error updating transaction" });
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deletedTransaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting transaction" });
  }
};
