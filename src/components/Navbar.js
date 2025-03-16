import React from "react";
import logo from "../assets/logo.png"; // Adjust path if needed

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <img src={logo} alt="MoneyMoneyMoney Logo" className="logo" />
      <h1>MoneyMoneyMoney</h1>
      {user && (
        <div className="user-info">
          <span className="username">Welcome, {user.name}</span>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
