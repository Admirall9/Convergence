import React, { useState } from 'react'
import { Button, Paper, Stack, TextField, Typography, Alert, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post('/api/v1/citizen/register', {
        email: email,
        password: password,
        full_name: fullName
      })
      
      setSuccess(true)
      
      // Auto-login after successful registration
      setTimeout(async () => {
        try {
          const params = new URLSearchParams()
          params.append('username', email)
          params.append('password', password)
          
          const loginResponse = await axios.post('/api/v1/citizen/token', params, { 
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' } 
          })
          
          localStorage.setItem('token', loginResponse.data.access_token)
          navigate('/')
        } catch (loginErr) {
          navigate('/login')
        }
      }, 2000)
      
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError('Email already exists or invalid data')
      } else if (err.response?.status === 422) {
        setError('Please check your input data')
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        p: 2 
      }}>
        <Paper sx={{ p: 4, maxWidth: 420, width: '100%', textAlign: 'center' }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            Registration successful! Logging you in...
          </Alert>
          <Typography variant="body1">
            You will be redirected to the dashboard shortly.
          </Typography>
        </Paper>
      </Box>
    )
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '60vh',
      p: 2 
    }}>
      <Paper sx={{ p: 4, maxWidth: 420, width: '100%' }}>
        <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
          Create Account
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField 
              label="Full Name" 
              fullWidth
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            
            <TextField 
              label="Email" 
              type="email" 
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <TextField 
              label="Password" 
              type="password" 
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <TextField 
              label="Confirm Password" 
              type="password" 
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Stack>
        </form>
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Button 
              variant="text" 
              onClick={() => navigate('/login')}
              sx={{ textTransform: 'none' }}
            >
              Login here
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}