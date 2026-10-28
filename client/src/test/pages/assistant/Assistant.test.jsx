import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from 'react-router-dom';

import Assistant from "../../../pages/assistant/Assistant.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useTransactions } from "../../../context/TransactionContext.jsx";

jest.mock("../../../context/AuthContext.jsx", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../../context/TransactionContext.jsx", () => ({
  useTransactions: jest.fn(),
}));

describe("Assistant", () => {
  const mockFetchSummary = jest.fn();
  const mockFetchTransactions = jest.fn();

  const mockTransactions = [
    {
      type: "income",
      category: "Salary",
      amount: 30000,
      description: "Monthly salary",
      date: "2026-10-20",
      paymentMethod: "Bank Transfer",
    },
    {
      type: "expense",
      category: "Food",
      amount: 5000,
      description: "Groceries",
      date: "2026-10-21",
      paymentMethod: "UPI",
    },
    {
      type: "expense",
      category: "Transport",
      amount: 2000,
      description: "Fuel",
      date: "2026-10-22",
      paymentMethod: "Cash",
    },
  ];

  const renderAssistant = (transactions = mockTransactions) => {
    useAuth.mockReturnValue({
      user: { name: "Test User" },
    });

    useTransactions.mockReturnValue({
      summary: {
        totalIncome: 50000,
        totalExpense: 15000,
        netBalance: 35000,
        categoryBreakdown: [],
      },
      transactions,
      fetchSummary: mockFetchSummary,
      fetchTransactions: mockFetchTransactions,
      loading: false,
    });

    return render(
      <MemoryRouter>
        <Assistant />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows the loading message when summary is unavailable", () => {
    useAuth.mockReturnValue({ user: { name: "Test User" } });

    useTransactions.mockReturnValue({
      summary: null,
      transactions: [],
      fetchSummary: mockFetchSummary,
      fetchTransactions: mockFetchTransactions,
      loading: true,
    });

    render(
      <MemoryRouter>
        <Assistant />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading Assistant...")).toBeInTheDocument();
  });

  test("shows the initial assistant message", () => {
    renderAssistant();

    expect(
      screen.getByRole("heading", { name: "AI Assistant" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Ready to review your finances?",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Get AI Spending Summary" })
    ).toBeEnabled();
  });

  test("disables the summary button when there are no transactions", () => {
    renderAssistant([]);

    expect(
      screen.getByRole("button", { name: "Get AI Spending Summary" })
    ).toBeDisabled();
  });

  test("requests and displays the AI spending summary", async () => {
    const user = userEvent.setup();

    renderAssistant();

    await user.click(
      screen.getByRole("button", { name: "Get AI Spending Summary" })
    );

    expect(
      await screen.findByText("AI limit: 5")
    ).toBeInTheDocument();

    expect(screen.getByText("Saving Rate")).toBeInTheDocument();
    expect(screen.getByText("77%")).toBeInTheDocument();
    expect(screen.getByText("Expense Ratio")).toBeInTheDocument();
    expect(screen.getByText("23%")).toBeInTheDocument();
    expect(screen.getByText("Top Spending Category")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Smart Budget Recommendations" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Saving Suggestions" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Savings Opportunities" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Update" })
    ).toBeInTheDocument();
  });
});