import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGoals, deleteGoal, updateGoal, addContribution, addStrategyItem, updateStrategyItem } from '../store/slices/goalSlice';
import RuPaySymbol from './ui/RuPaySymbol';

const GoalList = ({ onEdit }) => {
  const dispatch = useDispatch();
  const { goals, loading } = useSelector((state) => state.goals);
  const [savedAmounts, setSavedAmounts] = useState({});
  const [strategyProgress, setStrategyProgress] = useState({});
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [contributionMethods, setContributionMethods] = useState({});
  const [contributionAmounts, setContributionAmounts] = useState({});
  
  // Available methods for contributions
  const availableMethods = [
    'Automated Savings Transfer',
    'Expense Reduction (Subscriptions/Eating Out)',
    'Extra Income (Freelance/Selling)'
  ];

  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  // Initialize savedAmounts from goals when they load
  useEffect(() => {
    if (goals && goals.length > 0) {
      const initialAmounts = {};
      goals.forEach(goal => {
        if (goal.total_saved !== undefined) {
          initialAmounts[goal.id] = goal.total_saved;
        }
      });
      setSavedAmounts(prev => ({ ...prev, ...initialAmounts }));
    }
  }, [goals]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
      try {
        await dispatch(deleteGoal(id)).unwrap();
        // Goals will be automatically updated in the store via the reducer
      } catch (error) {
        console.error('Failed to delete goal:', error);
        const errorMessage = error?.response?.data?.detail || error?.message || 'Failed to delete goal. Please try again.';
        alert(errorMessage);
      }
    }
  };

  const handleUpdateStatus = async (goalId, amount, method) => {
    const contributionAmount = parseFloat(amount);
    if (isNaN(contributionAmount) || contributionAmount <= 0) {
      alert('Please enter a valid amount greater than 0.');
      return;
    }

    if (!method) {
      alert('Please select a method for this contribution.');
      return;
    }

    const goal = goals.find(g => g.id === goalId);
    if (!goal) {
      alert('Goal not found.');
      return;
    }

    setUpdatingStatus({ ...updatingStatus, [goalId]: true });

    try {
      // Add a contribution with the method in the note
      await dispatch(addContribution({
        goalId: goalId,
        amount: contributionAmount,
        date: new Date().toISOString().split('T')[0],
        note: `Method: ${method}`
      })).unwrap();
      
      // Check if strategy item exists for this method, if not create it
      const existingStrategy = goal.strategy_items?.find(item => 
        item.method.toLowerCase() === method.toLowerCase()
      );
      
      if (!existingStrategy) {
        // Create or update strategy item
        const strategyOrder = goal.strategy_items?.length || 0;
        try {
          await dispatch(addStrategyItem({
            goalId: goalId,
            method: method,
            monthlyContribution: contributionAmount,
            order: strategyOrder
          })).unwrap();
        } catch (strategyError) {
          console.warn('Failed to create strategy item:', strategyError);
          // Continue even if strategy item creation fails
        }
      } else {
        // Update existing strategy item's monthly contribution if needed
        const currentMonthly = parseFloat(existingStrategy.monthly_contribution || 0);
        if (contributionAmount > currentMonthly) {
          try {
            await dispatch(updateStrategyItem({
              id: existingStrategy.id,
              method: existingStrategy.method,
              monthlyContribution: contributionAmount,
              order: existingStrategy.order
            })).unwrap();
          } catch (strategyError) {
            console.warn('Failed to update strategy item:', strategyError);
          }
        }
      }
      
      // Refresh goals to get updated total_saved and strategy_items
      await dispatch(fetchGoals()).unwrap();
      
      // Clear the input fields for this goal
      const updatedMethods = { ...contributionMethods };
      const updatedAmounts = { ...contributionAmounts };
      delete updatedMethods[goalId];
      delete updatedAmounts[goalId];
      setContributionMethods(updatedMethods);
      setContributionAmounts(updatedAmounts);
      
      alert(`Successfully added $${contributionAmount.toFixed(2)} via ${method}!`);
    } catch (error) {
      console.error('Failed to update progress:', error);
      const errorMessage = error?.response?.data?.detail || 
                          error?.response?.data?.message || 
                          (error?.response?.data?.amount ? error.response.data.amount[0] : null) ||
                          error?.message || 
                          'Failed to update progress. Please try again.';
      alert(`Error: ${errorMessage}`);
    } finally {
      setUpdatingStatus({ ...updatingStatus, [goalId]: false });
    }
  };

  const calculateProgress = (current, target) => {
    if (!target || target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const updateProgress = (goal) => {
    const saved = parseFloat(savedAmounts[goal.id] !== undefined ? savedAmounts[goal.id] : (goal.total_saved || 0));
    const target = parseFloat(goal.target_amount || 0);
    
    if (!target || target === 0) {
      return { percentage: 0, message: 'Please set a valid goal amount.', saved, remaining: 0 };
    }

    const percentage = calculateProgress(saved, target);
    const remaining = Math.max(target - saved, 0);
    
    let message = '';
    if (saved >= target && target > 0) {
      message = `🎉 CONGRATULATIONS! You've reached your $${target.toLocaleString()} goal! Total Saved: $${saved.toLocaleString()}`;
    } else {
      message = `Current Status: ${percentage.toFixed(2)}% complete. Saved: $${saved.toLocaleString()}. Remaining: $${remaining.toLocaleString()}.`;
      if (goal.monthly_target) {
        const monthsLeft = remaining / goal.monthly_target;
        message += ` Target Monthly Contribution: $${goal.monthly_target.toLocaleString()}. Estimated months to reach target: ${monthsLeft.toFixed(1)}.`;
      }
    }

    return { percentage, message, saved, remaining };
  };

  const getStrategyProgress = (goalId, strategyMethod, monthlyContribution) => {
    const key = `${goalId}-${strategyMethod}`;
    const saved = parseFloat(strategyProgress[key] || 0);
    const target = parseFloat(monthlyContribution || 0);
    return {
      saved,
      target,
      percentage: calculateProgress(saved, target)
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getClassificationLabel = (classification) => {
    const labels = {
      'short': 'Short-Term Goal',
      'mid': 'Mid-Term Goal',
      'long': 'Long-Term Goal'
    };
    return labels[classification] || classification;
  };

  const calculateMonths = (startDate, endDate) => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return months;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 md:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">🎯 My SMART Financial Goal Tracker</h1>
        <button
          onClick={() => onEdit(null)}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
        >
          + Add Goal
        </button>
      </div>

      {(!goals || goals.length === 0) ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <p className="text-gray-500 text-lg">No goals set yet. Start by adding your first financial goal!</p>
        </div>
      ) : (
        <div className="space-y-10">
          {goals.map((goal) => {
            const progress = updateProgress(goal);
            const months = calculateMonths(goal.start_date, goal.end_date);
            const totalStrategy = goal.strategy_items?.reduce((sum, item) => sum + parseFloat(item.monthly_contribution || 0), 0) || 0;
            const extraIncomeStrategy = goal.strategy_items?.find(item => 
              item.method?.toLowerCase().includes('extra income') || item.method?.toLowerCase().includes('freelance') || item.method?.toLowerCase().includes('selling')
            );
            const expenseReductionStrategy = goal.strategy_items?.find(item => 
              item.method?.toLowerCase().includes('expense reduction') || item.method?.toLowerCase().includes('subscription') || item.method?.toLowerCase().includes('eating out')
            );

            return (
              <div key={goal.id} className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-4 md:p-6 lg:p-8">
                {/* Header with Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 md:mb-6 border-b-4 border-blue-600 pb-3">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">
                    🎯 {goal.title}
                  </h1>
                  <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => onEdit(goal)}
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2 text-sm sm:text-base"
                      title="Update"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span className="hidden sm:inline">Update</span>
                      <span className="sm:hidden">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all shadow-md flex items-center justify-center gap-2 text-sm sm:text-base"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span className="hidden sm:inline">Delete</span>
                      <span className="sm:hidden">Del</span>
                    </button>
                  </div>
                </div>

                {/* Goal Section */}
                <section className="mt-6">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-2xl font-semibold text-green-600 mt-5">
                      Goal: {goal.title}
                    </h2>
                    {goal.end_date && (
                      <div className="bg-red-100 border-2 border-red-500 rounded-lg p-3 text-center">
                        <p className="text-xs text-red-700 font-semibold mb-1">⏰ DEADLINE</p>
                        <p className="text-lg font-bold text-red-700">
                          {new Date(goal.end_date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                        {(() => {
                          const today = new Date();
                          const deadline = new Date(goal.end_date);
                          const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
                          return daysLeft > 0 ? (
                            <p className="text-sm text-red-600 mt-1">{daysLeft} days left</p>
                          ) : daysLeft === 0 ? (
                            <p className="text-sm text-red-600 mt-1">Today!</p>
                          ) : (
                            <p className="text-sm text-red-600 mt-1">{Math.abs(daysLeft)} days overdue</p>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-5 rounded-md mt-3">
                    <p className="text-gray-700 mb-2">
                      <strong>Goal Statement:</strong> {goal.description || (
                        <>
                          Build <strong>{goal.title}</strong> of{" "}
                          <strong><RuPaySymbol showLogo={false} />{goal.target_amount?.toLocaleString()}</strong>
                          {goal.monthly_target && (
                            <> by depositing <strong><RuPaySymbol showLogo={false} />{goal.monthly_target.toLocaleString()}</strong> every month</>
                          )}
                          {months && <> for the next <strong>{months} months</strong></>}
                          {!months && goal.end_date && <> with a deadline of <strong>{new Date(goal.end_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</strong></>}
                        </>
                      )}
                    </p>
                    <p className="mb-1">
                      <strong>Classification:</strong> {getClassificationLabel(goal.classification)}
                    </p>
                    {goal.start_date && goal.end_date && (
                      <p>
                        <strong>Timeline:</strong> {months} Months ({formatDate(goal.start_date)} – {formatDate(goal.end_date)})
                      </p>
                    )}
                  </div>
                </section>

                <hr className="my-8 border-gray-300" />

                {/* Financial Requirements */}
                <section>
                  <h2 className="text-2xl font-semibold text-green-600 mb-4">
                    💰 Financial Requirements
                  </h2>
                  <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                      <tr className="bg-blue-600 text-white text-center">
                        <th className="py-2 px-3 border border-gray-300">Category</th>
                        <th className="py-2 px-3 border border-gray-300">Amount</th>
                        <th className="py-2 px-3 border border-gray-300">Calculation</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border border-gray-300">
                        <td className="py-2 px-3 font-semibold">Total Money Needed</td>
                        <td className="py-2 px-3"><RuPaySymbol showLogo={false} />{goal.target_amount?.toLocaleString()}</td>
                        <td className="py-2 px-3">Target {goal.title}</td>
                      </tr>
                      {goal.monthly_target && (
                        <tr className="border border-gray-300">
                          <td className="py-2 px-3 font-semibold">Money Needed Per Month</td>
                          <td className="py-2 px-3"><RuPaySymbol showLogo={false} />{goal.monthly_target.toLocaleString()}</td>
                          <td className="py-2 px-3">
                            {months ? `${goal.target_amount?.toLocaleString()} ÷ ${months} months` : 'Monthly Target'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </section>

                <hr className="my-8 border-gray-300" />

                {/* Strategy Breakdown */}
                {goal.strategy_items && goal.strategy_items.length > 0 && (
                  <>
                    <section>
                      <h2 className="text-2xl font-semibold text-green-600 mb-4">
                        ✅ Best Combination Strategy (Monthly Breakdown)
                      </h2>
                      <table className="w-full border-collapse border border-gray-300 text-sm mb-6">
                        <thead>
                          <tr className="bg-blue-600 text-white text-center">
                            <th className="py-2 px-3 border border-gray-300">Method</th>
                            <th className="py-2 px-3 border border-gray-300">Monthly Contribution</th>
                          </tr>
                        </thead>
                        <tbody>
                          {goal.strategy_items.map((item, idx) => {
                            const stratProgress = getStrategyProgress(goal.id, item.method, item.monthly_contribution);
                            return (
                              <tr key={idx} className="border border-gray-300">
                                <td className="py-2 px-3 font-semibold">{item.method}</td>
                                <td className="py-2 px-3"><RuPaySymbol showLogo={false} />{parseFloat(item.monthly_contribution).toLocaleString()}</td>
                              </tr>
                            );
                          })}
                          <tr className="bg-blue-100 font-semibold">
                            <td className="py-2 px-3">TOTAL MONTHLY CONTRIBUTION</td>
                            <td className="py-2 px-3"><RuPaySymbol showLogo={false} />{totalStrategy.toLocaleString()}</td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Strategy Progress Bars */}
                      <div className="space-y-4">
                        {extraIncomeStrategy && (() => {
                          const stratProgress = getStrategyProgress(goal.id, extraIncomeStrategy.method, extraIncomeStrategy.monthly_contribution);
                          return (
                            <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold text-purple-700">
                                  💵 Extra Income Progress ({extraIncomeStrategy.method})
                                </h3>
                                <span className="text-sm font-medium text-purple-700">
                                  <RuPaySymbol showLogo={false} />{stratProgress.saved.toLocaleString()} / <RuPaySymbol showLogo={false} />{stratProgress.target.toLocaleString()}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                                <div
                                  className="bg-purple-500 h-4 rounded-full transition-all duration-500"
                                  style={{ width: `${stratProgress.percentage}%` }}
                                ></div>
                              </div>
                              <div className="flex gap-3">
                                <input
                                  type="number"
                                  min="0"
                                  step="10"
                                  placeholder="Amount saved"
                                  value={strategyProgress[`${goal.id}-${extraIncomeStrategy.method}`] || ''}
                                  onChange={(e) => setStrategyProgress({
                                    ...strategyProgress,
                                    [`${goal.id}-${extraIncomeStrategy.method}`]: e.target.value
                                  })}
                                  className="border rounded-md px-3 py-2 w-40 text-sm"
                                />
                                <button
                                  onClick={() => {
                                    const key = `${goal.id}-${extraIncomeStrategy.method}`;
                                    // Here you could save to backend
                                    alert(`Updated ${extraIncomeStrategy.method} progress!`);
                                  }}
                                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-md transition text-sm"
                                >
                                  Update
                                </button>
                              </div>
                            </div>
                          );
                        })()}

                        {expenseReductionStrategy && (() => {
                          const stratProgress = getStrategyProgress(goal.id, expenseReductionStrategy.method, expenseReductionStrategy.monthly_contribution);
                          return (
                            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold text-orange-700">
                                  💰 Expense Reduction Progress ({expenseReductionStrategy.method})
                                </h3>
                                <span className="text-sm font-medium text-orange-700">
                                  <RuPaySymbol showLogo={false} />{stratProgress.saved.toLocaleString()} / <RuPaySymbol showLogo={false} />{stratProgress.target.toLocaleString()}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                                <div
                                  className="bg-orange-500 h-4 rounded-full transition-all duration-500"
                                  style={{ width: `${stratProgress.percentage}%` }}
                                ></div>
                              </div>
                              <div className="flex gap-3">
                                <input
                                  type="number"
                                  min="0"
                                  step="10"
                                  placeholder="Amount saved"
                                  value={strategyProgress[`${goal.id}-${expenseReductionStrategy.method}`] || ''}
                                  onChange={(e) => setStrategyProgress({
                                    ...strategyProgress,
                                    [`${goal.id}-${expenseReductionStrategy.method}`]: e.target.value
                                  })}
                                  className="border rounded-md px-3 py-2 w-40 text-sm"
                                />
                                <button
                                  onClick={() => {
                                    const key = `${goal.id}-${expenseReductionStrategy.method}`;
                                    // Here you could save to backend
                                    alert(`Updated ${expenseReductionStrategy.method} progress!`);
                                  }}
                                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-2 rounded-md transition text-sm"
                                >
                                  Update
                                </button>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </section>

                    <hr className="my-8 border-gray-300" />
                  </>
                )}

                {/* Progress Section */}
                <section className="bg-yellow-50 border border-yellow-300 p-6 rounded-md">
                  <h2 className="text-2xl font-semibold mb-3">📈 Track Your Progress</h2>
                  <p className="text-gray-700 mb-4">
                    Add a contribution to track your progress against the <strong><RuPaySymbol showLogo={false} />{goal.target_amount?.toLocaleString()}</strong> goal.
                    Select a method and enter the amount contributed.
                  </p>
                  
                  {/* Method and Amount Input */}
                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 mb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Method
                        </label>
                        <select
                          value={contributionMethods[goal.id] || ''}
                          onChange={(e) => setContributionMethods({
                            ...contributionMethods,
                            [goal.id]: e.target.value
                          })}
                          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                          <option value="">Select a method</option>
                          {availableMethods.map((method) => (
                            <option key={method} value={method}>{method}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Monthly Contribution (<RuPaySymbol showLogo={false} />)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Enter amount"
                          value={contributionAmounts[goal.id] || ''}
                          onChange={(e) => setContributionAmounts({
                            ...contributionAmounts,
                            [goal.id]: e.target.value
                          })}
                          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => handleUpdateStatus(
                        goal.id, 
                        contributionAmounts[goal.id] || 0,
                        contributionMethods[goal.id] || ''
                      )}
                      disabled={updatingStatus[goal.id] || !contributionMethods[goal.id] || !contributionAmounts[goal.id]}
                      className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-300 disabled:cursor-not-allowed text-gray-800 font-bold px-4 py-2 rounded-md transition"
                    >
                      {updatingStatus[goal.id] ? 'Updating...' : 'Add Contribution'}
                    </button>
                  </div>

                  {/* Current Progress Display */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-gray-700">Current Progress</span>
                      <span className="font-bold text-gray-800">
                        <RuPaySymbol showLogo={false} />{(goal.total_saved || 0).toLocaleString()} / <RuPaySymbol showLogo={false} />{goal.target_amount?.toLocaleString()}
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
                      <div
                        className="bg-green-500 h-4 transition-all duration-500"
                        style={{ width: `${progress.percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Status Message */}
                  <div className="border border-dashed border-gray-500 rounded-md bg-white p-4 whitespace-pre-line">
                    <strong>Status:</strong> {progress.message}
                  </div>
                </section>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GoalList;
