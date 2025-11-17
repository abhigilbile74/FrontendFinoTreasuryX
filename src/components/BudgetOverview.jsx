import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchBudgets, updateBudget, addBudget } from '../store/slices/budgetSlice';
import { fetchTransactions } from '../store/slices/transactionSlice';
import RuPaySymbol from './ui/RuPaySymbol';

const BudgetOverview = () => {
  const dispatch = useDispatch();

  const { budgets = [] } = useSelector((state) => state.budget || {});
  const { transactions = [] } = useSelector((state) => state.transactions || {});
  const [updatingBudgets, setUpdatingBudgets] = useState({});
  const [isAddingBudget, setIsAddingBudget] = useState(false);
  const [newBudget, setNewBudget] = useState({ category: '', amount: '' });
  const [loadingAdd, setLoadingAdd] = useState(false);

  useEffect(() => {
    dispatch(fetchBudgets());
    dispatch(fetchTransactions());
  }, [dispatch]);

  // Category mappings (for transaction grouping)
  const categoryMap = {
    'Food & Dining': ['Food', 'Food & Dining'],
    'Food': ['Food', 'Food & Dining'],
    'Transportation': ['Transport', 'Transportation'],
    'Transport': ['Transport', 'Transportation'],
    'Shopping': ['Shopping'],
    'Entertainment': ['Entertainment'],
    'Bills': ['Bills'],
  };

  const getMatchingSpent = (budgetCategory) => {
    const possibleCategories = categoryMap[budgetCategory] || [budgetCategory];
    return transactions
      .filter((t) => t.type === 'expense' && possibleCategories.includes(t.category))
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
  };

  const getCategoryStyle = (category) => {
    const common = {
      'Food & Dining': ['🍔', 'orange'],
      'Food': ['🍔', 'orange'],
      'Transportation': ['🚗', 'blue'],
      'Transport': ['🚗', 'blue'],
      'Shopping': ['🛍️', 'pink'],
      'Entertainment': ['🎬', 'purple'],
      'Bills': ['📄', 'gray'],
    };
    const [icon, color] = common[category] || ['💰', 'green'];
    return {
      icon,
      gradient: `from-${color}-500 to-${color === 'gray' ? 'slate' : color}-600`,
      bgColor: `bg-${color}-50`,
      textColor: `text-${color}-600`,
      borderColor: `border-${color}-200`,
    };
  };

  const staticBudgets = [
    { id: 'static-1', category: 'Food & Dining', amount: 500 },
    { id: 'static-2', category: 'Transportation', amount: 200 },
    { id: 'static-3', category: 'Shopping', amount: 300 },
    { id: 'static-4', category: 'Entertainment', amount: 150 },
    { id: 'static-5', category: 'Bills', amount: 400 },
  ];

  const displayBudgets = budgets.length > 0 ? budgets : staticBudgets;

  const handleBudgetChange = async (budget, changeAmount) => {
    const budgetId = budget.id;
    const currentAmount = parseFloat(budget.amount || 0);
    const newAmount = Math.max(0, currentAmount + changeAmount);

    setUpdatingBudgets((prev) => ({ ...prev, [budgetId]: true }));

    try {
      if (budgetId && !budgetId.toString().startsWith('static-')) {
        await dispatch(updateBudget({ id: budgetId, budgetData: { category: budget.category, amount: newAmount } })).unwrap();
      } else {
        await dispatch(addBudget({ category: budget.category, amount: newAmount })).unwrap();
      }
      await dispatch(fetchBudgets());
    } catch (error) {
      console.error('Failed to update budget:', error);
      alert('Failed to update budget: ' + (error?.message || 'Unknown error'));
    } finally {
      setUpdatingBudgets((prev) => ({ ...prev, [budgetId]: false }));
    }
  };

  // 🆕 Add new budget handler
  const handleAddNewBudget = async (e) => {
    e.preventDefault();
    if (!newBudget.category.trim() || !newBudget.amount) {
      alert('Please enter a category and amount');
      return;
    }

    setLoadingAdd(true);
    try {
      await dispatch(addBudget(newBudget)).unwrap();
      await dispatch(fetchBudgets());
      setNewBudget({ category: '', amount: '' });
      setIsAddingBudget(false);
    } catch (error) {
      console.error('Failed to add new budget:', error);
      alert('Failed to add budget: ' + (error?.message || 'Unknown error'));
    } finally {
      setLoadingAdd(false);
    }
  };

  const totalBudget = displayBudgets.reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0);
  const totalSpent = displayBudgets.reduce((sum, b) => sum + getMatchingSpent(b.category), 0);
  const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 md:mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">💰 Budget Overview</h2>
          <p className="text-xs sm:text-sm text-gray-500">Track your spending and create custom budgets</p>
        </div>
        <button
          onClick={() => setIsAddingBudget((prev) => !prev)}
          className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all text-sm sm:text-base"
        >
          {isAddingBudget ? 'Cancel' : '+ Add Budget'}
        </button>
      </div>

      {/* Add New Budget Form */}
      {isAddingBudget && (
        <form onSubmit={handleAddNewBudget} className="mb-4 md:mb-6 bg-gray-50 border border-gray-200 p-3 md:p-4 rounded-xl">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
            <input
              type="text"
              placeholder="Budget Category (e.g. Pet Care)"
              value={newBudget.category}
              onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={newBudget.amount}
              onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
              className="w-full sm:w-32 md:w-40 px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
              required
            />
            <button
              type="submit"
              disabled={loadingAdd}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 text-sm sm:text-base"
            >
              {loadingAdd ? 'Adding...' : 'Save'}
            </button>
          </div>
        </form>
      )}

      {/* Progress Summary */}
      <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">Overall Budget Usage</span>
          <span className="text-sm font-bold text-indigo-600">
            <RuPaySymbol showLogo={false} />{totalSpent.toFixed(2)} / <RuPaySymbol showLogo={false} />{totalBudget.toFixed(2)}
          </span>
        </div>
        <div className="w-full bg-white rounded-full h-3 mb-2 shadow-inner">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              overallPercentage > 100
                ? 'bg-gradient-to-r from-red-500 to-rose-600'
                : overallPercentage > 80
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                : 'bg-gradient-to-r from-green-500 to-emerald-500'
            }`}
            style={{ width: `${Math.min(overallPercentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">{overallPercentage.toFixed(1)}% used</span>
          {overallPercentage > 100 && (
            <span className="text-xs font-semibold text-red-600">
              ⚠️ Over budget by <RuPaySymbol showLogo={false} />{(totalSpent - totalBudget).toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Budget Cards */}
      <div className="space-y-4">
        {displayBudgets.map((budget) => {
          const budgetAmount = parseFloat(budget.amount) || 0;
          const spent = getMatchingSpent(budget.category);
          const percentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;
          const remaining = Math.max(budgetAmount - spent, 0);
          const style = getCategoryStyle(budget.category);
          const isOverBudget = percentage > 100;

          return (
            <div
              key={budget.id}
              className={`${style.bgColor} rounded-xl p-5 border-2 ${style.borderColor} hover:shadow-md transition-all duration-300`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-white rounded-xl p-2 sm:p-3 shadow-sm text-xl sm:text-2xl">{style.icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-base sm:text-lg">{budget.category}</h3>

                    {/* Budget Info + Adjust Buttons */}
                    <div className="flex flex-col gap-2 mt-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-600">
                          Budget:{' '}
                          <span className="font-semibold text-gray-800">
                            <RuPaySymbol showLogo={false} />{budgetAmount.toFixed(2)}
                          </span>
                        </p>
                        {updatingBudgets[budget.id] && (
                          <span className="text-xs text-blue-600 animate-pulse">Updating...</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                        <span className="text-xs text-gray-500 mr-1">Adjust:</span>
                        {[-50, -10, 10, 50].map((v) => (
                          <button
                            key={v}
                            onClick={() => handleBudgetChange(budget, v)}
                            disabled={updatingBudgets[budget.id] || (v < 0 && budgetAmount + v < 0)}
                            className={`border rounded-lg px-2 sm:px-2.5 py-0.5 sm:py-1 text-xs font-semibold transition-all shadow-sm hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50
                              ${v < 0
                                ? 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
                                : 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100'}`}
                          >
                            {v > 0 ? '+' : ''}
                            <RuPaySymbol showLogo={false} />{Math.abs(v)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Spent Info */}
                <div className="text-right">
                  <p className={`text-lg font-bold ${isOverBudget ? 'text-red-600' : style.textColor}`}>
                    <RuPaySymbol showLogo={false} />{spent.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {isOverBudget ? (
                      <span className="text-red-600 font-semibold">
                        Over by <RuPaySymbol showLogo={false} />{(spent - budgetAmount).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-green-600">
                        <RuPaySymbol showLogo={false} />{remaining.toFixed(2)} left
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-2 w-full bg-white rounded-full h-3 shadow-inner overflow-hidden relative">
                <div
                  className={`absolute h-3 rounded-full bg-gradient-to-r ${style.gradient} transition-all duration-500`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
                {isOverBudget && (
                  <div
                    className="absolute h-3 rounded-full bg-gradient-to-r from-red-600 to-rose-700"
                    style={{ left: '100%', width: `${Math.min((spent - budgetAmount) / budgetAmount * 100, 100)}%` }}
                  />
                )}
              </div>

              {/* Status */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${isOverBudget ? 'text-red-600' : style.textColor}`}>
                    {Math.min(percentage, 100).toFixed(1)}%
                  </span>
                  {percentage > 80 && percentage <= 100 && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">⚠️ Warning</span>
                  )}
                  {isOverBudget && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Over Budget!</span>
                  )}
                  {percentage <= 50 && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✓ On Track</span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {percentage <= 100
                    ? `${((budgetAmount - spent) / budgetAmount * 100).toFixed(0)}% remaining`
                    : 'Budget exceeded'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {displayBudgets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Budgets Set</h3>
          <p className="text-gray-500 mb-4">Create your first budget to start tracking your expenses</p>
        </div>
      )}
    </div>
  );
};

export default BudgetOverview;
