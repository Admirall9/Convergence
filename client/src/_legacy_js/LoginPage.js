import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../store/auth';
const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
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
            console.error('Login Error:', err);
            if (err.response?.status === 401) {
                setError('Email ou mot de passe incorrect');
            }
            else if (err.response?.status === 422) {
                setError('Veuillez vérifier le format de votre email et mot de passe');
            }
            else {
                setError('Échec de la connexion. Veuillez réessayer.');
            }
        }
        finally {
            setLoading(false);
        }
    };
    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8f9fa',
            padding: '20px',
            fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
        },
        card: {
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '16px',
            boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
            width: '100%',
            maxWidth: '420px',
            border: '1px solid #e9ecef'
        },
        header: {
            textAlign: 'center',
            marginBottom: '40px'
        },
        logo: {
            width: '80px',
            height: '80px',
            backgroundColor: '#0066cc',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            color: 'white',
            fontSize: '32px',
            fontWeight: 'bold'
        },
        title: {
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#2d3436',
            margin: '0 0 8px 0'
        },
        subtitle: {
            fontSize: '16px',
            color: '#636e72',
            margin: 0
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
        },
        inputGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        },
        label: {
            fontSize: '14px',
            fontWeight: '500',
            color: '#2d3436'
        },
        input: {
            padding: '14px 16px',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            fontSize: '15px',
            transition: 'border-color 0.2s',
            outline: 'none',
            fontFamily: 'inherit'
        },
        inputFocus: {
            borderColor: '#0066cc',
            boxShadow: '0 0 0 3px rgba(0, 102, 204, 0.1)'
        },
        passwordContainer: {
            position: 'relative'
        },
        passwordInput: {
            padding: '14px 44px 14px 16px',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            fontSize: '15px',
            width: '100%',
            outline: 'none',
            fontFamily: 'inherit'
        },
        passwordToggle: {
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            color: '#636e72'
        },
        button: {
            backgroundColor: '#0066cc',
            color: 'white',
            padding: '16px 24px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            marginTop: '8px',
            fontFamily: 'inherit'
        },
        buttonDisabled: {
            backgroundColor: '#adb5bd',
            cursor: 'not-allowed'
        },
        error: {
            backgroundColor: '#ffe6e6',
            color: '#e17055',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '14px',
            border: '1px solid #ffb3b3'
        },
        link: {
            color: '#0066cc',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
        },
        testCredentials: {
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginTop: '32px',
            fontSize: '14px',
            border: '1px solid #e9ecef'
        },
        testTitle: {
            fontWeight: '600',
            marginBottom: '12px',
            color: '#2d3436'
        },
        testItem: {
            marginBottom: '6px',
            color: '#636e72'
        }
    };
    return (_jsx("div", { style: styles.container, children: _jsxs("div", { style: styles.card, children: [_jsxs("div", { style: styles.header, children: [_jsx("div", { style: styles.logo, children: "C" }), _jsx("h1", { style: styles.title, children: "Connexion" }), _jsx("p", { style: styles.subtitle, children: "Acc\u00E9dez \u00E0 votre espace Convergence" })] }), error && (_jsx("div", { style: styles.error, children: error })), _jsxs("form", { onSubmit: handleSubmit, style: styles.form, children: [_jsxs("div", { style: styles.inputGroup, children: [_jsx("label", { style: styles.label, children: "Adresse email" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), style: styles.input, placeholder: "Votre adresse email", required: true })] }), _jsxs("div", { style: styles.inputGroup, children: [_jsx("label", { style: styles.label, children: "Mot de passe" }), _jsxs("div", { style: styles.passwordContainer, children: [_jsx("input", { type: showPassword ? 'text' : 'password', value: password, onChange: (e) => setPassword(e.target.value), style: styles.passwordInput, placeholder: "Votre mot de passe", required: true }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), style: styles.passwordToggle, children: showPassword ? '🙈' : '👁️' })] })] }), _jsx("button", { type: "submit", disabled: loading, style: {
                                ...styles.button,
                                ...(loading ? styles.buttonDisabled : {})
                            }, children: loading ? 'Connexion en cours...' : 'Se connecter' })] }), _jsx("div", { style: { textAlign: 'center', marginTop: '24px' }, children: _jsxs("p", { style: { fontSize: '14px', color: '#636e72', margin: 0 }, children: ["Pas encore de compte ?", ' ', _jsx("span", { onClick: () => navigate('/register'), style: { ...styles.link, cursor: 'pointer' }, children: "Cr\u00E9er un compte" })] }) }), _jsxs("div", { style: styles.testCredentials, children: [_jsx("div", { style: styles.testTitle, children: "Identifiants de test :" }), _jsx("div", { style: styles.testItem, children: "Admin: admin@convergence.ma / admin123" }), _jsx("div", { style: styles.testItem, children: "Citoyen: citizen@convergence.ma / citizen123" }), _jsx("div", { style: styles.testItem, children: "Mod\u00E9rateur: moderator@convergence.ma / mod123" })] })] }) }));
};
export default LoginPage;
