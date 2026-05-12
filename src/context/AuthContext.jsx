import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Persist session on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await api.get("/auth/me");
                if (response.data.success) {
                    setUser(response.data.data);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await api.post("/auth/login", credentials);
            if (response.data.success) {
                const { user, accessToken } = response.data.data;
                setUser(user);
                setIsAuthenticated(true);
                localStorage.setItem("accessToken", accessToken);
                return { success: true, user };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Login failed",
                errors: error.response?.data?.errors || null,
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post("/auth/register", userData);
            if (response.data.success) {
                const { user, accessToken } = response.data.data;
                setUser(user);
                setIsAuthenticated(true);
                localStorage.setItem("accessToken", accessToken);
                return { success: true, user };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Registration failed",
                errors: error.response?.data?.errors || null,
            };
        }
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("accessToken");
        }
    };

    const value = {
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
