/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedUser && token) {
            try {
                setUser(JSON.parse(storedUser))
            } catch {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            }
        }
        else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        if (token) {
            localStorage.setItem('token', token);
        }
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        }
    };

    const updateUser = (userData) => {
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        }
    };

    const logout = (logoutResponse) => {
        localStorage.removeItem('token');
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
        toast.success(logoutResponse?.message || "Logged out successfully");
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
