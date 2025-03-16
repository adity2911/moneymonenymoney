import React, { useState } from "react";
import "../styles/transactions.css";
import axios from "axios";

const Transactions = ({
  transactions,
  setTransactions,
  deleteTransaction,
  fetchTransactions,
}) => {
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editFormData, setEditFormData] = useState({
    description: "",
    amount: "",
    date: "",
  });
  const [filter, setFilter] = useState("all");

  // Open the edit form with transaction data
  const startEditing = (transaction) => {
    setEditingTransaction(transaction._id);
    setEditFormData({
      description: transaction.description,
      amount: transaction.amount,
      date: transaction.date.split("T")[0], // Format date for input field
    });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Filter transactions based on the selected filter
  const filteredTransactions = transactions.filter((t) => {
    if (filter === "income") return t.type === "income";
    if (filter === "expense") return t.type === "expense";
    return true;
  });

  // Update the transaction in the backend
  const submitEdit = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/transactions/${id}`,
        editFormData,
        { withCredentials: true }
      );
      setEditingTransaction(null); // Close edit mode
      fetchTransactions(); // Refresh transactions
    } catch (err) {
      console.error(
        "❌ Error updating transaction:",
        err.response?.data || err
      );
    }
  };

  // Add transaction with correct type handling
  const addTransaction = async (transaction) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/transactions",
        transaction,
        { withCredentials: true }
      );
      console.log("✅ Transaction added:", res.data);
      setTransactions((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("❌ Error adding transaction:", err.response?.data || err);
    }
  };

  return (
    <div className="transactions">
      <h3 className="transactions-title">Transactions</h3>
      <div className="filter-container">
        <label>Filter:</label>
        <select onChange={handleFilterChange} value={filter}>
          <option value="all">All</option>
          <option value="income">Only Income</option>
          <option value="expense">Only Expenses</option>
        </select>
      </div>
      {filteredTransactions.length === 0 ? (
        <p className="no-transactions">No transactions found.</p>
      ) : (
        <ul className="transaction-list">
          {filteredTransactions.map((t) => (
            <li key={t._id} className={`transaction-item ${t.type}`}>
              {editingTransaction === t._id ? (
                // Edit Form
                <div className="edit-form">
                  <input
                    type="text"
                    name="description"
                    value={editFormData.description}
                    onChange={handleInputChange}
                  />
                  <input
                    type="number"
                    name="amount"
                    value={editFormData.amount}
                    onChange={handleInputChange}
                  />
                  <input
                    type="date"
                    name="date"
                    value={editFormData.date}
                    onChange={handleInputChange}
                  />
                  <button
                    className="save-btn"
                    onClick={() => submitEdit(t._id)}
                  >
                    💾 Save
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => setEditingTransaction(null)}
                  >
                    ❌ Cancel
                  </button>
                </div>
              ) : (
                // Normal Transaction Display
                <div className="transaction-details">
                  <div className="transaction-info">
                    <span className="transaction-text">{t.description}</span>
                    <span className="transaction-amount">
                      ₹{t.amount.toFixed(2)}
                    </span>
                  </div>
                  <span className="transaction-time">
                    {new Date(t.date).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="transaction-actions">
                {editingTransaction !== t._id && (
                  <>
                    <button
                      className="edit-btn"
                      onClick={() => startEditing(t)}
                    >
                      ✏️
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteTransaction(t._id)}
                    >
                      ❌
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Transactions;
