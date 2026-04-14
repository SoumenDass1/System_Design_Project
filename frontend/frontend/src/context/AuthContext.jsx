import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const updateUser = async (updatedData) => {
        try {
            const { data } = await api.put('/auth/profile', updatedData);
            setUser(data);
            toast.success('Profile updated');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
            return false;
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const { data } = await api.get('/auth/profile');
                    setUser(data);
                } catch (error) {
                    console.error('Auth check failed:', error);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            setUser(data);
            toast.success('Logged in successfully');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            return false;
        }
    };

    const googleLogin = async (token) => {
        try {
            const { data } = await api.post('/auth/google', { token });
            localStorage.setItem('token', data.token);
            setUser(data);
            toast.success('Logged in with Google');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Google login failed');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('cart'); // Fix: Clear cart on logout
        setUser(null);
        toast.success('Logged out');
        // Optional: window.location.reload() to force clean state if context doesn't auto-update
        // But removing token triggers App redirects usually. 
        // Let's force reload just to be safe and simple for the user's "time nahi hai".
        setTimeout(() => window.location.reload(), 500);
    };

    const register = async (userData) => {
        try {
            const { data } = await api.post('/auth/register', userData);
            localStorage.setItem('token', data.token);
            setUser(data);
            toast.success('Registration successful!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            return false;
        }
    };

    const changePassword = async (currentPassword, newPassword) => {
        try {
            await api.put('/password/change', { currentPassword, newPassword });
            toast.success('Password changed successfully');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
            return false;
        }
    };

    const forgotPassword = async (email) => {
        try {
            await api.post('/password/forgot', { email });
            toast.success('If email exists, reset instructions will be sent');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to process request');
            return false;
        }
    };

    const resetPassword = async (token, newPassword) => {
        try {
            await api.post('/password/reset', { token, newPassword });
            toast.success('Password reset successful');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password');
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            register,
            updateUser,
            googleLogin,
            changePassword,
            forgotPassword,
            resetPassword,
            loading
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
