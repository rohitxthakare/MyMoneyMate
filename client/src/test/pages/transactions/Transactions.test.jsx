import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../../context/TransactionContext.jsx", () => ({
  useTransactions: jest.fn(),
}));

jest.mock("../../../context/AuthContext.jsx", () => ({
  useAuth: jest.fn(),
}));

import { useTransactions } from "../../../context/TransactionContext.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import Transactions from "../../../pages/transactions/Transactions.jsx";

describe("Transactions page", () => {
  const mockFetchTransactions = jest.fn();
  const mockAddTransaction = jest.fn();
  const mockEditTransaction = jest.fn();
  const mockRemoveTransaction = jest.fn();

  const transactions = [
    {
      _id: "1",
      type: "expense",
      category: "Food",
      amount: 500,
      description: "Lunch",
      date: "2026-10-20",
      paymentMethod: "UPI",
    },
    {
      _id: "2",
      type: "income",
      category: "Salary",
      amount: 30000,
      description: "Monthly salary",
      date: "2026-10-19",
      paymentMethod: "Bank Transfer",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    useAuth.mockReturnValue({
      user: { name: "Test User" },
      logout: jest.fn(),
    });

    useTransactions.mockReturnValue({
      transactions,
      loading: false,
      fetchTransactions: mockFetchTransactions,
      addTransaction: mockAddTransaction,
      editTransaction: mockEditTransaction,
      removeTransaction: mockRemoveTransaction,
    });
  });

  const renderTransactions = () =>
    render(
      <MemoryRouter>
        <Transactions />
      </MemoryRouter>
    );

  test("displays transactions and fetches them on mount", () => {
    renderTransactions();

    expect(
      screen.getByRole("heading", { name: "Transactions" })
    ).toBeInTheDocument();

    expect(screen.getByText("Lunch")).toBeInTheDocument();
    expect(screen.getByText("Monthly salary")).toBeInTheDocument();
    expect(mockFetchTransactions).toHaveBeenCalledTimes(1);
  });

  test("shows a loading message", () => {
    useTransactions.mockReturnValue({
      transactions: [],
      loading: true,
      fetchTransactions: mockFetchTransactions,
      addTransaction: mockAddTransaction,
      editTransaction: mockEditTransaction,
      removeTransaction: mockRemoveTransaction,
    });

    renderTransactions();

    expect(
      screen.getByText("Loading transactions...")
    ).toBeInTheDocument();
  });

  test("shows a message when there are no transactions", () => {
    useTransactions.mockReturnValue({
      transactions: [],
      loading: false,
      fetchTransactions: mockFetchTransactions,
      addTransaction: mockAddTransaction,
      editTransaction: mockEditTransaction,
      removeTransaction: mockRemoveTransaction,
    });

    renderTransactions();

    expect(screen.getByText("No transactions yet.")).toBeInTheDocument();
  });

  test("filters transactions by search and type", async () => {
    const user = userEvent.setup();

    renderTransactions();

    const searchInput = screen.getByPlaceholderText(
      "Search transactions..."
    );

    await user.type(searchInput, "salary");

    expect(screen.getByText("Monthly salary")).toBeInTheDocument();
    expect(screen.queryByText("Lunch")).not.toBeInTheDocument();

    await user.clear(searchInput);

    // The first dropdown is Transaction Type.
    const typeDropdown = screen.getAllByRole("combobox")[2];

    await user.selectOptions(typeDropdown, "expense");

    expect(screen.getByText("Lunch")).toBeInTheDocument();
    expect(screen.queryByText("Monthly salary")).not.toBeInTheDocument();
  });

  test("adds a transaction", async () => {
    const user = userEvent.setup();

    mockAddTransaction.mockResolvedValue({});

    const { container } = renderTransactions();

    await user.type(screen.getByPlaceholderText("0.00"), "850");
    await user.type(container.querySelector("input[name='date']"), "2026-10-20");

    await user.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => {
      expect(mockAddTransaction).toHaveBeenCalledTimes(1);
    });

    expect(mockAddTransaction.mock.calls[0][0].amount).toBe(850);
    expect(mockAddTransaction.mock.calls[0][0].type).toBe("expense");
    expect(mockAddTransaction.mock.calls[0][0].date).toBe("2026-10-20");
  });

  test("opens the edit form and updates a transaction", async () => {
    const user = userEvent.setup();

    mockEditTransaction.mockResolvedValue({});

    renderTransactions();

    // Each transaction has two buttons: Edit, then Delete.
    // The first two buttons belong to the first transaction.
    const buttons = screen.getAllByRole("button");

    await user.click(buttons[buttons.length - 4]);

    expect(
      screen.getByRole("heading", { name: "Edit Transaction" })
    ).toBeInTheDocument();

    const amountInput = screen.getByPlaceholderText("0.00");

    await user.clear(amountInput);
    await user.type(amountInput, "650");

    await user.click(screen.getByRole("button", { name: "Update" }));

    await waitFor(() => {
      expect(mockEditTransaction).toHaveBeenCalledTimes(1);
    });

    expect(mockEditTransaction.mock.calls[0][0]).toBe("1");
    expect(mockEditTransaction.mock.calls[0][1].amount).toBe(650);
  });

  test("deletes a transaction", async () => {
    const user = userEvent.setup();

    mockRemoveTransaction.mockResolvedValue({});

    renderTransactions();

    const buttons = screen.getAllByRole("button");

    // The second button in the first transaction row is Delete.
    await user.click(buttons[buttons.length - 3]);

    await waitFor(() => {
      expect(mockRemoveTransaction).toHaveBeenCalledWith("1");
    });
  });
});