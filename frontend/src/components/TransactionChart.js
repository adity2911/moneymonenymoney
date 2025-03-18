import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import "../styles/TransactionChart.css";

const TransactionChart = ({ transactions }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [data, setData] = useState([]);
  const [showIncome, setShowIncome] = useState(false);

  useEffect(() => {
    const daysInMonth = new Date(
      new Date().getFullYear(),
      selectedMonth,
      0
    ).getDate();
    let tempData = {};

    for (let i = 1; i <= daysInMonth; i++) {
      tempData[i] = { date: i.toString(), value: 0 };
    }

    transactions.forEach((t) => {
      const transactionDate = new Date(t.date);
      const transactionMonth = transactionDate.getMonth() + 1;
      const day = transactionDate.getDate();
      if (transactionMonth === selectedMonth) {
        if (
          (showIncome && t.type === "income") ||
          (!showIncome && t.type === "expense")
        ) {
          tempData[day].value += t.amount;
        }
      }
    });

    const processedData = Object.values(tempData);
    setData(processedData);
  }, [selectedMonth, transactions, showIncome]);

  // Compute average correctly
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  const validDays = data.filter((item) => item.value > 0).length;
  const averageValue = validDays > 0 ? totalValue / validDays : 0;

  return (
    <div className="chart-container">
      <div className="filter-container">
        <h3 className="chart-title">CashFlow</h3>
        <select
          id="month-filter"
          className="filter-dropdown"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
        <button
          className="toggle-button"
          onClick={() => setShowIncome((prev) => !prev)}
        >
          {showIncome ? "Show Money Out" : "Show Money In"}
        </button>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} barSize={8}>
          <XAxis
            dataKey="date"
            tick={{ fill: "#444", fontSize: 12 }}
            tickLine={false}
          />
          <YAxis hide={true} />
          <Tooltip cursor={{ fill: "transparent" }} />
          {averageValue > 0 && (
            <ReferenceLine
              y={averageValue}
              stroke="#ff9900"
              strokeDasharray="4 4"
              label={{
                position: "right",
                value: `Avg ${Math.round(averageValue)}`,
                fill: "#ff9900",
                fontSize: 12,
              }}
            />
          )}
          <Bar
            dataKey="value"
            fill={showIncome ? "#28a745" : "#007bff"}
            radius={[5, 5, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionChart;
