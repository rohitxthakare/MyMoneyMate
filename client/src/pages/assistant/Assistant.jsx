import { useEffect, useState } from 'react';
import {
    FaLongArrowAltUp,
    FaLongArrowAltDown,
} from 'react-icons/fa';

import {
    FiBriefcase
} from 'react-icons/fi';

import { useAuth } from '../../context/AuthContext.jsx';
import { useTransactions } from '../../context/TransactionContext.jsx';
import api from '../../api/axios.js';

import Layout from '../../components/layout/Layout.jsx';
import SummaryCard from '../../components/cards/SummaryCard.jsx';
import SavingRecommendations from './SavingRecommendations.jsx';
import SpendingAnalysis from './SpendingAnalysis.jsx';

const Assistant = () => {
    const { user } = useAuth();

    const {
        summary,
        transactions,
        fetchSummary,
        fetchTransactions,
        loading: transactionsLoading,
    } = useTransactions();

    const [aiSpendingData, setAiSpendingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [limit, setLimit] = useState(null);

    useEffect(() => {
        fetchSummary();
        fetchTransactions();
    }, [fetchSummary, fetchTransactions]);

    const handleAISpendingSummary = async () => {
        setError('');
        setLoading(true);

        try {
            // Get the recent 60 transactions
            const recentTransactions = transactions
                .slice(0, 60)
                .map((t) => ({
                    type: t.type,
                    category: t.category,
                    amount: Number(t.amount),
                    description: t.description || '',
                    date: t.date,
                    paymentMethod: t.paymentMethod || 'other',
                }));

            let income = 0;
            let expenses = 0;

            for (const t of recentTransactions) {
                if (t.type === 'income') {
                    income += t.amount;
                } else if (t.type === 'expense') {
                    expenses += t.amount;
                }
            }

            const categoryBreakdown = {};

            for (const t of recentTransactions) {
                if (t.type === 'expense') {
                    categoryBreakdown[t.category] =
                        (categoryBreakdown[t.category] || 0) + t.amount;
                }
            }

            let topCategory = 'None';
            let max = 0;

            for (const category in categoryBreakdown) {
                if (categoryBreakdown[category] > max) {
                    max = categoryBreakdown[category];
                    topCategory = category;
                }
            }

            const recentSummary = {
                ...summary,
                savingRate: income > 0
                    ? Math.round(((income - expenses) / income) * 100)
                    : 0,
                expenseRatio: income > 0
                    ? Math.round((expenses / income) * 100)
                    : 0,
                topCategory,
            };

            const { data } = await api.post('/assistant', {
                user: {
                    name: user?.name || 'User',
                },
                transactions: recentTransactions,
                summary: recentSummary,
            });

            setAiSpendingData(data.aiSpendingData);
            setLimit(data.limit ?? null);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Failed to get ai spending summary.'
            );
        } finally {
            setLoading(false);
        }
    };

    if (!summary) {
        return (
            <Layout>
                <p className="p-6 text-gray-500 text-center">
                    Loading Assistant...
                </p>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        AI Assistant
                    </h1>

                    <p className="text-gray-600 mt-1">
                        Understand your spending and discover ways to save.
                    </p>

                    <button
                        type="button"
                        onClick={handleAISpendingSummary}
                        disabled={
                            loading ||
                            transactionsLoading ||
                            transactions.length === 0
                        }
                        className="flex items-center mt-8 px-6 py-3 cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                        {loading
                            ? 'Loading...'
                            : aiSpendingData
                                ? 'Update'
                                : 'Get AI Spending Summary'}
                    </button>

                    {limit !== null && (
                        <p className="text-sm text-gray-500 mt-2">
                            AI limit: {limit}
                        </p>
                    )}
                </div>

                {error && (
                    <p className="text-sm text-red-700 bg-red-50 rounded-lg p-3">
                        Date: {new Date().toLocaleDateString('en-IN')} {error}
                    </p>
                )}

                {!aiSpendingData && !loading && !error && (
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-200/50">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Ready to review your finances?
                        </h2>

                        <p className="text-gray-600 mt-2">
                            Get a personalized AI Spending Summary based on your recent transactions.
                            If you haven't added any transactions yet, create your first transaction to get started!
                        </p>
                    </div>
                )}

                {loading && (
                    <p className="p-6 text-gray-500 text-center">
                        Loading AI Spending Summary...
                    </p>
                )}

                {aiSpendingData && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <SummaryCard
                                label="Saving Rate"
                                value={`${aiSpendingData.summary.savingRate}%`}
                                icon={FaLongArrowAltUp}
                                iconColor="text-green-600"
                                iconBg="bg-green-100"
                            />

                            <SummaryCard
                                label="Expense Ratio"
                                value={`${aiSpendingData.summary.expenseRatio}%`}
                                icon={FaLongArrowAltDown}
                                iconColor="text-red-600"
                                iconBg="bg-red-100"
                            />

                            <SummaryCard
                                label="Top Spending Category"
                                value={aiSpendingData.summary.topCategory}
                                icon={FiBriefcase}
                                iconColor="text-blue-600"
                                iconBg="bg-blue-100"
                            />
                        </div>

                        <SavingRecommendations aiSpendingData={aiSpendingData} />

                        <SpendingAnalysis aiSpendingData={aiSpendingData} />
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Assistant;