import { useEffect } from 'react';
import {
  FiBriefcase,
} from 'react-icons/fi';
import {
  FaLongArrowAltUp,
  FaLongArrowAltDown,
} from 'react-icons/fa';

import { useTransactions } from '../../context/TransactionContext.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import CategoryPieChart from '../../components/charts/CategoryPieChart.jsx';
import Layout from '../../components/layout/Layout.jsx';
import SummaryCard from '../../components/cards/SummaryCard.jsx';
import RecentTransactions from './RecentTransactions.jsx';

const Dashboard = () => {
  const {
    summary,
    transactions,
    fetchSummary,
    fetchTransactions,
  } = useTransactions();

  useEffect(() => {
    fetchSummary();
    fetchTransactions();
  }, [fetchSummary, fetchTransactions]);

  if (!summary) {
    return <p className="p-6 text-gray-500 text-center">Loading dashboard...</p>;
  }

  const recent = transactions.slice(0, 5);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Here's your financial overview.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SummaryCard
            label="Total Income"
            value={formatCurrency(summary.totalIncome)}
            icon={FaLongArrowAltUp}
            iconColor="text-green-600"
            iconBg="bg-green-100"
          />

          <SummaryCard
            label="Total Expense"
            value={formatCurrency(summary.totalExpense)}
            icon={FaLongArrowAltDown}
            iconColor="text-red-600"
            iconBg="bg-red-100"
          />

          <SummaryCard
            label="Net Balance"
            value={formatCurrency(summary.netBalance)}
            icon={FiBriefcase}
            iconColor="text-blue-600"
            iconBg="bg-blue-100"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-200/50">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Spending by Category
            </h2>

            {summary.categoryBreakdown.length === 0 ? (
              <p className="text-sm text-gray-500">No expenses yet.</p>
            ) : (
              <CategoryPieChart data={summary.categoryBreakdown} />
            )}
          </div>

          <RecentTransactions transactions={recent} />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
