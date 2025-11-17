import React, { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import { useSelector, useDispatch } from "react-redux";
import { fetchBudgets } from "../store/slices/budgetSlice";
import { fetchTransactions } from "../store/slices/transactionSlice";
import { fetchGoals } from "../store/slices/goalSlice";
import RuPaySymbol from './ui/RuPaySymbol';

Chart.register(...registerables);

const AnalyticsOverview = () => {
  const dispatch = useDispatch();
  const { budgets } = useSelector((state) => state.budget);
  const { transactions } = useSelector((state) => state.transactions);
  const { goals } = useSelector((state) => state.goals);

  const categoryChartRef = useRef(null);
  const incomeExpenseChartRef = useRef(null);
  const trendChartRef = useRef(null);
  const goalProgressChartRef = useRef(null);
  const incomeExpenseChartInstance = useRef(null);
  const categoryChartInstance = useRef(null);
  const trendChartInstance = useRef(null);
  const goalProgressChartInstance = useRef(null);

  const [period, setPeriod] = useState("monthly");
  const [timeRange, setTimeRange] = useState("30"); // days

  // Fetch budgets, transactions & goals from server
  useEffect(() => {
    dispatch(fetchBudgets());
    dispatch(fetchTransactions());
    dispatch(fetchGoals());
  }, [dispatch]);

  // Get filtered transactions based on time range
  const getFilteredTransactions = () => {
    if (!timeRange || timeRange === "all") return transactions;
    const now = new Date();
    const daysAgo = new Date();
    daysAgo.setDate(now.getDate() - parseInt(timeRange));
    return transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return transactionDate >= daysAgo;
    });
  };

  const filteredTransactions = getFilteredTransactions();

  // Calculate summary statistics
  const getSummaryStats = () => {
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryTotals = {};
    
    filteredTransactions.forEach((t) => {
      if (t.type === "income") {
        totalIncome += parseFloat(t.amount);
      } else if (t.type === "expense") {
        totalExpense += parseFloat(t.amount);
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + parseFloat(t.amount);
      }
    });

    const balance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

    // Budget utilization
    let totalBudget = 0;
    let totalSpent = 0;
    budgets.forEach((b) => {
      totalBudget += parseFloat(b.amount || 0);
      totalSpent += parseFloat(b.spent || 0);
    });
    const budgetUtilization = totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0;

    // Goal progress
    let totalGoalTarget = 0;
    let totalGoalSaved = 0;
    goals.forEach((g) => {
      totalGoalTarget += parseFloat(g.target_amount || 0);
      totalGoalSaved += parseFloat(g.total_saved || 0);
    });
    const goalProgress = totalGoalTarget > 0 ? ((totalGoalSaved / totalGoalTarget) * 100).toFixed(1) : 0;

    return {
      totalIncome,
      totalExpense,
      balance,
      savingsRate,
      budgetUtilization,
      goalProgress,
      totalGoalTarget,
      totalGoalSaved,
      categoryTotals,
      transactionCount: filteredTransactions.length
    };
  };

  const stats = getSummaryStats();

  // Group transactions by category for Pie Chart
  const getCategoryTotals = () => {
    return stats.categoryTotals;
  };

  // Group income and expenses by time period
  const getIncomeExpenseData = () => {
    const data = { income: [], expenses: [], labels: [] };
    
    if (period === "weekly") {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
        data.labels.push(dateStr);
        
        let dayIncome = 0;
        let dayExpense = 0;
        filteredTransactions.forEach((t) => {
          const tDate = new Date(t.date);
          if (tDate.toDateString() === date.toDateString()) {
            if (t.type === "income") dayIncome += parseFloat(t.amount);
            if (t.type === "expense") dayExpense += parseFloat(t.amount);
          }
        });
        data.income.push(dayIncome);
        data.expenses.push(dayExpense);
      }
    } else if (period === "monthly") {
      // Last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStr = date.toLocaleDateString('en-US', { month: 'short' });
        data.labels.push(monthStr);
        
        let monthIncome = 0;
        let monthExpense = 0;
        filteredTransactions.forEach((t) => {
          const tDate = new Date(t.date);
          if (tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear()) {
            if (t.type === "income") monthIncome += parseFloat(t.amount);
            if (t.type === "expense") monthExpense += parseFloat(t.amount);
          }
        });
        data.income.push(monthIncome);
        data.expenses.push(monthExpense);
      }
    } else {
      // Yearly - last 6 years or available data
      const currentYear = new Date().getFullYear();
      for (let i = 5; i >= 0; i--) {
        const year = currentYear - i;
        data.labels.push(year.toString());
        
        let yearIncome = 0;
        let yearExpense = 0;
        filteredTransactions.forEach((t) => {
          const tDate = new Date(t.date);
          if (tDate.getFullYear() === year) {
            if (t.type === "income") yearIncome += parseFloat(t.amount);
            if (t.type === "expense") yearExpense += parseFloat(t.amount);
          }
        });
        data.income.push(yearIncome);
        data.expenses.push(yearExpense);
      }
    }
    
    return data;
  };

  // === PIE CHART: Spending by Category ===
  useEffect(() => {
    if (!filteredTransactions.length || !categoryChartRef.current) return;
    const totals = getCategoryTotals();
    const labels = Object.keys(totals);
    const data = Object.values(totals);

    if (labels.length === 0) return;

    if (categoryChartInstance.current) {
      categoryChartInstance.current.destroy();
    }

    const ctx = categoryChartRef.current.getContext("2d");
    categoryChartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: [
              "#f97316",
              "#ef4444",
              "#8b5cf6",
              "#3b82f6",
              "#10b981",
              "#eab308",
              "#ec4899",
              "#06b6d4",
              "#f59e0b",
              "#84cc16",
            ],
            borderWidth: 2,
            borderColor: "#ffffff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { 
            position: "bottom",
            labels: {
              padding: 15,
              font: { size: 12 }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = Number(context.parsed) || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0) || 1;
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ₹${value.toFixed(2)} (${percentage}%)`;
              }
            }
          }
        },
      },
    });

    return () => {
      if (categoryChartInstance.current) categoryChartInstance.current.destroy();
    };
  }, [filteredTransactions, timeRange]);

  // === INCOME VS EXPENSE CHART ===
  useEffect(() => {
    if (!filteredTransactions.length || !incomeExpenseChartRef.current) return;
    const ctx = incomeExpenseChartRef.current.getContext("2d");

    const chartData = getIncomeExpenseData();
    const { income, expenses, labels } = chartData;

    if (labels.length === 0) return;

    if (incomeExpenseChartInstance.current) {
      incomeExpenseChartInstance.current.destroy();
    }

    incomeExpenseChartInstance.current = new Chart(ctx, {
      type: period === "weekly" ? "line" : "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Expenses",
            data: expenses,
            backgroundColor: period === "weekly" ? "rgba(239, 68, 68, 0.1)" : "rgba(239, 68, 68, 0.8)",
            borderColor: "#ef4444",
            borderWidth: 2,
            fill: period === "weekly",
            tension: 0.4,
          },
          {
            label: "Income",
            data: income,
            backgroundColor: period === "weekly" ? "rgba(16, 185, 129, 0.1)" : "rgba(16, 185, 129, 0.8)",
            borderColor: "#10b981",
            borderWidth: 2,
            fill: period === "weekly",
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: { 
          y: { 
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '₹' + value.toLocaleString();
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        plugins: { 
          legend: { 
            position: "bottom",
            labels: {
              padding: 15,
              font: { size: 12 }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const val = context.parsed && (context.parsed.y ?? context.parsed) || 0;
                return context.dataset.label + ': ₹' + Number(val).toLocaleString();
              }
            }
          }
        },
      },
    });

    return () => {
      if (incomeExpenseChartInstance.current)
        incomeExpenseChartInstance.current.destroy();
    };
  }, [period, filteredTransactions, timeRange]);

  // === GOAL PROGRESS CHART ===
  useEffect(() => {
    if (!goals.length || !goalProgressChartRef.current) return;

    const ctx = goalProgressChartRef.current.getContext("2d");
    const goalLabels = goals.map(g => g.title);
    const goalProgress = goals.map(g => {
      const target = parseFloat(g.target_amount || 0);
      const saved = parseFloat(g.total_saved || 0);
      return target > 0 ? (saved / target) * 100 : 0;
    });

    if (goalProgressChartInstance.current) {
      goalProgressChartInstance.current.destroy();
    }

    goalProgressChartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: goalLabels,
        datasets: [
          {
            label: "Progress %",
            data: goalProgress,
            backgroundColor: goalProgress.map(p => 
              p >= 100 ? "#10b981" : p >= 50 ? "#3b82f6" : "#f59e0b"
            ),
            borderColor: goalProgress.map(p => 
              p >= 100 ? "#059669" : p >= 50 ? "#2563eb" : "#d97706"
            ),
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        indexAxis: 'y',
        scales: { 
          x: { 
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          y: {
            grid: {
              display: false
            }
          }
        },
        plugins: { 
          legend: { 
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const idx = context.dataIndex;
                const goal = goals[idx] || {};
                const saved = Number(goal.total_saved || 0);
                const target = Number(goal.target_amount || 0);
                const parsed = context.parsed && (context.parsed.x ?? context.parsed) || 0;
                return `Progress: ${Number(parsed).toFixed(1)}% (${saved.toLocaleString()} / ${target.toLocaleString()})`;
              }
            }
          }
        },
      },
    });

    return () => {
      if (goalProgressChartInstance.current)
        goalProgressChartInstance.current.destroy();
    };
  }, [goals]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📊 Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive financial insights and trends</p>
        </div>

        {/* Time Range Filter */}
        <div className="mb-6 flex flex-wrap gap-3 items-center">
          <span className="text-sm font-semibold text-gray-700">Time Range:</span>
          {["7", "30", "90", "365", "all"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeRange === range
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow"
              }`}
            >
              {range === "all" ? "All Time" : `${range} Days`}
            </button>
          ))}
        </div>

        {/* Summary Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-100 mb-1">Total Income</p>
                <p className="text-3xl font-bold mb-1"><RuPaySymbol showLogo={false} />{stats.totalIncome.toLocaleString()}</p>
                <p className="text-xs text-green-100">{stats.transactionCount} transactions</p>
              </div>
              <div className="bg-white/20 rounded-full p-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-100 mb-1">Total Expenses</p>
                <p className="text-3xl font-bold mb-1"><RuPaySymbol showLogo={false} />{stats.totalExpense.toLocaleString()}</p>
                <p className="text-xs text-red-100">{Object.keys(stats.categoryTotals).length} categories</p>
              </div>
              <div className="bg-white/20 rounded-full p-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`bg-gradient-to-br ${stats.balance >= 0 ? 'from-blue-500 to-indigo-600' : 'from-orange-500 to-amber-600'} rounded-xl shadow-lg p-6 text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90 mb-1">Net Balance</p>
                <p className="text-3xl font-bold mb-1"><RuPaySymbol showLogo={false} />{stats.balance.toLocaleString()}</p>
                <p className="text-xs opacity-90">Savings Rate: {stats.savingsRate}%</p>
              </div>
              <div className="bg-white/20 rounded-full p-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90 mb-1">Goal Progress</p>
                <p className="text-3xl font-bold mb-1">{stats.goalProgress}%</p>
                <p className="text-xs opacity-90"><RuPaySymbol showLogo={false} />{stats.totalGoalSaved.toLocaleString()} / <RuPaySymbol showLogo={false} />{stats.totalGoalTarget.toLocaleString()}</p>
              </div>
              <div className="bg-white/20 rounded-full p-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Income vs Expenses Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Income vs Expenses</h2>
              <div className="flex gap-2">
                {["weekly", "monthly", "yearly"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      period === p
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            {!filteredTransactions.length ? (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <p>No transaction data available</p>
              </div>
            ) : (
              <div className="h-64">
                <canvas ref={incomeExpenseChartRef}></canvas>
              </div>
            )}
          </div>

          {/* Spending by Category Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Spending by Category</h2>
            {!filteredTransactions.length || Object.keys(stats.categoryTotals).length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <p>No expense data available</p>
              </div>
            ) : (
              <div className="h-64">
                <canvas ref={categoryChartRef}></canvas>
              </div>
            )}
          </div>
        </div>

        {/* Goal Progress Chart */}
        {goals.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Financial Goals Progress</h2>
            <div className="h-64">
              <canvas ref={goalProgressChartRef}></canvas>
            </div>
          </div>
        )}

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Budget Utilization</h3>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Used</span>
                <span className="font-semibold">{stats.budgetUtilization}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    parseFloat(stats.budgetUtilization) > 100
                      ? "bg-red-500"
                      : parseFloat(stats.budgetUtilization) > 80
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(parseFloat(stats.budgetUtilization), 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Top Spending Category</h3>
            {Object.keys(stats.categoryTotals).length > 0 ? (
              <>
                {(() => {
                  const topCategory = Object.entries(stats.categoryTotals).sort(
                    ([, a], [, b]) => b - a
                  )[0];
                  return (
                    <>
                      <p className="text-2xl font-bold text-indigo-600 mb-1">{topCategory[0]}</p>
                      <p className="text-gray-600"><RuPaySymbol showLogo={false} />{topCategory[1].toLocaleString()}</p>
                    </>
                  );
                })()}
              </>
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Savings Insights</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Savings Rate</span>
                <span className="font-semibold text-green-600">{stats.savingsRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Net Balance</span>
                <span className={`font-semibold ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <RuPaySymbol showLogo={false} />{stats.balance.toLocaleString()}
                </span>
              </div>
              {stats.savingsRate > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  💡 Great job! You're saving {stats.savingsRate}% of your income.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
