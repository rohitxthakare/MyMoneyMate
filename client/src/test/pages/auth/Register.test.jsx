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
import Register from "../../../pages/auth/Register.jsx";

describe("Register page", () => {
    const mockRegister = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        useAuth.mockReturnValue({
            register: mockRegister,
        });
    });

    const renderRegister = () =>
        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

    test("renders the registration form", () => {
        renderRegister();

        expect(
            screen.getByRole("heading", { name: "Create Account" })
        ).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText("Enter your full name")
        ).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText("Enter your email")
        ).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText("Enter your password")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "Create Account" })
        ).toBeInTheDocument();

        expect(screen.getByRole("link", { name: "Log in" }))
            .toHaveAttribute("href", "/login");
    });

    test("requires all fields and sets a minimum password length", async () => {
        const user = userEvent.setup();
        renderRegister();

        const nameInput = screen.getByPlaceholderText(
            "Enter your full name"
        );
        const emailInput = screen.getByPlaceholderText(
            "Enter your email"
        );
        const passwordInput = screen.getByPlaceholderText(
            "Enter your password"
        );

        expect(nameInput).toBeRequired();
        expect(emailInput).toBeRequired();
        expect(passwordInput).toBeRequired();
        expect(passwordInput).toHaveAttribute("minLength", "6");

        // An empty form should not be submitted.
        await user.click(
            screen.getByRole("button", { name: "Create Account" })
        );

        expect(mockRegister).not.toHaveBeenCalled();
    });

    test("submits the entered details and navigates to the dashboard", async () => {
        const user = userEvent.setup();
        mockRegister.mockResolvedValue({ id: 1, name: "Test User" });

        renderRegister();

        await user.type(
            screen.getByPlaceholderText("Enter your full name"),
            "Test User"
        );
        await user.type(
            screen.getByPlaceholderText("Enter your email"),
            "test@example.com"
        );
        await user.type(
            screen.getByPlaceholderText("Enter your password"),
            "pass123"
        );

        await user.click(
            screen.getByRole("button", { name: "Create Account" })
        );

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith(
                "Test User",
                "test@example.com",
                "pass123"
            );
            expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
        });
    });

    test("displays the server error when registration fails", async () => {
        const user = userEvent.setup();

        mockRegister.mockRejectedValue({
            response: {
                data: {
                    message: "Email already exists",
                },
            },
        });

        renderRegister();

        await user.type(
            screen.getByPlaceholderText("Enter your full name"),
            "Test User"
        );
        await user.type(
            screen.getByPlaceholderText("Enter your email"),
            "test@example.com"
        );
        await user.type(
            screen.getByPlaceholderText("Enter your password"),
            "pass123"
        );

        await user.click(
            screen.getByRole("button", { name: "Create Account" })
        );

        expect(
            await screen.findByText("Email already exists")
        ).toBeInTheDocument();

        expect(mockNavigate).not.toHaveBeenCalled();
    });

    test("shows a fallback message when the server provides no error message", async () => {
        const user = userEvent.setup();
        mockRegister.mockRejectedValue(new Error("Network error"));

        renderRegister();

        await user.type(
            screen.getByPlaceholderText("Enter your full name"),
            "Test User"
        );
        await user.type(
            screen.getByPlaceholderText("Enter your email"),
            "test@example.com"
        );
        await user.type(
            screen.getByPlaceholderText("Enter your password"),
            "pass123"
        );

        await user.click(
            screen.getByRole("button", { name: "Create Account" })
        );

        expect(
            await screen.findByText("Registration failed")
        ).toBeInTheDocument();
    });

    test("shows a waiting message and disables the button while submitting", async () => {
        const user = userEvent.setup();

        let resolveRegistration;

        mockRegister.mockReturnValue(
            new Promise((resolve) => {
                resolveRegistration = resolve;
            })
        );

        renderRegister();

        await user.type(
            screen.getByPlaceholderText("Enter your full name"),
            "Test User"
        );
        await user.type(
            screen.getByPlaceholderText("Enter your email"),
            "test@example.com"
        );
        await user.type(
            screen.getByPlaceholderText("Enter your password"),
            "pass123"
        );

        await user.click(
            screen.getByRole("button", { name: "Create Account" })
        );

        expect(
            await screen.findByText(/Please wait while we create your account/)
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "Creating account..." })
        ).toBeDisabled();

        resolveRegistration({ id: 1, name: "Test User" });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
        });
    });
});
