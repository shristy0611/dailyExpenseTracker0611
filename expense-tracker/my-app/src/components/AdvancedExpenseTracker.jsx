import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale, // Import TimeScale
  Tooltip,
  Legend,
} from 'chart.js';

import 'chartjs-adapter-date-fns'; // Import the date adapter

import { Pie, Line } from 'react-chartjs-2';
import { format } from 'date-fns';

// Register the Chart.js components
ChartJS.register(
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale, // Register TimeScale
  Tooltip,
  Legend
);

const AdvancedExpenseTracker = () => {
  // State variables
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [budget, setBudget] = useState(1000);

  // Expense categories
  const categories = ['Food', 'Rent', 'Entertainment', 'Transport', 'Utilities', 'Others'];

  // Load expenses from localStorage on component mount
  useEffect(() => {
    const savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    setExpenses(savedExpenses);
  }, []);

  // Save expenses to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Handle adding a new expense
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!description || !amount || !category) return;

    const newExpense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      category,
      date: date // Date is in 'yyyy-MM-dd' format from the input
    };

    setExpenses([...expenses, newExpense]);
    setDescription('');
    setAmount('');
    setCategory('');
    setDate(new Date());
  };

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate expenses by category
  const expensesByCategory = categories.map(cat =>
    expenses
      .filter(exp => exp.category === cat)
      .reduce((sum, exp) => sum + exp.amount, 0)
  );

  // Sort expenses by date in ascending order
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Aggregate expenses by date
  const expensesByDate = sortedExpenses.reduce((acc, expense) => {
    const date = expense.date;
    if (!acc[date]) {
      acc[date] = expense.amount;
    } else {
      acc[date] += expense.amount;
    }
    return acc;
  }, {});

  // Prepare data for the Line chart
  const chartLabels = Object.keys(expensesByDate);
  const chartData = Object.values(expensesByDate);

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Advanced Expense Tracker</h1>
      <form onSubmit={handleAddExpense} className="space-y-4">
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Category</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={format(new Date(date), 'yyyy-MM-dd')}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Add Expense
        </button>
      </form>

      <h3 className="text-xl font-semibold my-4">
        Total Expenses: ${totalExpenses.toFixed(2)}
      </h3>
      <p>Budget Limit: ${budget.toFixed(2)}</p>

      {/* Pie Chart - Expenses by Category */}
      <h3 className="text-xl font-semibold mt-6 mb-4">Expenses by Category</h3>
      <Pie
        data={{
          labels: categories,
          datasets: [
            {
              data: expensesByCategory,
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#9ACD32',
                '#FFA07A',
                '#20B2AA',
              ],
            },
          ],
        }}
      />

      {/* Line Chart - Spending Over Time */}
      <h3 className="text-xl font-semibold mt-6 mb-4">Spending Over Time</h3>
      <Line
        data={{
          labels: chartLabels,
          datasets: [
            {
              label: 'Expenses',
              data: chartData,
              fill: false,
              borderColor: '#4BC0C0',
            },
          ],
        }}
        options={{
          scales: {
            x: {
              type: 'time',
              time: {
                parser: 'yyyy-MM-dd',
                unit: 'day',
                displayFormats: {
                  day: 'MMM dd',
                },
              },
              title: {
                display: true,
                text: 'Date',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Amount ($)',
              },
            },
          },
        }}
      />
    </div>
  );
};

export default AdvancedExpenseTracker;
