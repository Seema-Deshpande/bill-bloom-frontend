import { createContext, useCallback, useMemo, useState } from "react";
import { users as seedUsers } from "../data/dummyData";

const AuthContext = createContext(null);

const TOKEN_KEY = "billBloomToken";
const USER_KEY = "billBloomUser";
const USERS_KEY = "billBloomUsers";
const DEFAULT_PASSWORD = "password123";

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

const sanitizeUser = (user) => {
    if (!user) {
        return null;
    }

    const { password: _password, ...safeUser } = user;
    return safeUser;
};

const getSeedAuthUsers = () =>
    seedUsers.map((user) => ({
        ...user,
        password: user.password?.startsWith("hashed_") ? DEFAULT_PASSWORD : user.password,
    }));

const readStoredUsers = () => {
    const rawUsers = localStorage.getItem(USERS_KEY);

    if (!rawUsers || rawUsers === "undefined" || rawUsers === "null") {
        const initialUsers = getSeedAuthUsers();
        localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
        return initialUsers;
    }

    try {
        return JSON.parse(rawUsers);
    } catch {
        const initialUsers = getSeedAuthUsers();
        localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
        return initialUsers;
    }
};

const persistSession = (nextToken, nextUser) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
};

const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem(USER_KEY);

        if (!storedUser || storedUser === "undefined" || storedUser === "null") {
            return null;
        }

        try {
            return JSON.parse(storedUser);
        } catch {
            localStorage.removeItem(USER_KEY);
            return null;
        }
    });
    const [token, setToken] = useState(() => {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        return storedToken && storedToken !== "undefined" && storedToken !== "null" ? storedToken : null;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadUser = useCallback(async (options = {}) => {
        const { initialize = false } = options;

        if (!initialize) {
            setLoading(true);
        }

        setError("");

        await delay(250);

        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (!storedToken || !storedUser || storedToken === "undefined" || storedUser === "undefined") {
            clearSession();
            setToken(null);
            setUser(null);
            setLoading(false);
            return null;
        }

        try {
            const parsedUser = JSON.parse(storedUser);
            setToken(storedToken);
            setUser(parsedUser);
            setLoading(false);
            return parsedUser;
        } catch {
            clearSession();
            setToken(null);
            setUser(null);
            setError("Unable to restore your session. Please sign in again.");
            setLoading(false);
            return null;
        }
    }, []);

    const login = useCallback(async (email, password) => {
        setLoading(true);
        setError("");

        try {
            await delay();

            const storedUsers = readStoredUsers();
            const matchedUser = storedUsers.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());

            if (!matchedUser) {
                throw new Error("No account found with this email address.");
            }

            if (matchedUser.password !== password) {
                throw new Error("Incorrect password.");
            }

            const safeUser = sanitizeUser(matchedUser);
            const nextToken = `mock-token-${matchedUser._id}-${Date.now()}`;

            persistSession(nextToken, safeUser);
            setToken(nextToken);
            setUser(safeUser);

            return safeUser;
        } catch (loginError) {
            const message = loginError instanceof Error ? loginError.message : "Login failed.";
            setError(message);
            throw loginError;
        } finally {
            setLoading(false);
        }
    }, []);

    const register = useCallback(async (data) => {
        setLoading(true);
        setError("");

        try {
            await delay();

            const storedUsers = readStoredUsers();
            const normalizedEmail = data.email.trim().toLowerCase();

            if (storedUsers.some((item) => item.email.toLowerCase() === normalizedEmail)) {
                throw new Error("An account with this email already exists.");
            }

            const nextUser = {
                _id: `u${Date.now()}`,
                username: data.username.trim(),
                email: normalizedEmail,
                password: data.password,
                createdAt: new Date().toISOString(),
            };

            localStorage.setItem(USERS_KEY, JSON.stringify([...storedUsers, nextUser]));

            return sanitizeUser(nextUser);
        } catch (registerError) {
            const message = registerError instanceof Error ? registerError.message : "Registration failed.";
            setError(message);
            throw registerError;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        clearSession();
        setToken(null);
        setUser(null);
        setError("");
    }, []);

    const value = useMemo(
        () => ({
            user,
            token,
            isAuthenticated: Boolean(token && user),
            loading,
            error,
            login,
            register,
            logout,
            loadUser,
        }),
        [error, loadUser, loading, login, logout, register, token, user],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;