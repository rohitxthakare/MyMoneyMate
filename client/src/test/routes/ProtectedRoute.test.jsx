import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../../routes/ProtectedRoute.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

jest.mock("../../context/AuthContext.jsx", () => ({
    useAuth: jest.fn(),
}));

describe("ProtectedRoute", () => {
    test("shows loading while authentication is being checked", () => {
        useAuth.mockReturnValue({
            user: null,
            loading: true,
        });

        render(
            <MemoryRouter initialEntries={["/dashboard"]}>
                <ProtectedRoute>
                    <p>Dashboard Content</p>
                </ProtectedRoute>
            </MemoryRouter>
        );

        expect(screen.getByText("Loading...")).toBeInTheDocument();
        expect(screen.queryByText("Dashboard Content")).not.toBeInTheDocument();
    });

    test("renders children when the user is authenticated", () => {
        useAuth.mockReturnValue({
            user: { _id: "1", name: "Test User" },
            loading: false,
        });

        render(
            <MemoryRouter>
                <ProtectedRoute>
                    <p>Dashboard Content</p>
                </ProtectedRoute>
            </MemoryRouter>
        );

        expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
    });

    test("redirects to login when the user is not authenticated", () => {
        useAuth.mockReturnValue({
            user: null,
            loading: false,
        });

        render(
            <MemoryRouter initialEntries={["/dashboard"]}>
                <Routes>
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <p>Dashboard Content</p>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<p>Login Page</p>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText("Login Page")).toBeInTheDocument();
        expect(screen.queryByText("Dashboard Content")).not.toBeInTheDocument();
    });
});
