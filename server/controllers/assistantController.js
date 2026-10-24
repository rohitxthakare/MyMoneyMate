import Groq from 'groq-sdk';
import AiLimit from '../models/AiLimit.js';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const LIMIT = 5;

export const getAISpendingSummary = async (req, res, next) => {
    try {
        const { user, transactions, summary } = req.body;

        // Validate
        if (!user || !Array.isArray(transactions) || !summary) {
            res.status(400);
            throw new Error('User, transactions, and summary are required.');
        }

        const date = new Date().toLocaleDateString();

        let aiLimit = await AiLimit.findOne({ date });

        if (!aiLimit) {
            aiLimit = await AiLimit.create({ date, limit: 0 });
        }

        if (aiLimit.limit >= LIMIT) {
            res.status(429);
            throw new Error('AI limit over. Your limit resets the next day.');
        }

        aiLimit.limit += 1;
        await aiLimit.save();

        const completion = await groq.chat.completions.create({
            model: 'openai/gpt-oss-120b',
            temperature: 0.4,
            response_format: { type: 'json_object' },
            messages: [
                {
                    role: 'system',
                    content: `You are a personal finance assistant.

                            Analyze the user's overall financial summary and recent transactions.

                            The supplied summary contains overall dashboard data for all transactions.
                            Its savingRate, expenseRatio, and topCategory fields are already calculated
                            from the recent 60 transactions. Copy these values exactly into the response
                            summary without recalculating them.

                            Analyze the recent transactions to identify spending patterns and suggest
                            practical ways to save money.

                            Do not invent financial figures or transactions.
                            Use numeric amounts without currency symbols.
                            If the data is insufficient, provide cautious recommendations.

                            Return valid JSON using this structure:
                            {
                                "summary": {
                                    "savingRate": 0,
                                    "expenseRatio": 0,
                                    "topCategory": "Category"
                                },
                                "spendingAnalysis": [
                                    {
                                        "category": "Category",
                                        "amount": 0,
                                        "message": "Short explanation"
                                    }
                                ],
                                "spendingSummary": "Personalized spending overview",
                                "savingSuggestions": [
                                    {
                                        "title": "Suggestion",
                                        "description": "Practical advice",
                                        "estimatedSaving": 0
                                    }
                                ],
                                "budgetRecommendations": [
                                    {
                                        "category": "Category",
                                        "recommendedBudget": 0,
                                        "currentSpending": 0,
                                        "message": "Short recommendation"
                                    }
                                ],
                                "savingsOpportunities": [
                                    {
                                        "title": "Opportunity",
                                        "description": "Practical action",
                                        "estimatedSaving": 0
                                    }
                                ]
                            }

                            Always include every field and array in the response.
                            Use an empty array when there are no suitable items.
                            Return up to 5 spending categories, 4 saving suggestions,
                            5 budget recommendations, and 4 savings opportunities.`
                },
                {
                    role: 'user',
                    content: JSON.stringify({
                        user: { name: user.name },
                        summary,
                        transactions,
                    }),
                },
            ],
        });

        const content = completion.choices[0]?.message?.content;

        if (!content) {
            throw new Error('No response from AI.');
        }

        // Parse JSON response into an object
        const aiSpendingData = JSON.parse(content);

        res.status(200).json({
            success: true,
            aiSpendingData,
            date,
            limit: LIMIT - aiLimit.limit,
        });
    } catch (error) {
        next(error);
    }
};