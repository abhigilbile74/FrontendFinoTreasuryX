import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import { deleteTransaction } from '../store/slices/transactionSlice';
import RuPaySymbol from './ui/RuPaySymbol';
import BudgetSummary from './BudgetSummary';

const TransactionList = ({ showAddButton = true }) => {
  const dispatch = useDispatch();
  const { transactions } = useSelector((state) => state.transactions);
  const [hoveredId, setHoveredId] = useState(null);
  const { onEditTransaction: onEdit } = useOutletContext() || {};

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await dispatch(deleteTransaction(id)).unwrap();
      } catch (error) {
        console.error('Failed to delete transaction:', error);
        alert('Failed to delete transaction. Please try again.');
      }
    }
  };

  const handleEdit = (transaction) => {
    if (onEdit && transaction) {
      // Ensure transaction has all required fields
      if (!transaction.id) {
        console.error('Transaction missing id:', transaction);
        alert('Error: Transaction ID is missing. Cannot edit this transaction.');
        return;
      }
      // Pass the complete transaction object
      onEdit({ ...transaction });
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Food & Dining': 'bg-orange-100 text-orange-800',
      'Food': 'bg-orange-100 text-orange-800',
      'Transportation': 'bg-blue-100 text-blue-800',
      'Transport': 'bg-blue-100 text-blue-800',
      'Shopping': 'bg-blue-100 text-blue-800',
      'Bills': 'bg-yellow-100 text-yellow-800',
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Salary': 'bg-green-100 text-green-800',
      'Health': 'bg-pink-100 text-pink-800',
      'Other': 'bg-gray-100 text-gray-800',
    };
    
    // Try exact match first, then try partial matches
    return colors[category] || 
           colors[Object.keys(colors).find(key => category.includes(key))] || 
           'bg-gray-100 text-gray-800';
  };

  // Sort transactions by date (most recent first) and limit to recent ones
  const sortedTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  return (
    
    <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
      <BudgetSummary /> 
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Recent Transactions</h2>
        {showAddButton && (
          <button
            onClick={onEdit}
            className="w-full sm:w-auto px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-all text-sm md:text-base"
          >
            + Add Transaction
          </button>
        )}
      </div>
      {sortedTransactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No transactions yet. Add your first transaction!</p>
        </div>
      ) : (
        <div className="space-y-0">
          {sortedTransactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className={`flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 px-2 sm:px-4 group transition-all ${
                index !== sortedTransactions.length - 1 ? 'border-b border-gray-100' : ''
              } hover:bg-gray-50`}
              onMouseEnter={() => setHoveredId(transaction.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="flex-1 w-full sm:w-auto mb-2 sm:mb-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-sm sm:text-base font-medium text-gray-800 break-words">{transaction.description}</span>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${getCategoryColor(transaction.category)}`}>
                    {transaction.category}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{formatDate(transaction.date)}</span>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 w-full sm:w-auto">
                <span className={`text-sm sm:text-base font-semibold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                  {transaction.type === 'income' ? '+' : '-'}<RuPaySymbol showLogo={false} />{Math.abs(transaction.amount).toFixed(2)}
                </span>
                <div className="flex items-center gap-2 sm:hidden">
                  <button
                    onClick={() => handleEdit(transaction)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                    title="Update"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                {hoveredId === transaction.id && (
                  <div className="hidden sm:flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                      title="Update"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    
  );
  
};

export default TransactionList;
