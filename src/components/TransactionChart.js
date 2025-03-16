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

  useEffect(() => {
    const daysInMonth = new Date(
      new Date().getFullYear(),
      selectedMonth,
      0
    ).getDate();
    let tempData = {};

    for (let i = 1; i <= daysInMonth; i++) {
      tempData[i] = { date: i.toString(), expense: 0 };
    }

    transactions.forEach((t) => {
      const transactionDate = new Date(t.date);
      const transactionMonth = transactionDate.getMonth() + 1;
      const day = transactionDate.getDate();
      if (transactionMonth === selectedMonth) {
        tempData[day].expense += t.amount;
      }
    });

    setData(Object.values(tempData));
  }, [selectedMonth, transactions]);

  const averageExpense =
    data.reduce((sum, item) => sum + item.expense, 0) / data.length || 0;

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
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barSize={6}>
          <XAxis
            dataKey="date"
            tick={{ fill: "#666", fontSize: 12 }}
            tickLine={false}
          />
          <YAxis hide={true} />
          <Tooltip cursor={{ fill: "transparent" }} />
          <ReferenceLine
            y={averageExpense}
            stroke="#ff9900"
            strokeDasharray="4 4"
            label={{
              position: "right",
              value: `Avg ${Math.round(averageExpense)}`,
              fill: "#ff9900",
              fontSize: 12,
            }}
          />
          <Bar dataKey="expense" fill="#007bff" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionChart;
