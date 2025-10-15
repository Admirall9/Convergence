import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'

interface Law {
  law_id: number
  law_number: string
  title: string
  effective_date: string
  issue_date: string
  source_url?: string
  pdf_path?: string
  articles: LawArticle[]
}

interface LawArticle {
  article_id: number
  article_number: string
  content: string
  law_id: number
}

const LegalRepository: React.FC = () => {
  const [laws, setLaws] = useState<Law[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLaw, setSelectedLaw] = useState<Law | null>(null)
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    category: '',
    ministry: ''
  })

  const loadLaws = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('q', searchTerm)
      if (filters.dateFrom) params.append('from', filters.dateFrom)
      if (filters.dateTo) params.append('to', filters.dateTo)
      if (filters.category) params.append('category', filters.category)
      if (filters.ministry) params.append('ministry', filters.ministry)
      
      const response = await axios.get(`/api/v1/legal/laws?${params.toString()}`)
      
      // Handle different response formats
      let lawsData = response.data
      if (Array.isArray(lawsData)) {
        setLaws(lawsData)
      } else if (lawsData && Array.isArray(lawsData.items)) {
        setLaws(lawsData.items)
      } else if (lawsData && Array.isArray(lawsData.data)) {
        setLaws(lawsData.data)
      } else {
        // Mock data for testing
        const mockLaws: Law[] = [
          {
            law_id: 1,
            law_number: "12-2024",
            title: "Loi sur les Services Gouvernementaux Numériques",
            effective_date: "2024-01-01",
            issue_date: "2023-12-15",
            source_url: "https://example.com/law-12-2024",
            articles: [
              {
                article_id: 1,
                article_number: "1",
                content: "Cette loi vise à moderniser les services gouvernementaux par la transformation numérique.",
                law_id: 1
              },
              {
                article_id: 2,
                article_number: "2",
                content: "Toutes les institutions gouvernementales doivent fournir des services en ligne dans un délai de 18 mois.",
                law_id: 1
              }
            ]
          },
          {
            law_id: 2,
            law_number: "08-2023",
            title: "Loi sur la Protection des Données et la Vie Privée",
            effective_date: "2023-06-01",
            issue_date: "2023-05-20",
            source_url: "https://example.com/law-08-2023",
            articles: [
              {
                article_id: 3,
                article_number: "1",
                content: "Cette loi protège les données personnelles et les droits à la vie privée des citoyens.",
                law_id: 2
              }
            ]
          }
        ]
        setLaws(mockLaws)
      }
    } catch (err: any) {
      console.error('API Error:', err)
      setError(`Échec du chargement des lois: ${err.response?.data?.detail || err.message}`)
      setLaws([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLaws()
  }, [searchTerm, filters])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadLaws()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px',
      fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
    },
    header: {
      backgroundColor: '#0066cc',
      color: 'white',
      padding: '32px',
      borderRadius: '16px',
      marginBottom: '32px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      margin: '0 0 8px 0',
      fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
    },
    subtitle: {
      fontSize: '18px',
      margin: 0,
      opacity: 0.9,
      fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
    },
    searchBox: {
      backgroundColor: 'white',
      padding: '32px',
      borderRadius: '16px',
      marginBottom: '32px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e9ecef'
    },
    input: {
      width: '100%',
      padding: '16px',
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      fontSize: '16px',
      marginBottom: '16px',
      fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    button: {
      backgroundColor: '#0066cc',
      color: 'white',
      padding: '16px 32px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '500',
      fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif',
      transition: 'background-color 0.2s'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: selectedLaw ? '1fr 1fr' : '1fr',
      gap: '32px'
    },
    lawCard: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e9ecef',
      marginBottom: '20px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
    },
    lawCardSelected: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 8px 15px rgba(0, 0, 0, 0.15)',
      border: '2px solid #0066cc',
      marginBottom: '20px',
      cursor: 'pointer'
    },
    articleCard: {
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '16px',
      border: '1px solid #e9ecef',
      fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
    },
    loading: {
      textAlign: 'center' as const,
      padding: '64px',
      color: '#636e72',
      fontSize: '18px',
      fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
    },
    error: {
      backgroundColor: '#ffe6e6',
      color: '#e17055',
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '24px',
      border: '1px solid #ffb3b3',
      fontSize: '16px',
      fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
    }
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Chargement des documents légaux...</div>
      </div>
    )
  }

  return (
    <div style={styles.container} className="text-white">
      {/* Header */}
      <div style={styles.header} className="backdrop-blur-sm bg-white/5 border border-white/10">
        <h1 style={styles.title} className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
          Répertoire Légal
        </h1>
        <p style={styles.subtitle} className="text-white/80">
          Recherchez et parcourez les documents légaux du Maroc depuis le Bulletin Officiel
        </p>
      </div>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div style={styles.searchBox} className="backdrop-blur-sm bg-white/5 border border-white/10">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Rechercher des lois par titre, numéro ou mots-clés..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.input}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-300/60"
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <input
              type="date"
              placeholder="Date de début"
              value={filters.dateFrom}
              onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
              style={styles.input}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-300/60"
            />
            <input
              type="date"
              placeholder="Date de fin"
              value={filters.dateTo}
              onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
              style={styles.input}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-300/60"
            />
            <input
              type="text"
              placeholder="Catégorie"
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              style={styles.input}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-300/60"
            />
            <input
              type="text"
              placeholder="Ministère"
              value={filters.ministry}
              onChange={(e) => setFilters({...filters, ministry: e.target.value})}
              style={styles.input}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-300/60"
            />
          </div>
          
          <button type="submit" style={styles.button} className="bg-cyan-600 hover:bg-cyan-500">
            Rechercher des Lois
          </button>
        </form>
      </div>

      {/* Results */}
      <div style={styles.grid}>
        {/* Laws List */}
        <div>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            marginBottom: '24px',
            color: '#2d3436',
            fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
          }}>
            Lois ({laws.length})
          </h2>
          
          {laws.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '64px', 
              color: '#e5e7eb',
              fontSize: '16px',
              fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
            }}>
              Aucune loi trouvée. Essayez d'ajuster vos critères de recherche.
            </div>
          ) : (
            laws.map((law, idx) => (
              <motion.div
                key={law.law_id}
                style={selectedLaw?.law_id === law.law_id ? styles.lawCardSelected : styles.lawCard}
                className="backdrop-blur-sm bg-white/5 border border-white/10"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.03 * idx, duration: 0.3 }}
                onClick={() => setSelectedLaw(law)}
                onMouseOver={(e) => {
                  if (selectedLaw?.law_id !== law.law_id) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.25)'
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedLaw?.law_id !== law.law_id) {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: '600', 
                  margin: '0 0 12px 0', 
                  color: '#7dd3fc',
                  fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
                }}>
                  Loi {law.law_number}
                </h3>
                <h4 style={{ 
                  fontSize: '18px', 
                  fontWeight: '500', 
                  margin: '0 0 16px 0',
                  color: '#ffffff',
                  fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
                }}>
                  {law.title}
                </h4>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#cbd5e1', 
                  marginBottom: '12px',
                  fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
                }}>
                  <div>Entrée en vigueur: {formatDate(law.effective_date)}</div>
                  <div>Date de publication: {formatDate(law.issue_date)}</div>
                  <div>Articles: {law.articles?.length || 0}</div>
                </div>
                {law.source_url && (
                  <a
                    href={law.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      color: '#7dd3fc', 
                      textDecoration: 'none', 
                      fontSize: '14px',
                      fontWeight: '500',
                      fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
                    }}
                  >
                    Voir la source officielle →
                  </a>
                )}
              </motion.div>
            ))
          )}
        </div>

        {/* Selected Law Details */}
        {selectedLaw && (
          <div>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '600', 
              marginBottom: '24px',
              color: '#2d3436',
              fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
            }}>
              Loi {selectedLaw.law_number} - Articles
            </h2>
            
            <div style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '16px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                margin: '0 0 12px 0',
                color: '#2d3436',
                fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
              }}>
                {selectedLaw.title}
              </h3>
              <p style={{ 
                fontSize: '14px', 
                color: '#636e72', 
                marginBottom: '24px',
                fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
              }}>
                Entrée en vigueur: {formatDate(selectedLaw.effective_date)} | 
                Publication: {formatDate(selectedLaw.issue_date)}
              </p>
              
              <div>
                <h4 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  marginBottom: '16px',
                  color: '#2d3436',
                  fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
                }}>
                  Articles ({selectedLaw.articles?.length || 0})
                </h4>
                
                {selectedLaw.articles && selectedLaw.articles.length > 0 ? (
                  selectedLaw.articles.map((article) => (
                    <div key={article.article_id} style={styles.articleCard}>
                      <h5 style={{ 
                        fontSize: '16px', 
                        fontWeight: '600', 
                        margin: '0 0 12px 0', 
                        color: '#0066cc',
                        fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
                      }}>
                        Article {article.article_number}
                      </h5>
                      <p style={{ 
                        fontSize: '14px', 
                        lineHeight: '1.6', 
                        margin: 0,
                        color: '#2d3436',
                        fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
                      }}>
                        {article.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#636e72', 
                    fontStyle: 'italic',
                    fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
                  }}>
                    Aucun article disponible pour cette loi.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LegalRepository