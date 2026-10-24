import { useState } from 'react';
import {
  FaLongArrowAltUp,
  FaLongArrowAltDown,
} from 'react-icons/fa';

import { CATEGORIES, PAYMENT_METHODS } from '../../utils/categories.js';

const TransactionForm = ({ initial, onSubmit, onCancel }) => {
  const [form, setForm] = useState(
    initial
      ? {
        type: initial.type,
        category: initial.category,
        amount: initial.amount,
        description: initial.description || '',
        date: initial.date.slice(0, 10),
        paymentMethod: initial.paymentMethod,
      }
      : {
        type: 'expense',
        category: CATEGORIES.expense[0],
        amount: '',
        description: '',
        date: '',
        paymentMethod: 'Cash',
      }
  );

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setForm({ ...form, type, category: CATEGORIES[type][0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await onSubmit({ ...form, amount: Number(form.amount) });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
      setForm({
        type: 'expense',
        category: CATEGORIES.expense[0],
        amount: '',
        description: '',
        date: '',
        paymentMethod: 'Cash',
      })
    }
  };

  const inputClass =
    'w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none text-gray-900';

  const labelClass = 'block text-sm font-medium text-gray-700 mb-2';

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-200/50 space-y-6"
    >
      <h2 className="text-lg font-semibold text-gray-900">
        {initial ? 'Edit Transaction' : 'Add New Transaction'}
      </h2>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 rounded-lg p-3">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Transaction Type</label>

          <div className="flex flex-wrap gap-3">
            <label className="cursor-pointer">
              <input
                type="radio"
                name="type"
                value="expense"
                checked={form.type === 'expense'}
                onChange={handleTypeChange}
                className="sr-only peer"
              />

              <span className={`flex items-center px-4 py-3 border-2 rounded-lg transition-all ${form.type === 'expense'
                ? 'bg-red-100 border-red-400'
                : 'bg-red-50 border-red-200'
                }`}>
                <FaLongArrowAltDown className="w-4 h-4 text-red-600 mr-2" />
                <span className="font-medium">Expense</span>
              </span>
            </label>

            <label className="cursor-pointer">
              <input
                type="radio"
                name="type"
                value="income"
                checked={form.type === 'income'}
                onChange={handleTypeChange}
                className="sr-only peer"
              />

              <span className={`flex items-center px-4 py-3 border-2 rounded-lg transition-all ${form.type === 'income'
                ? 'bg-green-100 border-green-400'
                : 'bg-green-50 border-green-200'
                }`}>
                <FaLongArrowAltUp className="w-4 h-4 text-green-600 mr-2" />
                <span className="font-medium">Income</span>
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className={labelClass}>Amount</label>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
              ₹
            </span>

            <input
              type="number"
              name="amount"
              placeholder="0.00"
              value={form.amount}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              required
              className={`${inputClass} pl-8`}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Category</label>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={inputClass}
          >
            {CATEGORIES[form.type].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Date</label>

          <input
            type="date"
            name="date"
            value={form.date}
            // max={new Date().toISOString().split('T')[0]}
            onChange={handleChange}
            required
            className={`${inputClass} [color-scheme:light]`}
          />
        </div>

        <div>
          <label className={labelClass}>Payment Method</label>

          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            className={inputClass}
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Description (Optional)</label>

          <input
            type="text"
            name="description"
            placeholder="Add a Description about this transaction..."
            value={form.description}
            onChange={handleChange}
            maxLength={200}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 cursor-pointer text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-all"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center px-6 py-3 cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50"
        >
          {submitting
            ? 'Saving...'
            : initial
              ? 'Update'
              : 'Add'}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
