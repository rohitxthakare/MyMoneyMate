import { FiSun, FiCheckCircle } from 'react-icons/fi';
import { formatCurrency } from '../../utils/formatCurrency.js';

const SpendingAnalysis = ({ aiSpendingData }) => {
    return (
        <div className='space-y-8'>
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-200/50">
                <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-6">
                    <FiSun className="w-5 h-5 text-amber-500" />
                    Saving Suggestions
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiSpendingData.savingSuggestions.map((item, index) => (
                        <div
                            key={`${item.title}-${index}`}
                            className="rounded-xl border border-gray-200 p-5 bg-gray-50/70"
                        >
                            <h3 className="font-semibold text-gray-900">
                                {item.title}
                            </h3>

                            <p className="text-sm text-gray-600 mt-2">
                                {item.description}
                            </p>

                            <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between gap-2">
                                <span className="text-sm text-gray-600">
                                    Estimated saving
                                </span>

                                <span className="font-semibold text-green-700">
                                    {formatCurrency(item.estimatedSaving)}/mo
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-200/50">
                <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-6">
                    <FiCheckCircle className="w-5 h-5 text-green-600" />
                    Savings Opportunities
                </h2>

                <div className="space-y-3">
                    {aiSpendingData.savingsOpportunities.map((item, index) => (
                        <div
                            key={`${item.title}-${index}`}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-gray-200 p-5"
                        >
                            <div>
                                <h3 className="font-semibold text-gray-900">
                                    {item.title}
                                </h3>

                                <p className="text-sm text-gray-600 mt-1">
                                    {item.description}
                                </p>
                            </div>

                            <div className="sm:text-right shrink-0">
                                <p className="text-sm text-gray-600">
                                    Estimated savings
                                </p>

                                <p className="font-semibold text-green-700 mt-1">
                                    {formatCurrency(item.estimatedSaving)}/mo
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SpendingAnalysis;