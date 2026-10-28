import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "../../context/AuthContext.jsx";

const TestComponent = () => {
  const { user, loading, register, login, logout } = useAuth();

  return (
    <div>
      <p>Loading: {String(loading)}</p>
      <p>User: {user?.name || "No user"}</p>

      <button onClick={() => register("New User", "new@example.com", "pass123")}>
        Register
      </button>

      <button onClick={() => login("login@example.com", "pass123")}>
        Login
      </button>

      <button onClick={logout}>Logout</button>
    </div>
  );
};

const renderAuth = () =>
  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );

describe("AuthContext", () => {
  test("fetches the logged-in user on mount", async () => {
    renderAuth();

    await waitFor(() => {
      expect(screen.getByText("Loading: false")).toBeInTheDocument();
      expect(screen.getByText("User: Test User")).toBeInTheDocument();
    });
  });

  test("registers a user and updates the context", async () => {
    const user = userEvent.setup();
    renderAuth();

    await screen.findByText("Loading: false");

    await user.click(screen.getByRole("button", { name: "Register" }));

    expect(await screen.findByText("User: New User")).toBeInTheDocument();
  });

  test("logs in a user and updates the context", async () => {
    const user = userEvent.setup();
    renderAuth();

    await screen.findByText("Loading: false");

    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByText("User: Test User")).toBeInTheDocument();
  });

  test("logs out the user and clears the context", async () => {
    const user = userEvent.setup();
    renderAuth();

    await screen.findByText("Loading: false");

    await user.click(screen.getByRole("button", { name: "Logout" }));

    expect(await screen.findByText("User: No user")).toBeInTheDocument();
  });
});