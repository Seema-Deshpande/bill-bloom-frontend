import { createContext, useState, useEffect  } from "react";
import { loginUser, registerUser, getMe  } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

 useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setLoading(false);
      return;
    }
    getMe()
      .then(({ user }) => {
        setUser(user);
        setToken(storedToken);
        setIsAuthenticated(true);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setToken(null);
        setIsAuthenticated(false);
      })
      .finally(() => setLoading(false));
  }, []);

    async function login(email, password) {
        setError(null);
        try {
            const data = await loginUser(email, password);
             localStorage.setItem("token", data.token);
            setToken(data.token);
            setUser(data.user);
            setIsAuthenticated(true);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    async function register(userData) {
        setError(null);
        try {
            await registerUser(userData);
        } catch (err) {
           setError(err.message);
            throw err;
        }
    }
    async function logout() {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    }

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, loading, error, login,register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;