import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../../context/TransactionContext.jsx", () => ({
    useTransactions: jest.fn(),
}));

jest.mock("../../../context/AuthContext.jsx", () => ({
    useAuth: jest.fn(),
}));

import { useTransactions } from "../../../context/TransactionContext.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import Dashboard from "../../../pages/dashboard/Dashboard.jsx";

describe("Dashboard page", () => {
    const mockFetchSummary = jest.fn();
    const mockFetchTransactions = jest.fn();

    const summary = {
        totalIncome: 50000,
        totalExpense: 15000,
        netBalance: 35000,
        categoryBreakdown: [],
    };

    const transactions = [
        { _id: "1", category: "Food", amount: 500, type: "expense", date: "2026-10-20" },
        { _id: "2", category: "Salary", amount: 30000, type: "income", date: "2026-10-19" },
        { _id: "3", category: "Transport", amount: 200, type: "expense", date: "2026-10-18" },
        { _id: "4", category: "Shopping", amount: 1000, type: "expense", date: "2026-10-17" },
        { _id: "5", category: "Bills", amount: 800, type: "expense", date: "2026-10-16" },
        { _id: "6", category: "Entertainment", amount: 400, type: "expense", date: "2026-10-15" },
    ];

    beforeEach(() => {
        jest.clearAllMocks();

        useAuth.mockReturnValue({
            user: { name: "Test User" },
            logout: jest.fn(),
        });

        useTransactions.mockReturnValue({
            summary,
            transactions,
            fetchSummary: mockFetchSummary,
            fetchTransactions: mockFetchTransactions,
        });
    });

    const renderDashboard = () =>
        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

    test("shows loading while the summary is not available", () => {
        useTransactions.mockReturnValue({
            summary: null,
            transactions: [],
            fetchSummary: mockFetchSummary,
            fetchTransactions: mockFetchTransactions,
        });

        renderDashboard();

        expect(screen.getByText("Loading dashboard...")).toBeInTheDocument();
    });

    test("fetches the summary and transactions when mounted", async () => {
        renderDashboard();

        await waitFor(() => {
            expect(mockFetchSummary).toHaveBeenCalledTimes(1);
            expect(mockFetchTransactions).toHaveBeenCalledTimes(1);
        });
    });

    test("displays summary totals and recent transactions", () => {
        renderDashboard();

        expect(
            screen.getByRole("heading", { name: "Dashboard" })
        ).toBeInTheDocument();

        expect(screen.getByText("Total Income")).toBeInTheDocument();
        expect(screen.getByText("Total Expense")).toBeInTheDocument();
        expect(screen.getByText("Net Balance")).toBeInTheDocument();

        expect(screen.getByText("₹50,000.00")).toBeInTheDocument();
        expect(screen.getByText("₹15,000.00")).toBeInTheDocument();
        expect(screen.getByText("₹35,000.00")).toBeInTheDocument();

        expect(
            screen.getByRole("heading", { name: "Recent Transactions" })
        ).toBeInTheDocument();

        expect(screen.getByText("Food")).toBeInTheDocument();
        expect(screen.getByText("Bills")).toBeInTheDocument();

        // The dashboard displays only the first five transactions.
        expect(screen.queryByText("Entertainment")).not.toBeInTheDocument();
    });

    test("renders the category chart when spending data is available", () => {
        useTransactions.mockReturnValue({
            summary: {
                ...summary,
                categoryBreakdown: [
                    { category: "Food", total: 5000 },
                    { category: "Transport", total: 2000 },
                ],
            },
            transactions,
            fetchSummary: mockFetchSummary,
            fetchTransactions: mockFetchTransactions,
        });

        renderDashboard();

        expect(
            screen.getByRole("heading", { name: "Spending by Category" })
        ).toBeInTheDocument();

        expect(screen.getByText("Food")).toBeInTheDocument();
        expect(screen.getByText("Transport")).toBeInTheDocument();
    });

    test("shows a message when there are no expenses to display", () => {
        useTransactions.mockReturnValue({
            summary,
            transactions: [],
            fetchSummary: mockFetchSummary,
            fetchTransactions: mockFetchTransactions,
        });

        renderDashboard();

        expect(screen.getByText("No expenses yet.")).toBeInTheDocument();
        expect(screen.getByText("No transactions yet.")).toBeInTheDocument();
    });
});