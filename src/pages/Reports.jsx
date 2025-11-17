import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchTransactions } from '../store/slices/transactionSlice';
import Navbar from '../components/Navbar';
import RuPaySymbol from '../components/ui/RuPaySymbol';

const Reports = () => {
  const dispatch = useDispatch();
  const { transactions } = useSelector((state) => state.transactions);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const getFilteredTransactions = () => {
    const now = new Date();
    const daysAgo = new Date();
    daysAgo.setDate(now.getDate() - parseInt(timeRange));

    return transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return transactionDate >= daysAgo;
    });
  };

  const filteredTransactions = getFilteredTransactions();

  const stats = {
    totalIncome: filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0),
    totalExpense: filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0),
    transactions: filteredTransactions.length,
  };

  stats.balance = stats.totalIncome - stats.totalExpense;

  const categoryStats = {};
  filteredTransactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryStats[t.category] = (categoryStats[t.category] || 0) + parseFloat(t.amount);
    });

  const sortedCategories = Object.entries(categoryStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const topTransactions = [...filteredTransactions]
    .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Financial Reports</h1>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full sm:w-auto px-3 sm:px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 md:mb-8">
          <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-white rounded-xl shadow-sm">
            <div className="text-3xl sm:text-4xl">💰</div>
            <div>
              <h3 className="text-gray-600 font-medium mb-1 text-sm sm:text-base">Total Income</h3>
              <p className="text-xl sm:text-2xl font-bold text-green-500"><RuPaySymbol showLogo={false} />{stats.totalIncome.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-white rounded-xl shadow-sm">
            <div className="text-3xl sm:text-4xl">💸</div>
            <div>
              <h3 className="text-gray-600 font-medium mb-1 text-sm sm:text-base">Total Expense</h3>
              <p className="text-xl sm:text-2xl font-bold text-red-500"><RuPaySymbol showLogo={false} />{stats.totalExpense.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-white rounded-xl shadow-sm">
            <div className="text-3xl sm:text-4xl">💵</div>
            <div>
              <h3 className="text-gray-600 font-medium mb-1 text-sm sm:text-base">Balance</h3>
              <p className={`text-xl sm:text-2xl font-bold ${stats.balance >= 0 ? 'text-cyan-500' : 'text-pink-500'}`}>
                <RuPaySymbol showLogo={false} />{stats.balance.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-white rounded-xl shadow-sm">
            <div className="text-3xl sm:text-4xl">📊</div>
            <div>
              <h3 className="text-gray-600 font-medium mb-1 text-sm sm:text-base">Transactions</h3>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats.transactions}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 border-b border-gray-200 pb-3 sm:pb-4">Top Expense Categories</h2>
            {sortedCategories.length > 0 ? (
              <div className="space-y-4">
                {sortedCategories.map(([category, amount], index) => (
                  <div key={category} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold">
                      #{index + 1}
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <span className="font-semibold text-gray-800">{category}</span>
                      <span className="font-bold text-indigo-600"><RuPaySymbol showLogo={false} />{amount.toFixed(2)}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full mt-2 mb-4">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all"
                        style={{ width: `<RuPaySymbol showLogo={false} />{(amount / stats.totalExpense) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500">No expense data available</p>
            )}
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 border-b border-gray-200 pb-3 sm:pb-4">Top Transactions</h2>
            {topTransactions.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {topTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div className="text-xl sm:text-2xl">{transaction.type === 'income' ? '💰' : '💸'}</div>
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-gray-800 text-sm sm:text-base block sm:inline">{transaction.description}</span>
                      <span className="text-gray-600 text-xs sm:text-sm ml-0 sm:ml-2 block sm:inline">{new Date(transaction.date).toLocaleDateString()}</span>
                    </div>
                    <span className={`text-lg sm:text-xl font-bold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                      {transaction.type === 'income' ? '+' : '-'}<RuPaySymbol showLogo={false} />{Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500">No transactions available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
