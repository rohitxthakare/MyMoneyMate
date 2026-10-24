import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency.js';

const RecentTransactions = ({ transactions }) => {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-200/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Recent Transactions
        </h2>

        <Link
          to="/transactions"
          className="text-blue-600 text-sm font-medium hover:text-blue-700"
        >
          View All
        </Link>
      </div>

      {transactions.length === 0 ? (
        <p className="text-sm text-gray-500">No transactions yet.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {transactions.map((t) => (
            <li
              key={t._id}
              className="py-3 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-gray-900">
                  {t.category}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(t.date).toLocaleDateString('en-IN')}
                </p>
              </div>

              <span
                className={`font-semibold ${
                  t.type === 'income'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {t.type === 'income' ? '+' : '-'}
                {formatCurrency(t.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentTransactions;
