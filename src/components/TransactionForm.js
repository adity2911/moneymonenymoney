import React, { useState } from "react";
import "../styles/transactionForm.css";

const TransactionForm = ({ addTransaction }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) return;
    addTransaction({ description, amount: Number(amount), type });
    setDescription("");
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <div className="slider-container">
        <span className={type === "income" ? "active" : ""}>Income</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={type === "expense"}
            onChange={() => setType(type === "income" ? "expense" : "income")}
          />
          <span className="slider round"></span>
        </label>
        <span className={type === "expense" ? "active" : ""}>Expense</span>
      </div>

      <button className="submit-btn" type="submit">
        Add Transaction
      </button>
    </form>
  );
};

export default TransactionForm;
