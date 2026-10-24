import { FiTarget, FiShoppingBag } from 'react-icons/fi';
import { formatCurrency } from '../../utils/formatCurrency.js';

const SavingRecommendations = ({ aiSpendingData }) => {
    return (
        <div className='space-y-8'>
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
                <div className="p-6 border-b border-gray-200/70">
                    <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                        <FiShoppingBag className="w-5 h-5 text-blue-600" />
                        Where You Spend the Most
                    </h2>
                </div>

                <div className="divide-y divide-gray-200/70">
                    {aiSpendingData.spendingAnalysis.map((item, index) => (
                        <div
                            key={`${item.category}-${index}`}
                            className="p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4"
                        >
                            <div>
                                <h3 className="font-semibold text-gray-900">
                                    {item.category}
                                </h3>

                                <p className="text-sm text-gray-600 mt-1">
                                    {item.message}
                                </p>
                            </div>

                            <p className="font-bold text-gray-900">
                                {formatCurrency(item.amount)}
                            </p>
                        </div>
                    ))}
                </div>

                <p className="p-6 text-sm text-gray-600 border-t border-gray-200/70">
                    {aiSpendingData.spendingSummary}
                </p>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
                <div className="p-6 border-b border-gray-200/70">
                    <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                        <FiTarget className="w-5 h-5 text-blue-600" />
                        Smart Budget Recommendations
                    </h2>
                </div>

                <div className="divide-y divide-gray-200/70">
                    {aiSpendingData.budgetRecommendations.map((item, index) => (
                        <div
                            key={`${item.category}-${index}`}
                            className="p-5 sm:p-6"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {item.category}
                                    </h3>

                                    <p className="text-sm text-gray-600 mt-1">
                                        {item.message}
                                    </p>
                                </div>

                                <div className="sm:text-right">
                                    <p className="text-sm text-gray-500">
                                        Suggested monthly budget
                                    </p>

                                    <p className="font-bold text-gray-900 mt-1">
                                        {formatCurrency(item.recommendedBudget)}
                                    </p>
                                </div>
                            </div>

                            <p className="mt-4 text-sm text-gray-600">
                                Current spending:{' '}
                                <span className="font-medium text-gray-900">
                                    {formatCurrency(item.currentSpending)}
                                </span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SavingRecommendations;