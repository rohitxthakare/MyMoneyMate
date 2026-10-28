import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RecentTransactions from "../../../pages/dashboard/RecentTransactions.jsx";

describe("RecentTransactions component", () => {
  test("shows a message when there are no transactions", () => {
    render(
      <MemoryRouter>
        <RecentTransactions transactions={[]} />
      </MemoryRouter>
    );

    expect(screen.getByText("No transactions yet.")).toBeInTheDocument();
  });

  test("displays transactions with formatted amounts and a View All link", () => {
    const transactions = [
      {
        _id: "1",
        category: "Food",
        amount: 500,
        type: "expense",
        date: "2026-10-20",
      },
      {
        _id: "2",
        category: "Salary",
        amount: 30000,
        type: "income",
        date: "2026-10-19",
      },
    ];

    render(
      <MemoryRouter>
        <RecentTransactions transactions={transactions} />
      </MemoryRouter>
    );

    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("Salary")).toBeInTheDocument();

    expect(screen.getByText("-₹500.00")).toBeInTheDocument();
    expect(screen.getByText("+₹30,000.00")).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "View All" })
    ).toHaveAttribute("href", "/transactions");
  });
});