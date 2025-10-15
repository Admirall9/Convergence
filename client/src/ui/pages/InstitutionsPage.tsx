import React, { useEffect, useState } from 'react'
import { 
  Button, 
  Paper, 
  Stack, 
  TextField, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  Chip,
  Box,
  Alert,
  CircularProgress
} from '@mui/material'
// Removed icons to prevent blank page issues
import axios from 'axios'

type Institution = { 
  id: number
  code: string
  name: string
  type: string
  parent_id?: number | null
  description?: string
  address?: string
  phone?: string
  email?: string
  website?: string
}

export const InstitutionsPage: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const loadInstitutions = async () => {
    try {
      setLoading(true)
      const response = await axios.get<Institution[]>('/api/v1/gov/institutions')
      setInstitutions(response.data)
    } catch (err: any) {
      setError('Failed to load institutions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { 
    loadInstitutions() 
  }, [])

  const filteredInstitutions = institutions.filter(inst =>
    inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inst.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inst.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'ministry': return 'primary'
      case 'agency': return 'secondary'
      case 'department': return 'success'
      case 'office': return 'warning'
      default: return 'default'
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4" sx={{ color: 'primary.main' }}>
        Government Institutions Directory
      </Typography>
      
      <Typography variant="body1" color="text.secondary">
        Browse and search through Morocco's government institutions and departments.
      </Typography>

      {/* Search Bar */}
      <Paper sx={{ p: 2 }}>
        <TextField
          fullWidth
          label="Search institutions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, code, or type..."
        />
      </Paper>

      {error && (
        <Alert severity="error">{error}</Alert>
      )}

      {/* Statistics */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Total Institutions
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {institutions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="secondary">
                Ministries
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {institutions.filter(i => i.type.toLowerCase() === 'ministry').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">
                Agencies
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {institutions.filter(i => i.type.toLowerCase() === 'agency').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="warning.main">
                Departments
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {institutions.filter(i => i.type.toLowerCase() === 'department').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Institutions List */}
      <Grid container spacing={3}>
        {filteredInstitutions.map((institution) => (
          <Grid item xs={12} sm={6} md={4} key={institution.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {institution.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Code: {institution.code}
                </Typography>
                
                <Chip 
                  label={institution.type} 
                  color={getTypeColor(institution.type) as any}
                  size="small"
                  sx={{ mb: 2 }}
                />
                
                {institution.description && (
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {institution.description}
                  </Typography>
                )}
                
                <Stack spacing={1}>
                  {institution.address && (
                    <Typography variant="caption" color="text.secondary">
                      📍 {institution.address}
                    </Typography>
                  )}
                  
                  {institution.phone && (
                    <Typography variant="caption" color="text.secondary">
                      📞 {institution.phone}
                    </Typography>
                  )}
                  
                  {institution.email && (
                    <Typography variant="caption" color="text.secondary">
                      ✉️ {institution.email}
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredInstitutions.length === 0 && !loading && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No institutions found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search terms
          </Typography>
      </Paper>
      )}
    </Stack>
  )
}


