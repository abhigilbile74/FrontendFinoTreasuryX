import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchBudgets } from '../store/slices/budgetSlice';
import { fetchTransactions } from '../store/slices/transactionSlice';
import { fetchGoals } from '../store/slices/goalSlice';
import RuPaySymbol from './ui/RuPaySymbol';

const BudgetSummary = () => {
  const dispatch = useDispatch();
  const { budgets } = useSelector((state) => state.budget);
  const { transactions } = useSelector((state) => state.transactions);
  const { goals } = useSelector((state) => state.goals);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    savingsRate: 0,
    transactionCount: 0,
    goalProgress: 0,
  });

  useEffect(() => {
    dispatch(fetchBudgets());
    dispatch(fetchTransactions());
    dispatch(fetchGoals());
  }, [dispatch]);

  useEffect(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const balance = income - expense;
    const savingsRate = income > 0 ? ((balance / income) * 100).toFixed(1) : 0;

    // Calculate goal progress
    let totalGoalTarget = 0;
    let totalGoalSaved = 0;
    goals.forEach((g) => {
      totalGoalTarget += parseFloat(g.target_amount || 0);
      totalGoalSaved += parseFloat(g.total_saved || 0);
    });
    const goalProgress = totalGoalTarget > 0 ? ((totalGoalSaved / totalGoalTarget) * 100).toFixed(1) : 0;

    setSummary({
      totalIncome: income,
      totalExpense: expense,
      balance: balance,
      savingsRate: savingsRate,
      transactionCount: transactions.length,
      goalProgress: goalProgress,
    });
  }, [transactions, goals]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
      {/* Total Balance Card */}
      <div className="bg-gradient-to-br from-blue-800 rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90 mb-2">Total Balance</p>
            <p className="text-3xl font-bold mb-1">
              <RuPaySymbol showLogo={false} />{summary.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs opacity-75">{summary.transactionCount} transactions</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        </div>
        {summary.balance < 0 && (
          <div className="mt-3 pt-3 border-t border-white/20">
            <p className="text-xs font-medium opacity-90">⚠️ Negative balance detected</p>
          </div>
        )}
      </div>

      {/* Income Card */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm  font-medium opacity-90 mb-2">Total Income</p>
            <p className="text-3xl font-bold mb-1">
              <RuPaySymbol showLogo={false} />{summary.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs opacity-75">
              {transactions.filter(t => t.type === 'income').length} income entries
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expenses Card */}
      <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90 mb-2">Total Expenses</p>
            <p className="text-3xl font-bold mb-1">
              <RuPaySymbol showLogo={false} />{summary.totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs opacity-75">
              {transactions.filter(t => t.type === 'expense').length} expense entries
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Savings Rate / Goals Card */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90 mb-2">Savings Rate</p>
            <p className="text-3xl font-bold mb-1">{summary.savingsRate}%</p>
            <p className="text-xs opacity-75">
              {summary.savingsRate > 0 ? '🎯 On track!' : 'Needs attention'}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        {goals.length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/20">
            <p className="text-xs font-medium opacity-90">
              Goals Progress: {summary.goalProgress}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetSummary;
