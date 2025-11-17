import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTransaction, updateTransaction } from '../store/slices/transactionSlice';

const TransactionForm = ({ transaction, onClose }) => {
  const dispatch = useDispatch();
  
  const isEditMode = transaction && transaction.id;

  const [formData, setFormData] = useState({
    amount: transaction?.amount || '',
    description: transaction?.description || '',
    category: transaction?.category || 'Food',
    type: transaction?.type || 'expense',
    date: transaction?.date ? (transaction.date.includes('T') ? transaction.date.split('T')[0] : transaction.date) : new Date().toISOString().split('T')[0],
    budget: transaction?.budget || '',
  });

  // Default categories
  const [categories, setCategories] = useState([
    'Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Salary', 'Other'
  ]);

  const [customCategory, setCustomCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  useEffect(() => {
    if (transaction && transaction.id) {
      setFormData({
        amount: transaction.amount || '',
        description: transaction.description || '',
        category: transaction.category || 'Food',
        type: transaction.type || 'expense',
        date: transaction.date ? (transaction.date.includes('T') ? transaction.date.split('T')[0] : transaction.date) : new Date().toISOString().split('T')[0],
        budget: transaction.budget || '',
      });
    } else {
      setFormData({
        amount: '',
        description: '',
        category: 'Food',
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
        budget: '',
      });
    }
  }, [transaction]);

  const types = ['income', 'expense'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddCustomCategory = () => {
    if (customCategory.trim() && !categories.includes(customCategory)) {
      const updatedCategories = [...categories, customCategory];
      setCategories(updatedCategories);
      setFormData({ ...formData, category: customCategory });
      setCustomCategory('');
      setIsAddingCategory(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await dispatch(updateTransaction({ id: transaction.id, transactionData: formData })).unwrap();
      } else {
        await dispatch(addTransaction(formData)).unwrap();
      }
      onClose();
    } catch (error) {
      console.error('Failed to save transaction:', error);
      alert('Failed to save transaction. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 md:p-6 lg:p-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">{isEditMode ? 'Edit Transaction' : 'Add Transaction'}</h2>
          
          <form onSubmit={handleSubmit}>
            
            {/* Type */}
            <div className="mb-4">
              <label htmlFor="type" className="block mb-2 text-gray-700 font-medium">Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div className="mb-4">
              <label htmlFor="amount" className="block mb-2 text-gray-700 font-medium">Amount</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Budget */}
            <div className="mb-4">
              <label htmlFor="budget" className="block mb-2 text-gray-700 font-medium">Budget</label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                placeholder="Total Budget assigned"
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label htmlFor="description" className="block mb-2 text-gray-700 font-medium">Description</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label htmlFor="category" className="block mb-2 text-gray-700 font-medium">Category</label>

              {!isAddingCategory ? (
                <div className="flex gap-2">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(true)}
                    className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200"
                  >
                    + Add
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="New category name"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomCategory}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Date */}
            <div className="mb-6">
              <label htmlFor="date" className="block mb-2 text-gray-700 font-medium">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
              <button type="button" onClick={onClose} className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 text-gray-800 rounded-lg font-semibold hover:bg-gray-200 text-sm sm:text-base">
                Cancel
              </button>
              <button type="submit" className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm sm:text-base">
                {isEditMode ? 'Update' : 'Add'} Transaction
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
