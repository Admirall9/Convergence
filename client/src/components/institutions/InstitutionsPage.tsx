import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface Institution {
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
  created_at: string
  updated_at: string
}

const InstitutionsPage: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null)

  const loadInstitutions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedType !== 'all') params.append('type', selectedType)
      
      const response = await axios.get(`/api/v1/gov/institutions?${params.toString()}`)
      
      // Handle different response formats
      let institutionsData = response.data
      if (Array.isArray(institutionsData)) {
        setInstitutions(institutionsData)
      } else if (institutionsData && Array.isArray(institutionsData.items)) {
        setInstitutions(institutionsData.items)
      } else if (institutionsData && Array.isArray(institutionsData.data)) {
        setInstitutions(institutionsData.data)
      } else {
        // Mock data for testing
        const mockInstitutions: Institution[] = [
          {
            id: 1,
            code: 'MIN-HEALTH-001',
            name: 'Ministry of Health',
            type: 'Ministry',
            description: 'Responsible for public health policy, healthcare services, and medical regulation in Morocco.',
            address: 'Avenue Annakhil, Rabat 10000, Morocco',
            phone: '+212 537 27 37 37',
            email: 'contact@sante.gov.ma',
            website: 'https://www.sante.gov.ma',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-15T10:30:00Z'
          },
          {
            id: 2,
            code: 'MIN-EDU-001',
            name: 'Ministry of National Education',
            type: 'Ministry',
            description: 'Oversees primary, secondary, and higher education systems in Morocco.',
            address: 'Avenue Allal Ben Abdellah, Rabat 10000, Morocco',
            phone: '+212 537 77 17 17',
            email: 'contact@men.gov.ma',
            website: 'https://www.men.gov.ma',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-15T10:30:00Z'
          },
          {
            id: 3,
            code: 'MIN-INT-001',
            name: 'Ministry of Interior',
            type: 'Ministry',
            description: 'Responsible for internal security, local administration, and civil protection.',
            address: 'Place Mohammed V, Rabat 10000, Morocco',
            phone: '+212 537 76 80 80',
            email: 'contact@interieur.gov.ma',
            website: 'https://www.interieur.gov.ma',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-15T10:30:00Z'
          },
          {
            id: 4,
            code: 'MIN-FIN-001',
            name: 'Ministry of Economy and Finance',
            type: 'Ministry',
            description: 'Manages national economy, public finances, and economic policy.',
            address: 'Avenue Mohammed V, Rabat 10000, Morocco',
            phone: '+212 537 76 85 85',
            email: 'contact@finances.gov.ma',
            website: 'https://www.finances.gov.ma',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-15T10:30:00Z'
          },
          {
            id: 5,
            code: 'AGY-DIGITAL-001',
            name: 'Digital Development Agency',
            type: 'Agency',
            parent_id: 4,
            description: 'Promotes digital transformation and e-government initiatives.',
            address: 'Avenue Mohammed VI, Rabat 10000, Morocco',
            phone: '+212 537 77 77 77',
            email: 'contact@add.gov.ma',
            website: 'https://www.add.gov.ma',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-15T10:30:00Z'
          },
          {
            id: 6,
            code: 'DEPT-ADMIN-001',
            name: 'Administrative Reform Department',
            type: 'Department',
            parent_id: 3,
            description: 'Oversees public administration modernization and civil service reform.',
            address: 'Avenue Hassan II, Rabat 10000, Morocco',
            phone: '+212 537 78 88 88',
            email: 'contact@reforme.gov.ma',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-15T10:30:00Z'
          }
        ]
        setInstitutions(mockInstitutions)
      }
    } catch (err: any) {
      console.error('Institutions API Error:', err)
      setError(`Failed to load institutions: ${err.response?.data?.detail || err.message}`)
      
      // Set mock data on error
      const mockInstitutions: Institution[] = [
        {
          id: 1,
          code: 'MIN-HEALTH-001',
          name: 'Ministry of Health',
          type: 'Ministry',
          description: 'Responsible for public health policy and healthcare services.',
          address: 'Avenue Annakhil, Rabat 10000, Morocco',
          phone: '+212 537 27 37 37',
          email: 'contact@sante.gov.ma',
          website: 'https://www.sante.gov.ma',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-15T10:30:00Z'
        }
      ]
      setInstitutions(mockInstitutions)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInstitutions()
  }, [searchTerm, selectedType])

  const filteredInstitutions = institutions.filter(inst =>
    inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inst.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inst.description && inst.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'ministry': return '#2563eb'
      case 'agency': return '#dc2626'
      case 'department': return '#16a34a'
      case 'office': return '#ea580c'
      default: return '#6b7280'
    }
  }

  const types = [...new Set(institutions.map(inst => inst.type))]

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    },
    header: {
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '24px',
      borderRadius: '8px',
      marginBottom: '24px'
    },
    searchBox: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: selectedInstitution ? '1fr 1fr' : '1fr',
      gap: '24px'
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      marginBottom: '12px'
    },
    select: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      marginBottom: '12px',
      backgroundColor: 'white'
    },
    stats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    },
    statCard: {
      backgroundColor: 'white',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb',
      textAlign: 'center' as const
    },
    institutionCard: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb',
      marginBottom: '16px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    institutionCardSelected: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      border: '2px solid #2563eb',
      marginBottom: '16px',
      cursor: 'pointer'
    },
    detailCard: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb',
      height: 'fit-content'
    },
    badge: {
      display: 'inline-block',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '500',
      textTransform: 'uppercase' as const
    },
    loading: {
      textAlign: 'center' as const,
      padding: '40px',
      color: '#6b7280'
    },
    error: {
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      padding: '12px',
      borderRadius: '6px',
      marginBottom: '16px',
      border: '1px solid #fecaca'
    }
  }

  if (loading) {
    return <div style={styles.loading}>Loading institutions...</div>
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
          Government Institutions Directory
        </h1>
        <p style={{ fontSize: '16px', margin: 0, opacity: 0.9 }}>
          Browse and search through Morocco's government institutions and departments
        </p>
      </div>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="Search institutions by name, code, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.input}
        />
        
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          style={styles.select}
        >
          <option value="all">All Types</option>
          {types.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Statistics */}
      <div style={styles.stats}>
        <div style={styles.statCard}>
          <h3 style={{ fontSize: '14px', fontWeight: '500', margin: '0 0 8px 0', color: '#6b7280' }}>
            Total Institutions
          </h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>
            {institutions.length}
          </div>
        </div>
        
        {types.map(type => (
          <div key={type} style={styles.statCard}>
            <h3 style={{ fontSize: '14px', fontWeight: '500', margin: '0 0 8px 0', color: '#6b7280' }}>
              {type}s
            </h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: getTypeColor(type) }}>
              {institutions.filter(i => i.type === type).length}
            </div>
          </div>
        ))}
      </div>

      {/* Results */}
      <div style={styles.grid}>
        {/* Institutions List */}
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            Institutions ({filteredInstitutions.length})
          </h2>
          
          {filteredInstitutions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              No institutions found. Try adjusting your search criteria.
            </div>
          ) : (
            filteredInstitutions.map((institution) => (
              <div
                key={institution.id}
                style={selectedInstitution?.id === institution.id ? styles.institutionCardSelected : styles.institutionCard}
                onClick={() => setSelectedInstitution(institution)}
                onMouseOver={(e) => {
                  if (selectedInstitution?.id !== institution.id) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedInstitution?.id !== institution.id) {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 4px 0' }}>
                      {institution.name}
                    </h3>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                      Code: {institution.code}
                    </div>
                  </div>
                  <span
                    style={{
                      ...styles.badge,
                      backgroundColor: getTypeColor(institution.type) + '20',
                      color: getTypeColor(institution.type)
                    }}
                  >
                    {institution.type}
                  </span>
                </div>
                
                {institution.description && (
                  <p style={{ fontSize: '14px', lineHeight: '1.5', margin: '0 0 12px 0', color: '#374151' }}>
                    {institution.description}
                  </p>
                )}
                
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  <div style={{ marginBottom: '4px' }}>
                    📍 {institution.address || 'Address not available'}
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    📞 {institution.phone || 'Phone not available'}
                  </div>
                  <div>
                    ✉️ {institution.email || 'Email not available'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Institution Details */}
        {selectedInstitution && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
              Institution Details
            </h2>
            
            <div style={styles.detailCard}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 12px 0', color: '#2563eb' }}>
                {selectedInstitution.name}
              </h3>
              
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Institution Code:</div>
                <div style={{ fontSize: '16px', color: '#6b7280', fontFamily: 'monospace' }}>
                  {selectedInstitution.code}
                </div>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Type:</div>
                <span
                  style={{
                    ...styles.badge,
                    backgroundColor: getTypeColor(selectedInstitution.type) + '20',
                    color: getTypeColor(selectedInstitution.type)
                  }}
                >
                  {selectedInstitution.type}
                </span>
              </div>
              
              {selectedInstitution.description && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Description:</div>
                  <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#374151' }}>
                    {selectedInstitution.description}
                  </div>
                </div>
              )}
              
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Contact Information:</div>
                
                {selectedInstitution.address && (
                  <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                    <strong>Address:</strong> {selectedInstitution.address}
                  </div>
                )}
                
                {selectedInstitution.phone && (
                  <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                    <strong>Phone:</strong> {selectedInstitution.phone}
                  </div>
                )}
                
                {selectedInstitution.email && (
                  <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                    <strong>Email:</strong> {selectedInstitution.email}
                  </div>
                )}
                
                {selectedInstitution.website && (
                  <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                    <strong>Website:</strong>{' '}
                    <a 
                      href={selectedInstitution.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#2563eb', textDecoration: 'none' }}
                    >
                      {selectedInstitution.website}
                    </a>
                  </div>
                )}
              </div>
              
              <div style={{ fontSize: '12px', color: '#6b7280', borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
                <div>Created: {new Date(selectedInstitution.created_at).toLocaleDateString()}</div>
                <div>Last Updated: {new Date(selectedInstitution.updated_at).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InstitutionsPage
