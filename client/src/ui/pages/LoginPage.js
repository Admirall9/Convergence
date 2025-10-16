import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/auth';
import axios from 'axios';
export const LoginPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { login, setLoading, isLoading } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            params.append('username', email);
            params.append('password', password);
            const response = await axios.post('/api/v1/citizen/token', params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            // Store the token
            localStorage.setItem('token', response.data.access_token);
            // Update auth store
            login(response.data.access_token, {
                id: 1,
                email: email,
                fullName: 'Test User', // In real app, get from API
                role: 'Citizen', // In real app, get from API
                isVerified: true
            });
            // Redirect to dashboard
            navigate('/');
        }
        catch (err) {
            if (err.response?.status === 401) {
                setError('Invalid email or password');
            }
            else if (err.response?.status === 422) {
                setError('Please check your email and password format');
            }
            else {
                setError('Login failed. Please try again.');
            }
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-md w-full space-y-8", children: [_jsxs("div", { children: [_jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: t('loginTitle') }), _jsx("p", { className: "mt-2 text-center text-sm text-gray-600", children: "Morocco's National Civic Intelligence Platform" })] }), _jsxs("form", { className: "mt-8 space-y-6", onSubmit: handleSubmit, children: [error && (_jsx("div", { className: "rounded-md bg-red-50 p-4", children: _jsx("div", { className: "text-sm text-red-700", children: error }) })), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: t('email') }), _jsx("input", { id: "email", name: "email", type: "email", autoComplete: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "mt-1 input", placeholder: "Enter your email" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700", children: t('password') }), _jsxs("div", { className: "mt-1 relative", children: [_jsx("input", { id: "password", name: "password", type: showPassword ? 'text' : 'password', autoComplete: "current-password", required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "input pr-10", placeholder: "Enter your password" }), _jsx("button", { type: "button", className: "absolute inset-y-0 right-0 pr-3 flex items-center", onClick: () => setShowPassword(!showPassword), children: showPassword ? (_jsx(EyeSlashIcon, { className: "h-4 w-4 text-gray-400" })) : (_jsx(EyeIcon, { className: "h-4 w-4 text-gray-400" })) })] })] })] }), _jsx("div", { children: _jsx("button", { type: "submit", disabled: isLoading, className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed", children: isLoading ? (_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" }), "Logging in..."] })) : (t('login')) }) }), _jsx("div", { className: "text-center", children: _jsxs("p", { className: "text-sm text-gray-600", children: ["Don't have an account?", ' ', _jsx("button", { type: "button", onClick: () => navigate('/register'), className: "font-medium text-primary-600 hover:text-primary-500", children: t('register') })] }) }), _jsxs("div", { className: "mt-6 p-4 bg-gray-50 rounded-lg", children: [_jsx("h3", { className: "text-sm font-medium text-gray-700 mb-2", children: "Test Credentials:" }), _jsxs("div", { className: "text-xs text-gray-600 space-y-1", children: [_jsx("div", { children: "Admin: admin@convergence.ma / admin123" }), _jsx("div", { children: "Citizen: citizen@convergence.ma / citizen123" }), _jsx("div", { children: "Moderator: moderator@convergence.ma / mod123" })] })] })] })] }) }));
};
