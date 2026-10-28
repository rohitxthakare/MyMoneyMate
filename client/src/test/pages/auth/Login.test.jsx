import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();

jest.mock("../../../context/AuthContext.jsx", () => ({
  useAuth: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

import { useAuth } from "../../../context/AuthContext.jsx";
import Login from "../../../pages/auth/Login.jsx";

describe("Login page", () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useAuth.mockReturnValue({
      login: mockLogin,
    });
  });

  const renderLogin = () =>
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

  test("renders the login form", () => {
    renderLogin();

    expect(
      screen.getByRole("heading", { name: "Welcome Back" })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter your email")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter your password")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Log In" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "Register" })
    ).toHaveAttribute("href", "/register");
  });

  test("requires both email and password", async () => {
    const user = userEvent.setup();
    renderLogin();

    const emailInput = screen.getByPlaceholderText(
      "Enter your email"
    );
    const passwordInput = screen.getByPlaceholderText(
      "Enter your password"
    );

    expect(emailInput).toBeRequired();
    expect(emailInput).toHaveAttribute("type", "email");
    expect(passwordInput).toBeRequired();
    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(
      screen.getByRole("button", { name: "Log In" })
    );

    expect(mockLogin).not.toHaveBeenCalled();
  });

  test("submits the credentials and navigates to the dashboard", async () => {
    const user = userEvent.setup();

    mockLogin.mockResolvedValue({
      id: 1,
      email: "test@example.com",
    });

    renderLogin();

    await user.type(
      screen.getByPlaceholderText("Enter your email"),
      "test@example.com"
    );

    await user.type(
      screen.getByPlaceholderText("Enter your password"),
      "pass123"
    );

    await user.click(
      screen.getByRole("button", { name: "Log In" })
    );

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        "test@example.com",
        "pass123"
      );

      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("displays the server error when login fails", async () => {
    const user = userEvent.setup();

    mockLogin.mockRejectedValue({
      response: {
        data: {
          message: "Invalid email or password",
        },
      },
    });

    renderLogin();

    await user.type(
      screen.getByPlaceholderText("Enter your email"),
      "test@example.com"
    );

    await user.type(
      screen.getByPlaceholderText("Enter your password"),
      "fail123"
    );

    await user.click(
      screen.getByRole("button", { name: "Log In" })
    );

    expect(
      await screen.findByText("Invalid email or password")
    ).toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("shows a fallback message when the server provides no error message", async () => {
    const user = userEvent.setup();

    mockLogin.mockRejectedValue(new Error("Network error"));

    renderLogin();

    await user.type(
      screen.getByPlaceholderText("Enter your email"),
      "test@example.com"
    );

    await user.type(
      screen.getByPlaceholderText("Enter your password"),
      "pass123"
    );

    await user.click(
      screen.getByRole("button", { name: "Log In" })
    );

    expect(
      await screen.findByText("Login failed")
    ).toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("shows a waiting message and disables the button while logging in", async () => {
    const user = userEvent.setup();

    let resolveLogin;

    mockLogin.mockReturnValue(
      new Promise((resolve) => {
        resolveLogin = resolve;
      })
    );

    renderLogin();

    await user.type(
      screen.getByPlaceholderText("Enter your email"),
      "test@example.com"
    );

    await user.type(
      screen.getByPlaceholderText("Enter your password"),
      "pass123"
    );

    await user.click(
      screen.getByRole("button", { name: "Log In" })
    );

    expect(
      await screen.findByText(/Please wait while we log you in/)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Logging in..." })
    ).toBeDisabled();

    resolveLogin({
      id: 1,
      email: "test@example.com",
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });
});
