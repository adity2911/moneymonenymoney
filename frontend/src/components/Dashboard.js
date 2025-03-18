import React from "react";
import "../styles/dashboard.css";

const Dashboard = ({ transactions }) => {
  const currentMonth = new Date().getMonth() + 1;

  // Filter past transactions (before current month)
  const pastTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() + 1 < currentMonth;
  });

  // Calculate Opening Balance (Total Income - Total Expenses until last month)
  const pastIncome = pastTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const pastExpenses = pastTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const openingBalance = pastIncome - pastExpenses;

  // Calculate current month's Money In & Money Out
  const currentMonthTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() + 1 === currentMonth;
  });

  const income = currentMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expenses = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  // Calculate Closing Balance
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
