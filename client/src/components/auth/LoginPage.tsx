import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuthStore } from '../../store/auth'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      params.append('username', email)
      params.append('password', password)
      
      const response = await axios.post('/api/v1/citizen/token', params, { 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' } 
      })
      
      // Store the token
      localStorage.setItem('token', response.data.access_token)
      
      // Update auth store
      login(response.data.access_token, {
        id: 1,
        email: email,
        fullName: 'Test User', // In real app, get from API
        role: 'Citizen', // In real app, get from API
        isVerified: true
      })
      
      // Redirect to dashboard
      navigate('/')
      
    } catch (err: any) {
      console.error('Login Error:', err)
      
      if (err.response?.status === 401) {
        setError('Email ou mot de passe incorrect')
      } else if (err.response?.status === 422) {
        setError('Veuillez vérifier le format de votre email et mot de passe')
      } else {
        setError('Échec de la connexion. Veuillez réessayer.')
      }
    } finally {
      setLoading(false)
    }
  }

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
      textAlign: 'center' as const,
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
      flexDirection: 'column' as const,
      gap: '24px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
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
      position: 'relative' as const
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
      position: 'absolute' as const,
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
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>C</div>
          <h1 style={styles.title}>Connexion</h1>
          <p style={styles.subtitle}>Accédez à votre espace Convergence</p>
        </div>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Adresse email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="Votre adresse email"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Mot de passe</label>
            <div style={styles.passwordContainer}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.passwordInput}
                placeholder="Votre mot de passe"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ fontSize: '14px', color: '#636e72', margin: 0 }}>
            Pas encore de compte ?{' '}
            <span
              onClick={() => navigate('/register')}
              style={{ ...styles.link, cursor: 'pointer' }}
            >
              Créer un compte
            </span>
          </p>
        </div>

        <div style={styles.testCredentials}>
          <div style={styles.testTitle}>Identifiants de test :</div>
          <div style={styles.testItem}>Admin: admin@convergence.ma / admin123</div>
          <div style={styles.testItem}>Citoyen: citizen@convergence.ma / citizen123</div>
          <div style={styles.testItem}>Modérateur: moderator@convergence.ma / mod123</div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage