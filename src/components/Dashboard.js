import React from "react";
import "../styles/dashboard.css";

const Dashboard = ({ transactions }) => {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const openingBalance = 128;
  const closingBalance = openingBalance + income - expenses;

  return (
    <div className="dashboard-container1">
      <div className="balance-card">
        <div className="balance-row">
          <span>Opening Balance</span>
          <span className="amount">₹{openingBalance}</span>
        </div>
        <div className="balance-row money-in">
          <span>+ Money In</span>
          <span className="amount income">₹{income}</span>
        </div>
        <div className="balance-row money-out">
          <span>- Money Out</span>
          <span className="amount expense">₹{expenses}</span>
        </div>
        <div className="balance-row">
          <span>Closing Balance</span>
          <span className="amount">₹{closingBalance}</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
