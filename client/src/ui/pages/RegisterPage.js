import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button, Paper, Stack, TextField, Typography, Alert, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('/api/v1/citizen/register', {
                email: email,
                password: password,
                full_name: fullName
            });
            setSuccess(true);
            // Auto-login after successful registration
            setTimeout(async () => {
                try {
                    const params = new URLSearchParams();
                    params.append('username', email);
                    params.append('password', password);
                    const loginResponse = await axios.post('/api/v1/citizen/token', params, {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    });
                    localStorage.setItem('token', loginResponse.data.access_token);
                    navigate('/');
                }
                catch (loginErr) {
                    navigate('/login');
                }
            }, 2000);
        }
        catch (err) {
            if (err.response?.status === 400) {
                setError('Email already exists or invalid data');
            }
            else if (err.response?.status === 422) {
                setError('Please check your input data');
            }
            else {
                setError('Registration failed. Please try again.');
            }
        }
        finally {
            setLoading(false);
        }
    };
    if (success) {
        return (_jsx(Box, { sx: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60vh',
                p: 2
            }, children: _jsxs(Paper, { sx: { p: 4, maxWidth: 420, width: '100%', textAlign: 'center' }, children: [_jsx(Alert, { severity: "success", sx: { mb: 2 }, children: "Registration successful! Logging you in..." }), _jsx(Typography, { variant: "body1", children: "You will be redirected to the dashboard shortly." })] }) }));
    }
    return (_jsx(Box, { sx: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
            p: 2
        }, children: _jsxs(Paper, { sx: { p: 4, maxWidth: 420, width: '100%' }, children: [_jsx(Typography, { variant: "h5", sx: { mb: 3, textAlign: 'center' }, children: "Create Account" }), error && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error })), _jsx("form", { onSubmit: handleSubmit, children: _jsxs(Stack, { spacing: 3, children: [_jsx(TextField, { label: "Full Name", fullWidth: true, value: fullName, onChange: (e) => setFullName(e.target.value), required: true }), _jsx(TextField, { label: "Email", type: "email", fullWidth: true, value: email, onChange: (e) => setEmail(e.target.value), required: true }), _jsx(TextField, { label: "Password", type: "password", fullWidth: true, value: password, onChange: (e) => setPassword(e.target.value), required: true }), _jsx(TextField, { label: "Confirm Password", type: "password", fullWidth: true, value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), required: true }), _jsx(Button, { type: "submit", variant: "contained", fullWidth: true, disabled: loading, sx: { py: 1.5 }, children: loading ? 'Creating Account...' : 'Create Account' })] }) }), _jsx(Box, { sx: { mt: 3, textAlign: 'center' }, children: _jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["Already have an account?", ' ', _jsx(Button, { variant: "text", onClick: () => navigate('/login'), sx: { textTransform: 'none' }, children: "Login here" })] }) })] }) }));
};
