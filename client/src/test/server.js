
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

export const server = setupServer(
    // Auth Context
    http.get("*/auth/me", () => {
        return HttpResponse.json({
            user: { _id: "1", name: "Test User", email: "test@example.com" },
        });
    }),

    http.post("*/auth/register", async ({ request }) => {
        const body = await request.json();

        return HttpResponse.json({
            user: {
                _id: "1",
                name: body.name,
                email: body.email,
            },
        });
    }),

    http.post("*/auth/login", async ({ request }) => {
        const body = await request.json();

        return HttpResponse.json({
            user: {
                _id: "1",
                name: "Test User",
                email: body.email,
            },
        });
    }),

    http.post("*/auth/logout", () => {
        return HttpResponse.json({ message: "Logged out successfully" });
    }),

    // Transaction Context
    http.get("*/transactions", () => {
        return HttpResponse.json({
            transactions: [
                {
                    _id: "1",
                    type: "expense",
                    category: "Food",
                    amount: 500,
                    description: "Lunch",
                    date: "2026-10-20",
                    paymentMethod: "UPI",
                },
            ],
        });
    }),

    http.get("*/dashboard/summary", () => {
        return HttpResponse.json({
            summary: {
                totalIncome: 30000,
                totalExpense: 500,
                netBalance: 29500,
                categoryBreakdown: [{ category: "Food", total: 500 }],
            },
        });
    }),

    http.post("*/transactions", async ({ request }) => {
        const body = await request.json();

        return HttpResponse.json({
            transaction: { _id: "2", ...body },
        });
    }),

    http.put("*/transactions/:id", async ({ params, request }) => {
        const body = await request.json();

        return HttpResponse.json({
            transaction: { _id: params.id, ...body },
        });
    }),

    http.delete("*/transactions/:id", () => {
        return HttpResponse.json({ message: "Transaction deleted" });
    }),

    // Assistant
    http.post("*/assistant", () => {
        return HttpResponse.json({
            aiSpendingData: {
                summary: {
                    savingRate: 77,
                    expenseRatio: 23,
                    topCategory: "Food",
                },
                spendingAnalysis: [
                    {
                        category: "Food",
                        amount: 5000,
                        message: "Reduce unnecessary food expenses.",
                    },
                ],
                spendingSummary: "Food is your highest spending category.",
                budgetRecommendations: [
                    {
                        category: "Food",
                        message: "Set a monthly food budget.",
                        recommendedBudget: 4000,
                        currentSpending: 5000,
                    },
                ],
                savingSuggestions: [
                    {
                        title: "Cook at home",
                        description: "Reduce eating out.",
                        estimatedSaving: 1000,
                    },
                ],
                savingsOpportunities: [
                    {
                        title: "Reduce transport costs",
                        description: "Plan trips efficiently.",
                        estimatedSaving: 500,
                    },
                ],
            },
            limit: 5,
        });
    })
);
