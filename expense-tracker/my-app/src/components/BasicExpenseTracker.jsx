import React, { useState } from 'react';

const BasicExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newExpense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0]
    };

    setExpenses([...expenses, newExpense]);
    setDescription('');
    setAmount('');
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Add New Expense</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What did you spend on?"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="w-full p-2 border rounded"
              min="0"
              step="0.01"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Add Expense
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-2">Total Expenses</h2>
        <p className="text-2xl">${totalExpenses.toFixed(2)}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Recent Expenses</h2>
        <div className="space-y-2">
          {expenses.map(expense => (
            <div key={expense.id} className="flex justify-between items-center p-2 border-b">
              <div>
                <p className="font-medium">{expense.description}</p>
                <p className="text-sm text-gray-500">{expense.date}</p>
              </div>
              <p className="font-medium">${expense.amount.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BasicExpenseTracker;
