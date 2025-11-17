import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import { fetchTransactions } from '../store/slices/transactionSlice';
import Navbar from '../components/Navbar';
import DashboardNav from '../components/DashboardNav';
import BudgetSummary from '../components/BudgetSummary';
import TransactionForm from '../components/TransactionForm';
import ChatbotWidget from '../components/ChatbotWidget';
import RuPaySymbol from '../components/ui/RuPaySymbol';


const Dashboard = () => {
  const dispatch = useDispatch();
  const { transactions, loading } = useSelector((state) => state.transactions);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setShowForm(true);
  };

  const handleEditTransaction = (transaction) => {
    if (transaction && transaction.id) {
      // Ensure we have a valid transaction with an id
      setEditingTransaction(transaction);
      setShowForm(true);
    } else {
      // If no transaction or no id, treat as add new
      handleAddTransaction();
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <DashboardNav />
        
        {/* <BudgetSummary /> */}

        <Outlet context={{ onEditTransaction: handleEditTransaction }} />

        {showForm && (
          <TransactionForm
            transaction={editingTransaction}
            onClose={handleCloseForm}
          />
        )}

        {loading && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      <ChatbotWidget />
    </div>
  );
};

export default Dashboard;
