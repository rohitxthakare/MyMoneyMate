import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TransactionForm from "../../../pages/transactions/TransactionForm.jsx";
import { CATEGORIES } from "../../../utils/categories.js";

describe("TransactionForm", () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnSubmit.mockResolvedValue({});
  });

  const renderForm = (props = {}) => {
    return render(
      <TransactionForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        {...props}
      />
    );
  };

  test("shows the form with default values", () => {
    renderForm();

    expect(
      screen.getByRole("heading", { name: "Add New Transaction" })
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Expense")).toBeChecked();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("0.00")).toHaveValue(null);
  });

  test("changes category when transaction type changes", async () => {
    const user = userEvent.setup();

    renderForm();

    await user.click(screen.getByLabelText("Income"));

    const categoryDropdown = screen.getAllByRole("combobox")[0];

    expect(categoryDropdown).toHaveValue(CATEGORIES.income[0]);
  });

  test("shows an error when submission fails", async () => {
    const user = userEvent.setup();

    mockOnSubmit.mockRejectedValue({
      response: {
        data: { message: "Unable to save transaction" },
      },
    });

    const { container } = renderForm();

    await user.type(screen.getByPlaceholderText("0.00"), "500");
    await user.type(
      container.querySelector('input[type="date"]'),
      "2026-10-20"
    );

    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(
      await screen.findByText("Unable to save transaction")
    ).toBeInTheDocument();
  });

  test("shows existing values when editing a transaction", () => {
    const { container } = renderForm({
      initial: {
        _id: "1",
        type: "expense",
        category: "Food",
        amount: 500,
        description: "Lunch",
        date: "2026-10-20T00:00:00.000Z",
        paymentMethod: "UPI",
      },
    });

    expect(
      screen.getByRole("heading", { name: "Edit Transaction" })
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("0.00")).toHaveValue(500);
    expect(container.querySelector('input[type="date"]')).toHaveValue(
      "2026-10-20"
    );
  });

  test("calls onCancel when Cancel is clicked", async () => {
    const user = userEvent.setup();

    renderForm();

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});