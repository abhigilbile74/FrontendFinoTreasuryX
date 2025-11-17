import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { generateExcelReport } from '../utils/reportGenerator';

const DashboardNav = () => {
  const location = useLocation();
  const { transactions } = useSelector((state) => state.transactions);
  const { budgets } = useSelector((state) => state.budget);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportMessage, setReportMessage] = useState('');

  const tabs = [
    { name: 'Overview', path: '/dashboard' },
    { name: 'Transactions', path: '/dashboard/transactionslist' },
    { name: 'Budgets', path: '/dashboard/budgetsoverview' },
    { name: 'Analytics', path: '/dashboard/analyticsoverview' },
    { name: 'Goals', path: '/dashboard/goalslist' },
    { name: 'Chatbot', path: '/dashboard/chatbot' },
    { name: 'Investment', path: '/dashboard/investment' },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setReportMessage('');
    
    try {
      const result = generateExcelReport(transactions, budgets, 'Financial_Report');
      
      if (result.success) {
        setReportMessage('✅ Report generated successfully!');
        setTimeout(() => setReportMessage(''), 3000);
      } else {
        setReportMessage(`❌ ${result.message}`);
      }
    } catch (error) {
      setReportMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <nav className="mb-4 md:mb-6">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center justify-between bg-white/60 backdrop-blur-md border border-gray-200 rounded-xl p-2 sm:p-3 shadow-sm">
        <div className="flex gap-1 sm:gap-2 flex-wrap overflow-x-auto pb-2 sm:pb-0">
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              to={tab.path}
              className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                isActive(tab.path)
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating || (transactions?.length === 0 && budgets?.length === 0)}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md text-xs sm:text-sm font-medium transition-all shadow-md hover:shadow-lg"
            title="Generate Excel report with transactions and budgets"
          >
            <span className="text-sm sm:text-base">📊</span>
            <span className="hidden sm:inline">{isGenerating ? 'Generating...' : 'Export Report'}</span>
            <span className="sm:hidden">{isGenerating ? '...' : 'Export'}</span>
          </button>

          {reportMessage && (
            <span className={`text-xs font-medium px-2 py-1 rounded ${
              reportMessage.includes('✅') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {reportMessage}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default DashboardNav;


