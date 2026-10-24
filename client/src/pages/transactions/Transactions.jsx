import { useEffect, useState } from 'react';
import {
  FiSearch,
} from 'react-icons/fi';

import { BsPencilSquare } from "react-icons/bs";
import { CiTrash } from "react-icons/ci";

import {
  FaLongArrowAltUp,
  FaLongArrowAltDown,
} from 'react-icons/fa';

import { useTransactions } from '../../context/TransactionContext.jsx';
import TransactionForm from './TransactionForm.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import Layout from '../../components/layout/Layout.jsx';

const Transactions = () => {
  const {
    transactions,
    loading,
    fetchTransactions,
    addTransaction,
    editTransaction,
    removeTransaction,
  } = useTransactions();

  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleAdd = (data) => addTransaction(data);

  const handleEdit = async (data) => {
    await editTransaction(editing._id, data);
    setEditing(null);
  };

  const handleDelete = async (id) => {
    await removeTransaction(id);
  };

  // Build a list of categories from the transactions.
  const categories = [
    'all',
    ...new Set(transactions.map((t) => t.category)),
  ];

  // Filter transactions.
  const filteredTransactions = transactions
    .filter((transaction) => {
      const matchesSearch =
        transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' ||
        transaction.category === selectedCategory;

      const matchesType =
        selectedType === 'all' ||
        transaction.type === selectedType;

      return matchesSearch && matchesCategory && matchesType;
    })

  return (
    <Layout >
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Transactions
          </h1>
          <p className="text-gray-600 mt-1">
            View and manage all your transactions.
          </p>
        </div>

        {/* key forces a fresh form when switching between add and edit */}
        {editing ? (
          <TransactionForm
            key={editing._id}
            initial={editing}
            onSubmit={handleEdit}
            onCancel={() => setEditing(null)}
          />
        ) : (
          <TransactionForm
            key="new"
            onSubmit={handleAdd}
          />
        )}

        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-200/50">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none text-gray-900"
                />
              </div>
            </div>

            <div className="lg:w-48">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none text-gray-900"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className="lg:w-56">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none text-gray-900"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-200/50">          <div className="border-b border-gray-200/70">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            All Transactions
          </h2>
        </div>

          {loading ? (
            <p className="p-6 text-gray-500 text-center">Loading transactions...</p>
          ) : filteredTransactions.length === 0 ? (
            <h3 className="text-sm text-gray-500">
              {transactions.length === 0
                ? 'No transactions yet.'
                : 'No matching transactions.'}
            </h3>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredTransactions.map((t) => (
                <div key={t._id} className="py-3">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`p-3 rounded-xl shrink-0 ${t.type === 'income'
                          ? 'bg-green-100'
                          : 'bg-red-100'
                          }`}
                      >
                        {t.type === 'income' ? (
                          <FaLongArrowAltUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <FaLongArrowAltDown className="w-5 h-5 text-red-600" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900">
                          {t.category}
                        </h3>

                        {t.description && (
                          <p className="text-sm text-gray-600 break-words">
                            {t.description}
                          </p>
                        )}

                        <p className="text-sm text-gray-500">
                          {new Date(t.date).toLocaleDateString('en-IN')}
                          {t.paymentMethod && ` · ${t.paymentMethod}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-4">
                      <span
                        className={`font-bold ${t.type === 'income'
                          ? 'text-green-600'
                          : 'text-red-600'
                          }`}
                      >
                        {t.type === 'income' ? '+' : '-'}
                        {formatCurrency(t.amount)}
                      </span>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setEditing(t)}
                          className="p-2 rounded-lg transition-colors"
                        >
                          <BsPencilSquare />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(t._id)}
                          className="p-2 rounded-lg transition-colors"
                        >
                          <CiTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {filteredTransactions.length > 0 && (
          <p className="text-center text-sm text-gray-600">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </p>
        )}
      </div>
    </Layout>
  );
};

export default Transactions;
