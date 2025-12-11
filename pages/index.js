import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Home() {
  const [expenses, setExpenses] = useState([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')

  useEffect(() => {
    const stored = localStorage.getItem('expenses')
    if (stored) {
      setExpenses(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  const addExpense = (e) => {
    e.preventDefault()
    if (!description || !amount) return

    const newExpense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      category,
      date: new Date().toLocaleDateString()
    }

    setExpenses([newExpense, ...expenses])
    setDescription('')
    setAmount('')
  }

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id))
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {})

  return (
    <>
      <Head>
        <title>Expense Tracker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="container">
        <header>
          <h1>Expense Tracker</h1>
          <div className="total">Total: ${total.toFixed(2)}</div>
        </header>

        <form onSubmit={addExpense}>
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Food</option>
            <option>Transport</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Entertainment</option>
            <option>Health</option>
            <option>Other</option>
          </select>
          <button type="submit">Add Expense</button>
        </form>

        {Object.keys(categoryTotals).length > 0 && (
          <div className="summary">
            <h3>By Category</h3>
            <div className="categories">
              {Object.entries(categoryTotals).map(([cat, amt]) => (
                <div key={cat} className="category-item">
                  <span>{cat}</span>
                  <span>${amt.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="expenses">
          {expenses.length === 0 ? (
            <p className="empty">No expenses yet. Add one above!</p>
          ) : (
            expenses.map(expense => (
              <div key={expense.id} className="expense-item">
                <div className="expense-info">
                  <div className="expense-desc">{expense.description}</div>
                  <div className="expense-meta">
                    <span className="category-badge">{expense.category}</span>
                    <span className="date">{expense.date}</span>
                  </div>
                </div>
                <div className="expense-right">
                  <div className="amount">${expense.amount.toFixed(2)}</div>
                  <button
                    className="delete-btn"
                    onClick={() => deleteExpense(expense.id)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
