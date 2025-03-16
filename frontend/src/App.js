import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  Dashboard,
  Transactions,
  TransactionForm,
  TransactionChart,
  Signup,
  Login,
  Navbar,
} from "./components";
import "./styles/App.css";

const ProtectedRoute = ({ user, children }) => {
  if (user === undefined) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/auth/user", {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    try {
      const res = await axios.get("http://localhost:5000/transactions", {
        withCredentials: true,
      });
      setTransactions(res.data);
    } catch (err) {
      console.error("❌ Error fetching transactions:", err);
    }
  }, [user]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (transaction) => {
    try {
      const formattedTransaction = {
        ...transaction,
        amount:
          transaction.type === "expense"
            ? -Math.abs(transaction.amount)
            : Math.abs(transaction.amount),
      };

      const res = await axios.post(
        "http://localhost:5000/transactions",
        formattedTransaction,
        { withCredentials: true }
      );
      console.log("✅ Transaction added:", res.data);
      setTransactions((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("❌ Error adding transaction:", err.response?.data || err);
    }
  };

  const editTransaction = async (updatedTransaction) => {
    try {
      await axios.put(
        `http://localhost:5000/transactions/${updatedTransaction._id}`,
        updatedTransaction,
        { withCredentials: true }
      );
      await fetchTransactions();
    } catch (err) {
      console.error("❌ Error editing transaction:", err);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      console.log("🗑️ Deleting transaction with ID:", id);
      await axios.delete(`http://localhost:5000/transactions/${id}`, {
        withCredentials: true,
      });
      await fetchTransactions();
    } catch (err) {
      console.error("❌ Error deleting transaction:", err);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/auth/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      setTransactions([]); // Clear transactions on logout
    } catch (err) {
      console.error("❌ Error logging out:", err);
    }
  };

  return (
    <Router>
      <Navbar user={user} onLogout={logout} />
      <Routes>
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <div className="dashboard-container">
                <div className="left-section">
                  <Transactions
                    transactions={transactions}
                    setTransactions={setTransactions}
                    deleteTransaction={deleteTransaction}
                    fetchTransactions={fetchTransactions}
                  />
                </div>
                <div className="right-section">
                  <div className="top-right-section">
                    <Dashboard transactions={transactions} />
                    <TransactionChart transactions={transactions} />
                  </div>
                  <TransactionForm
                    addTransaction={addTransaction}
                    useSlider={true}
                  />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
