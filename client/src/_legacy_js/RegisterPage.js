import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../store/auth';
const RegisterPage = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('/api/v1/citizen/register', {
                email: formData.email,
                password: formData.password,
                full_name: formData.fullName,
                phone: formData.phone,
                address: formData.address
            });
            setSuccess(true);
            // Auto-login after successful registration
            setTimeout(async () => {
                try {
                    const params = new URLSearchParams();
                    params.append('username', formData.email);
                    params.append('password', formData.password);
                    const loginResponse = await axios.post('/api/v1/citizen/token', params, {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    });
                    localStorage.setItem('token', loginResponse.data.access_token);
                    // Update auth store
                    login(loginResponse.data.access_token, {
                        id: 1,
                        email: formData.email,
                        fullName: formData.fullName,
                        role: 'Citizen',
                        isVerified: true
                    });
                    navigate('/');
                }
                catch (loginErr) {
                    navigate('/login');
                }
            }, 2000);
        }
        catch (err) {
            console.error('Registration Error:', err);
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
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9fafb',
            padding: '20px'
        },
        card: {
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            width: '100%',
            maxWidth: '500px'
        },
        header: {
            textAlign: 'center',
            marginBottom: '32px'
        },
        title: {
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: '0 0 8px 0'
        },
        subtitle: {
            fontSize: '16px',
            color: '#6b7280',
            margin: 0
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
        },
        inputGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        },
        label: {
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151'
        },
        input: {
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '16px',
            transition: 'border-color 0.2s',
            outline: 'none'
        },
        passwordContainer: {
            position: 'relative'
        },
        passwordInput: {
            padding: '12px 48px 12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '16px',
            width: '100%',
            outline: 'none'
        },
        passwordToggle: {
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            color: '#6b7280'
        },
        button: {
            backgroundColor: '#16a34a',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            marginTop: '8px'
        },
        buttonDisabled: {
            backgroundColor: '#9ca3af',
            cursor: 'not-allowed'
        },
        error: {
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '14px',
            border: '1px solid #fecaca'
        },
        success: {
            backgroundColor: '#f0fdf4',
            color: '#16a34a',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '14px',
            border: '1px solid #bbf7d0',
            textAlign: 'center'
        },
        link: {
            color: '#2563eb',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
        },
        successCard: {
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            width: '100%',
            maxWidth: '400px',
            textAlign: 'center'
        },
        successIcon: {
            fontSize: '48px',
            marginBottom: '16px'
        }
    };
    if (success) {
        return (_jsx("div", { style: styles.container, children: _jsxs("div", { style: styles.successCard, children: [_jsx("div", { style: styles.successIcon, children: "\u2705" }), _jsx("h1", { style: styles.title, children: "Registration Successful!" }), _jsx("p", { style: styles.subtitle, children: "Your account has been created successfully. You will be automatically logged in and redirected to the dashboard." }), _jsx("div", { style: styles.success, children: "Redirecting to dashboard..." })] }) }));
    }
    return (_jsx("div", { style: styles.container, children: _jsxs("div", { style: styles.card, children: [_jsxs("div", { style: styles.header, children: [_jsx("h1", { style: styles.title, children: "Create Account" }), _jsx("p", { style: styles.subtitle, children: "Join Convergence Platform" })] }), error && (_jsx("div", { style: styles.error, children: error })), _jsxs("form", { onSubmit: handleSubmit, style: styles.form, children: [_jsxs("div", { style: styles.inputGroup, children: [_jsx("label", { style: styles.label, children: "Full Name" }), _jsx("input", { type: "text", value: formData.fullName, onChange: (e) => handleInputChange('fullName', e.target.value), style: styles.input, placeholder: "Enter your full name", required: true })] }), _jsxs("div", { style: styles.inputGroup, children: [_jsx("label", { style: styles.label, children: "Email Address" }), _jsx("input", { type: "email", value: formData.email, onChange: (e) => handleInputChange('email', e.target.value), style: styles.input, placeholder: "Enter your email", required: true })] }), _jsxs("div", { style: styles.inputGroup, children: [_jsx("label", { style: styles.label, children: "Phone Number (Optional)" }), _jsx("input", { type: "tel", value: formData.phone, onChange: (e) => handleInputChange('phone', e.target.value), style: styles.input, placeholder: "Enter your phone number" })] }), _jsxs("div", { style: styles.inputGroup, children: [_jsx("label", { style: styles.label, children: "Address (Optional)" }), _jsx("input", { type: "text", value: formData.address, onChange: (e) => handleInputChange('address', e.target.value), style: styles.input, placeholder: "Enter your address" })] }), _jsxs("div", { style: styles.inputGroup, children: [_jsx("label", { style: styles.label, children: "Password" }), _jsxs("div", { style: styles.passwordContainer, children: [_jsx("input", { type: showPassword ? 'text' : 'password', value: formData.password, onChange: (e) => handleInputChange('password', e.target.value), style: styles.passwordInput, placeholder: "Enter your password", required: true }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), style: styles.passwordToggle, children: showPassword ? '🙈' : '👁️' })] })] }), _jsxs("div", { style: styles.inputGroup, children: [_jsx("label", { style: styles.label, children: "Confirm Password" }), _jsxs("div", { style: styles.passwordContainer, children: [_jsx("input", { type: showConfirmPassword ? 'text' : 'password', value: formData.confirmPassword, onChange: (e) => handleInputChange('confirmPassword', e.target.value), style: styles.passwordInput, placeholder: "Confirm your password", required: true }), _jsx("button", { type: "button", onClick: () => setShowConfirmPassword(!showConfirmPassword), style: styles.passwordToggle, children: showConfirmPassword ? '🙈' : '👁️' })] })] }), _jsx("button", { type: "submit", disabled: loading, style: {
                                ...styles.button,
                                ...(loading ? styles.buttonDisabled : {})
                            }, children: loading ? 'Creating Account...' : 'Create Account' })] }), _jsx("div", { style: { textAlign: 'center', marginTop: '24px' }, children: _jsxs("p", { style: { fontSize: '14px', color: '#6b7280', margin: 0 }, children: ["Already have an account?", ' ', _jsx("a", { href: "/login", style: styles.link, children: "Sign In" })] }) })] }) }));
};
export default RegisterPage;
