import React, { useState, useEffect } from 'react';
import { useTransactionStore } from '../../stores/transactionStore';
import { useCategoryStore } from '../../stores/categoryStore';
import { X } from 'lucide-react';
import { Transaction, TransactionType } from '../../types';

interface TransactionFormProps {
  transactionId: number | null;
  onClose: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ transactionId, onClose }) => {
  const { transactions, addTransaction, updateTransaction, isLoading } = useTransactionStore();
  const { categories } = useCategoryStore();

  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    transaction_type: 'expense' as TransactionType,
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [error, setError] = useState<string | null>(null);
  const isEditing = transactionId !== null;

  useEffect(() => {
    if (isEditing) {
      const transaction = transactions.find(t => t.id === transactionId);
      if (transaction) {
        setFormData({
          amount: transaction.amount.toString(),
          description: transaction.description,
          transaction_type: transaction.transaction_type,
          category: transaction.category.toString(),
          date: transaction.date
        });
      }
    } else {
      setFormData({
        amount: '',
        description: '',
        transaction_type: 'expense',
        category: categories.length > 0 ? categories[0].id.toString() : '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [transactionId, transactions, categories, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than zero');
      return false;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }

    if (!formData.category) {
      setError('Category is required');
      return false;
    }

    if (!formData.date) {
      setError('Date is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      const transactionData: Omit<Transaction, 'id' | 'category_name'> = {
        amount: parseFloat(formData.amount),
        description: formData.description,
        transaction_type: formData.transaction_type,
        category: parseInt(formData.category),
        date: formData.date
      };

      if (isEditing && transactionId !== null) {
        await updateTransaction(transactionId, transactionData);
      } else {
        await addTransaction(transactionData);
      }

      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An error occurred');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-400 text-sm rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="form-label">Amount</label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                name="amount"
                id="amount"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={handleChange}
                className="form-input pl-7"
                placeholder="0.00"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="date" className="form-label">Date</label>
            <input
              type="date"
              name="date"
              id="date"
              value={formData.date}
              onChange={handleChange}
              className="form-input"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="form-label">Description</label>
          <input
            type="text"
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., Monthly Rent, Grocery Shopping"
            disabled={isLoading}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="transaction_type" className="form-label">Transaction Type</label>
            <select
              name="transaction_type"
              id="transaction_type"
              value={formData.transaction_type}
              onChange={handleChange}
              className="form-input"
              disabled={isLoading}
              required
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label htmlFor="category" className="form-label">Category</label>
            <select
              name="category"
              id="category"
              value={formData.category}
              onChange={handleChange}
              className="form-input"
              disabled={isLoading || categories.length === 0}
              required
            >
              {categories.length === 0 ? (
                <option value="">No categories available</option>
              ) : (
                categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              )}
            </select>
            {categories.length === 0 && (
              <p className="text-sm text-error-600 dark:text-error-400 mt-1">
                Please create a category first
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : isEditing ? 'Update Transaction' : 'Add Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
