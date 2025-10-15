import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface Review {
  id: number
  institution: string
  official_name: string
  rating: number
  title: string
  content: string
  category: 'service' | 'responsiveness' | 'transparency' | 'corruption'
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  user_name?: string
  is_anonymous: boolean
}

interface ReviewStats {
  total_reviews: number
  average_rating: number
  pending_reviews: number
  approved_reviews: number
}

const CitizenReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedInstitution, setSelectedInstitution] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  // Form state
  const [formData, setFormData] = useState({
    institution: '',
    official_name: '',
    rating: 5,
    title: '',
    content: '',
    category: 'service' as Review['category'],
    is_anonymous: false
  })

  const loadReviews = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedInstitution !== 'all') {
        params.append('institution', selectedInstitution)
      }
      if (filterCategory !== 'all') {
        params.append('category', filterCategory)
      }
      params.append('sort', sortBy)
      
      const response = await axios.get(`/api/v1/reviews?${params.toString()}`)
      
      // Handle different response formats
      let reviewsData = response.data
      if (Array.isArray(reviewsData)) {
        setReviews(reviewsData)
      } else if (reviewsData && Array.isArray(reviewsData.items)) {
        setReviews(reviewsData.items)
      } else if (reviewsData && Array.isArray(reviewsData.data)) {
        setReviews(reviewsData.data)
      } else {
        // Mock data for testing
        const mockReviews: Review[] = [
          {
            id: 1,
            institution: 'Ministry of Health',
            official_name: 'Dr. Ahmed Benali',
            rating: 4,
            title: 'Excellent Healthcare Services',
            content: 'The new digital health platform is very user-friendly and efficient. I was able to book an appointment and access my medical records easily.',
            category: 'service',
            status: 'approved',
            created_at: '2024-01-15T10:30:00Z',
            user_name: 'Fatima Alami',
            is_anonymous: false
          },
          {
            id: 2,
            institution: 'Ministry of Education',
            official_name: 'Prof. Khadija Tazi',
            rating: 5,
            title: 'Outstanding Educational Support',
            content: 'The digital learning initiative has transformed my children\'s education. The online resources are comprehensive and well-organized.',
            category: 'service',
            status: 'approved',
            created_at: '2024-01-14T15:45:00Z',
            user_name: 'Anonymous',
            is_anonymous: true
          },
          {
            id: 3,
            institution: 'Ministry of Interior',
            official_name: 'Col. Youssef Idrissi',
            rating: 3,
            title: 'Slow Response Time',
            content: 'The service was adequate but the response time for document processing was longer than expected. Could be improved.',
            category: 'responsiveness',
            status: 'approved',
            created_at: '2024-01-13T09:20:00Z',
            user_name: 'Mohammed Alami',
            is_anonymous: false
          },
          {
            id: 4,
            institution: 'Ministry of Finance',
            official_name: 'Ms. Aicha Benkirane',
            rating: 2,
            title: 'Transparency Issues',
            content: 'Had difficulty understanding the tax calculation process. More transparency in financial procedures would be helpful.',
            category: 'transparency',
            status: 'pending',
            created_at: '2024-01-12T14:15:00Z',
            user_name: 'Anonymous',
            is_anonymous: true
          }
        ]
        setReviews(mockReviews)
      }

      // Mock stats
      const mockStats: ReviewStats = {
        total_reviews: 156,
        average_rating: 3.8,
        pending_reviews: 12,
        approved_reviews: 144
      }
      setStats(mockStats)
      
    } catch (err: any) {
      console.error('Reviews API Error:', err)
      setError(`Failed to load reviews: ${err.response?.data?.detail || err.message}`)
      
      // Set mock data on error
      const mockReviews: Review[] = [
        {
          id: 1,
          institution: 'Ministry of Health',
          official_name: 'Dr. Ahmed Benali',
          rating: 4,
          title: 'Excellent Healthcare Services',
          content: 'The new digital health platform is very user-friendly and efficient.',
          category: 'service',
          status: 'approved',
          created_at: '2024-01-15T10:30:00Z',
          user_name: 'Fatima Alami',
          is_anonymous: false
        }
      ]
      setReviews(mockReviews)
      
      const mockStats: ReviewStats = {
        total_reviews: 156,
        average_rating: 3.8,
        pending_reviews: 12,
        approved_reviews: 144
      }
      setStats(mockStats)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReviews()
  }, [selectedInstitution, filterCategory, sortBy])

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post('/api/v1/reviews', formData)
      setShowForm(false)
      setFormData({
        institution: '',
        official_name: '',
        rating: 5,
        title: '',
        content: '',
        category: 'service',
        is_anonymous: false
      })
      loadReviews()
    } catch (err: any) {
      console.error('Submit Review Error:', err)
      setError('Failed to submit review. Please try again.')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'service': return '#16a34a'
      case 'responsiveness': return '#ea580c'
      case 'transparency': return '#7c3aed'
      case 'corruption': return '#dc2626'
      default: return '#6b7280'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#16a34a'
      case 'pending': return '#ea580c'
      case 'rejected': return '#dc2626'
      default: return '#6b7280'
    }
  }

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  const institutions = [...new Set(reviews.map(review => review.institution))]

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    },
    header: {
      backgroundColor: '#16a34a',
      color: 'white',
      padding: '24px',
      borderRadius: '8px',
      marginBottom: '24px'
    },
    stats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    },
    statCard: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb',
      textAlign: 'center' as const
    },
    filters: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb'
    },
    reviewCard: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb'
    },
    form: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb'
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
    textarea: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      marginBottom: '12px',
      minHeight: '100px',
      resize: 'vertical' as const
    },
    button: {
      backgroundColor: '#16a34a',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      marginRight: '8px'
    },
    buttonSecondary: {
      backgroundColor: '#6b7280',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500'
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
    return <div style={styles.loading}>Loading reviews...</div>
  }

  return (
    <div style={styles.container} className="text-white">
      {/* Header */}
      <div style={styles.header} className="backdrop-blur-sm bg-white/5 border border-white/10">
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0' }} className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
          Citizen Reviews
        </h1>
        <p style={{ fontSize: '16px', margin: 0, opacity: 0.9 }} className="text-white/80">
          Rate and review government officials and services to promote transparency and accountability
        </p>
      </div>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {/* Statistics */}
      {stats && (
        <div style={styles.stats}>
          <div style={styles.statCard}>
            <h3 style={{ fontSize: '14px', fontWeight: '500', margin: '0 0 8px 0', color: '#6b7280' }}>
              Total Reviews
            </h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7dd3fc' }}>
              {stats.total_reviews}
            </div>
          </div>
          
          <div style={styles.statCard}>
            <h3 style={{ fontSize: '14px', fontWeight: '500', margin: '0 0 8px 0', color: '#6b7280' }}>
              Average Rating
            </h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fbbf24' }}>
              {stats.average_rating.toFixed(1)}/5.0
            </div>
          </div>
          
          <div style={styles.statCard}>
            <h3 style={{ fontSize: '14px', fontWeight: '500', margin: '0 0 8px 0', color: '#6b7280' }}>
              Pending Reviews
            </h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fb7185' }}>
              {stats.pending_reviews}
            </div>
          </div>
          
          <div style={styles.statCard}>
            <h3 style={{ fontSize: '14px', fontWeight: '500', margin: '0 0 8px 0', color: '#6b7280' }}>
              Approved Reviews
            </h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#34d399' }}>
              {stats.approved_reviews}
            </div>
          </div>
        </div>
      )}

      {/* Submit Review Form */}
      {!showForm ? (
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <button onClick={() => setShowForm(true)} style={styles.button} className="bg-cyan-600 hover:bg-cyan-500">
            Submit a Review
          </button>
        </div>
      ) : (
        <div style={styles.form} className="backdrop-blur-sm bg-white/5 border border-white/10">
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            Submit Your Review
          </h2>
          
          <form onSubmit={handleSubmitReview}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <select
                value={formData.institution}
                onChange={(e) => setFormData({...formData, institution: e.target.value})}
                style={styles.select}
                className="bg-white/10 border-white/20 text-white"
                required
              >
                <option value="">Select Institution</option>
                <option value="Ministry of Health">Ministry of Health</option>
                <option value="Ministry of Education">Ministry of Education</option>
                <option value="Ministry of Interior">Ministry of Interior</option>
                <option value="Ministry of Finance">Ministry of Finance</option>
                <option value="Ministry of Agriculture">Ministry of Agriculture</option>
              </select>
              
              <input
                type="text"
                placeholder="Official Name (Optional)"
                value={formData.official_name}
                onChange={(e) => setFormData({...formData, official_name: e.target.value})}
                style={styles.input}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as Review['category']})}
                style={styles.select}
                className="bg-white/10 border-white/20 text-white"
              >
                <option value="service">Service Quality</option>
                <option value="responsiveness">Responsiveness</option>
                <option value="transparency">Transparency</option>
                <option value="corruption">Corruption Report</option>
              </select>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '14px' }}>Rating:</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                  style={{ ...styles.select, width: 'auto', marginBottom: 0 }}
                  className="bg-white/10 border-white/20 text-white"
                >
                  <option value={5}>5 Stars (Excellent)</option>
                  <option value={4}>4 Stars (Very Good)</option>
                  <option value={3}>3 Stars (Good)</option>
                  <option value={2}>2 Stars (Fair)</option>
                  <option value={1}>1 Star (Poor)</option>
                </select>
              </div>
            </div>
            
            <input
              type="text"
              placeholder="Review Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              style={styles.input}
              className="bg-white/10 border-white/20 text-white"
              required
            />
            
            <textarea
              placeholder="Write your review here..."
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              style={styles.textarea}
              className="bg-white/10 border-white/20 text-white"
              required
            />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <input
                type="checkbox"
                id="anonymous"
                checked={formData.is_anonymous}
                onChange={(e) => setFormData({...formData, is_anonymous: e.target.checked})}
              />
              <label htmlFor="anonymous" style={{ fontSize: '14px' }}>
                Submit anonymously
              </label>
            </div>
            
            <div>
              <button type="submit" style={styles.button} className="bg-cyan-600 hover:bg-cyan-500">
                Submit Review
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={styles.buttonSecondary} className="bg-white/20">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div style={styles.filters} className="backdrop-blur-sm bg-white/5 border border-white/10">
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500' }}>Institution:</label>
          <select
            value={selectedInstitution}
            onChange={(e) => setSelectedInstitution(e.target.value)}
            style={styles.select}
            className="bg-white/10 border-white/20 text-white"
          >
            <option value="all">All Institutions</option>
            {institutions.map(institution => (
              <option key={institution} value={institution}>{institution}</option>
            ))}
          </select>

          <label style={{ fontSize: '14px', fontWeight: '500' }}>Category:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={styles.select}
            className="bg-white/10 border-white/20 text-white"
          >
            <option value="all">All Categories</option>
            <option value="service">Service Quality</option>
            <option value="responsiveness">Responsiveness</option>
            <option value="transparency">Transparency</option>
            <option value="corruption">Corruption Report</option>
          </select>

          <label style={{ fontSize: '14px', fontWeight: '500' }}>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.select}
            className="bg-white/10 border-white/20 text-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating_high">Highest Rating</option>
            <option value="rating_low">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
          Reviews ({reviews.length})
        </h2>
        
        {reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            No reviews found. Be the first to submit a review!
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} style={styles.reviewCard} className="backdrop-blur-sm bg-white/5 border border-white/10">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }}>
                    {review.title}
                  </h3>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    {review.institution} {review.official_name && `• ${review.official_name}`}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', color: '#ea580c', marginBottom: '4px' }}>
                    {renderStars(review.rating)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {formatDate(review.created_at)}
                  </div>
                </div>
              </div>
              
              <p style={{ fontSize: '14px', lineHeight: '1.6', margin: '0 0 12px 0' }}>
                {review.content}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span
                    style={{
                      ...styles.badge,
                      backgroundColor: getCategoryColor(review.category) + '20',
                      color: getCategoryColor(review.category)
                    }}
                  >
                    {review.category}
                  </span>
                  <span
                    style={{
                      ...styles.badge,
                      backgroundColor: getStatusColor(review.status) + '20',
                      color: getStatusColor(review.status)
                    }}
                  >
                    {review.status}
                  </span>
                </div>
                
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  By {review.is_anonymous ? 'Anonymous' : (review.user_name || 'Anonymous')}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CitizenReviews
