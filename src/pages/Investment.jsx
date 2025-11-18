import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import RuPaySymbol from '../components/ui/RuPaySymbol';
import { getApiUrl } from '../config/api';

const Investment = () => {
  const { transactions } = useSelector((state) => state.transactions);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30');
  const [investmentAdvice, setInvestmentAdvice] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch investment advice when component mounts
    fetchInvestmentAdvice();
  }, [selectedTimeframe]);

  const fetchInvestmentAdvice = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const headers = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(getApiUrl('chatbot/ask/'), {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ message: "Give me investment advice based on my financial situation" }),
      });

      if (res.ok) {
        const data = await res.json();
        setInvestmentAdvice(data.bot_reply || data.reply);
      }
    } catch (err) {
      console.error("Error fetching investment advice:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate financial metrics
  const calculateMetrics = () => {
    const now = new Date();
    const daysAgo = new Date();
    daysAgo.setDate(now.getDate() - parseInt(selectedTimeframe));

    const filteredTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return transactionDate >= daysAgo;
    });

    const totalIncome = filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalExpense = filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const savings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

    return {
      totalIncome,
      totalExpense,
      savings,
      savingsRate,
      transactions: filteredTransactions.length,
    };
  };

  const metrics = calculateMetrics();

  // Investment recommendations based on savings rate
  const getInvestmentRecommendation = () => {
    if (metrics.savingsRate >= 20) {
      return {
        level: "Excellent",
        colorClass: "bg-green-100 text-green-800",
        message: "You're saving well! Consider diversifying your portfolio with equity, bonds, and gold.",
        allocation: { equity: 60, bonds: 30, gold: 10 }
      };
    } else if (metrics.savingsRate >= 10) {
      return {
        level: "Good",
        colorClass: "bg-blue-100 text-blue-800",
        message: "Good savings rate. Focus on building an emergency fund first, then invest.",
        allocation: { equity: 50, bonds: 40, gold: 10 }
      };
    } else if (metrics.savingsRate > 0) {
      return {
        level: "Fair",
        colorClass: "bg-yellow-100 text-yellow-800",
        message: "Try to increase your savings rate to at least 20% before investing significantly.",
        allocation: { equity: 40, bonds: 50, gold: 10 }
      };
    } else {
      return {
        level: "Needs Improvement",
        colorClass: "bg-red-100 text-red-800",
        message: "Focus on reducing expenses and increasing income before investing.",
        allocation: { equity: 0, bonds: 0, gold: 0 }
      };
    }
  };

  const recommendation = getInvestmentRecommendation();

  const investmentOptions = [
    {
      name: "Equity Mutual Funds",
      description: "Long-term wealth creation through stock market exposure",
      risk: "High",
      returns: "12-15%",
      minAmount: "₹500",
      icon: "📈"
    },
    {
      name: "Debt Funds",
      description: "Stable returns with lower risk",
      risk: "Low",
      returns: "6-8%",
      minAmount: "₹1,000",
      icon: "🏦"
    },
    {
      name: "Gold ETF",
      description: "Hedge against inflation and market volatility",
      risk: "Medium",
      returns: "8-10%",
      minAmount: "₹1,000",
      icon: "🥇"
    },
    {
      name: "SIP (Systematic Investment Plan)",
      description: "Invest small amounts regularly for long-term growth",
      risk: "Medium-High",
      returns: "10-12%",
      minAmount: "₹500/month",
      icon: "💰"
    },
    {
      name: "Fixed Deposits",
      description: "Safe and guaranteed returns",
      risk: "Very Low",
      returns: "5-7%",
      minAmount: "₹1,000",
      icon: "🔒"
    },
    {
      name: "PPF (Public Provident Fund)",
      description: "Tax-saving long-term investment",
      risk: "Very Low",
      returns: "7-8%",
      minAmount: "₹500/year",
      icon: "📋"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
            Investment Portfolio
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Plan your investments based on your financial health
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <label className="text-sm md:text-base font-medium text-gray-700">
            Analyze last:
          </label>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
          >
            <option value="30">30 days</option>
            <option value="90">90 days</option>
            <option value="180">6 months</option>
            <option value="365">1 year</option>
          </select>
        </div>

        {/* Financial Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm md:text-base font-medium text-gray-600">Total Income</h3>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-green-600">
              <RuPaySymbol showLogo={false} />{metrics.totalIncome.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm md:text-base font-medium text-gray-600">Total Expense</h3>
              <span className="text-2xl">💸</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-red-600">
              <RuPaySymbol showLogo={false} />{metrics.totalExpense.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm md:text-base font-medium text-gray-600">Savings</h3>
              <span className="text-2xl">💵</span>
            </div>
            <p className={`text-2xl md:text-3xl font-bold ${metrics.savings >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              <RuPaySymbol showLogo={false} />{metrics.savings.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm md:text-base font-medium text-gray-600">Savings Rate</h3>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-purple-600">
              {metrics.savingsRate.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Investment Recommendation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Investment Recommendation</h2>
            <div className={`inline-block px-4 py-2 rounded-lg mb-4 ${recommendation.colorClass} font-semibold`}>
              {recommendation.level}
            </div>
            <p className="text-gray-700 mb-6 text-sm md:text-base">{recommendation.message}</p>
            
            {recommendation.allocation.equity > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 mb-3">Suggested Portfolio Allocation:</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Equity</span>
                    <span className="font-bold text-blue-600">{recommendation.allocation.equity}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Bonds</span>
                    <span className="font-bold text-green-600">{recommendation.allocation.bonds}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="font-medium">Gold</span>
                    <span className="font-bold text-yellow-600">{recommendation.allocation.gold}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">AI Investment Advice</h2>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : investmentAdvice ? (
              <div className="bg-gray-50 rounded-lg p-4 md:p-6">
                <p className="text-gray-700 whitespace-pre-wrap text-sm md:text-base">{investmentAdvice}</p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm md:text-base">Click to get personalized investment advice</p>
            )}
            <button
              onClick={fetchInvestmentAdvice}
              disabled={loading}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Get AI Advice"}
            </button>
          </div>
        </div>

        {/* Investment Options */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Investment Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {investmentOptions.map((option, index) => (
              <div
                key={index}
                className="border-2 border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-lg transition-all hover:border-blue-500"
              >
                <div className="text-4xl mb-3">{option.icon}</div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">{option.name}</h3>
                <p className="text-gray-600 text-sm md:text-base mb-4">{option.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Risk:</span>
                    <span className={`font-semibold ${
                      option.risk === 'Very Low' || option.risk === 'Low' ? 'text-green-600' :
                      option.risk === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {option.risk}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Returns:</span>
                    <span className="font-semibold text-blue-600">{option.returns}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min Amount:</span>
                    <span className="font-semibold text-gray-800">{option.minAmount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Investment;

