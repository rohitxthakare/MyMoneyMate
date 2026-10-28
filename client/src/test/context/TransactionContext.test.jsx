import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  TransactionProvider,
  useTransactions,
} from "../../context/TransactionContext.jsx";

const TestComponent = () => {
  const {
    transactions,
    summary,
    loading,
    fetchTransactions,
    fetchSummary,
    addTransaction,
    editTransaction,
    removeTransaction,
  } = useTransactions();

  const transaction = {
    type: "expense",
    category: "Food",
    amount: 850,
    description: "Dinner",
    date: "2026-10-21",
    paymentMethod: "UPI",
  };

  return (
    <div>
      <p>Loading: {String(loading)}</p>
      <p>Transaction count: {transactions.length}</p>
      <p>First transaction: {transactions[0]?.description || "None"}</p>
      <p>Summary: {summary ? "Loaded" : "Not loaded"}</p>

      <button onClick={() => fetchTransactions()}>Fetch Transactions</button>
      <button onClick={fetchSummary}>Fetch Summary</button>
      <button onClick={() => addTransaction(transaction)}>Add</button>
      <button
        onClick={() =>
          editTransaction("1", {
            ...transaction,
            _id: "1",
            description: "Updated lunch",
          })
        }
      >
        Edit
      </button>
      <button onClick={() => removeTransaction("1")}>Remove</button>
    </div>
  );
};

const renderTransactions = () =>
  render(
    <TransactionProvider>
      <TestComponent />
    </TransactionProvider>
  );

describe("TransactionContext", () => {
  test("fetches transactions and updates loading state", async () => {
    const user = userEvent.setup();
    renderTransactions();

    await user.click(screen.getByRole("button", { name: "Fetch Transactions" }));

    expect(await screen.findByText("Transaction count: 1")).toBeInTheDocument();
    expect(screen.getByText("First transaction: Lunch")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Loading: false")).toBeInTheDocument();
    });
  });

  test("fetches the dashboard summary", async () => {
    const user = userEvent.setup();
    renderTransactions();

    await user.click(screen.getByRole("button", { name: "Fetch Summary" }));

    expect(await screen.findByText("Summary: Loaded")).toBeInTheDocument();
  });

  test("adds a transaction and refreshes the summary", async () => {
    const user = userEvent.setup();
    renderTransactions();

    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(
      await screen.findByText("First transaction: Dinner")
    ).toBeInTheDocument();

    expect(await screen.findByText("Summary: Loaded")).toBeInTheDocument();
  });

  test("edits a transaction and refreshes the summary", async () => {
    const user = userEvent.setup();
    renderTransactions();

    await user.click(screen.getByRole("button", { name: "Fetch Transactions" }));
    await screen.findByText("First transaction: Lunch");

    await user.click(screen.getByRole("button", { name: "Edit" }));

    expect(
      await screen.findByText("First transaction: Updated lunch")
    ).toBeInTheDocument();

    expect(await screen.findByText("Summary: Loaded")).toBeInTheDocument();
  });

  test("removes a transaction and refreshes the summary", async () => {
    const user = userEvent.setup();
    renderTransactions();

    await user.click(screen.getByRole("button", { name: "Fetch Transactions" }));
    await screen.findByText("First transaction: Lunch");

    await user.click(screen.getByRole("button", { name: "Remove" }));

    expect(
      await screen.findByText("Transaction count: 0")
    ).toBeInTheDocument();

    expect(await screen.findByText("Summary: Loaded")).toBeInTheDocument();
  });
});