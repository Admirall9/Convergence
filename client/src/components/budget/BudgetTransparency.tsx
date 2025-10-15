import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface BudgetItem {
  id: number
  ministry: string
  program: string
  amount: number
  year: number
  category: string
  status: 'approved' | 'pending' | 'executed'
}

interface BudgetSummary {
  total_budget: number
  executed_amount: number
  pending_amount: number
  year: number
  ministries_count: number
}

const BudgetTransparency: React.FC = () => {
  const [budgetData, setBudgetData] = useState<BudgetItem[]>([])
  const [summary, setSummary] = useState<BudgetSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMinistry, setSelectedMinistry] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState('national')
  const [sortBy, setSortBy] = useState<'amount_desc' | 'amount_asc' | 'ministry_asc'>('amount_desc')

  const loadBudgetData = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.append('year', selectedYear.toString())
      if (selectedMinistry !== 'all') {
        params.append('ministry', selectedMinistry)
      }
      
      const response = await axios.get(`/api/v1/budget/items?${params.toString()}`)
      
      // Handle different response formats
      let budgetItems = response.data
      if (Array.isArray(budgetItems)) {
        setBudgetData(budgetItems)
      } else if (budgetItems && Array.isArray(budgetItems.items)) {
        setBudgetData(budgetItems.items)
      } else if (budgetItems && Array.isArray(budgetItems.data)) {
        setBudgetData(budgetItems.data)
      } else {
        // Mock data for testing
        const mockBudgetData: BudgetItem[] = [
          {
            id: 1,
            ministry: 'Ministry of Health',
            program: 'Public Health Infrastructure',
            amount: 2500000000,
            year: 2024,
            category: 'Infrastructure',
            status: 'executed'
          },
          {
            id: 2,
            ministry: 'Ministry of Education',
            program: 'Digital Learning Initiative',
            amount: 1800000000,
            year: 2024,
            category: 'Education',
            status: 'approved'
          },
          {
            id: 3,
            ministry: 'Ministry of Interior',
            program: 'Digital Government Services',
            amount: 1200000000,
            year: 2024,
            category: 'Technology',
            status: 'pending'
          },
          {
            id: 4,
            ministry: 'Ministry of Finance',
            program: 'Tax System Modernization',
            amount: 800000000,
            year: 2024,
            category: 'Technology',
            status: 'executed'
          },
          {
            id: 5,
            ministry: 'Ministry of Agriculture',
            program: 'Sustainable Farming Initiative',
            amount: 1500000000,
            year: 2024,
            category: 'Agriculture',
            status: 'approved'
          }
        ]
        setBudgetData(mockBudgetData)
      }

      // Mock summary data
      const mockSummary: BudgetSummary = {
        total_budget: 7800000000,
        executed_amount: 3300000000,
        pending_amount: 4500000000,
        year: selectedYear,
        ministries_count: 5
      }
      setSummary(mockSummary)
      
    } catch (err: any) {
      console.error('Budget API Error:', err)
      setError(`Failed to load budget data: ${err.response?.data?.detail || err.message}`)
      
      // Set mock data on error
      const mockBudgetData: BudgetItem[] = [
        {
          id: 1,
          ministry: 'Ministry of Health',
          program: 'Public Health Infrastructure',
          amount: 2500000000,
          year: 2024,
          category: 'Infrastructure',
          status: 'executed'
        },
        {
          id: 2,
          ministry: 'Ministry of Education',
          program: 'Digital Learning Initiative',
          amount: 1800000000,
          year: 2024,
          category: 'Education',
          status: 'approved'
        }
      ]
      setBudgetData(mockBudgetData)
      
      const mockSummary: BudgetSummary = {
        total_budget: 7800000000,
        executed_amount: 3300000000,
        pending_amount: 4500000000,
        year: selectedYear,
        ministries_count: 5
      }
      setSummary(mockSummary)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBudgetData()
  }, [selectedYear, selectedMinistry])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'executed': return '#16a34a'
      case 'approved': return '#ea580c'
      case 'pending': return '#dc2626'
      default: return '#6b7280'
    }
  }

  const ministries = [...new Set(budgetData.map(item => item.ministry))]
  const filteredDataBase = selectedMinistry === 'all' 
    ? budgetData 
    : budgetData.filter(item => item.ministry === selectedMinistry)

  const filteredData = [...filteredDataBase].sort((a, b) => {
    if (sortBy === 'amount_desc') return b.amount - a.amount
    if (sortBy === 'amount_asc') return a.amount - b.amount
    return a.ministry.localeCompare(b.ministry)
  })

  const totalAmount = filteredData.reduce((sum, item) => sum + item.amount, 0)
  const executedAmount = filteredData
    .filter(item => item.status === 'executed')
    .reduce((sum, item) => sum + item.amount, 0)

  // Aggregate by category for donut-like breakdown
  const categoryTotals = filteredData.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount
    return acc
  }, {})
  const categoryEntries = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])
  const categoryTotalAll = Object.values(categoryTotals).reduce((s, v) => s + v, 0)

  // Simple trend mock (spending vs revenue vs deficit%) for last 5y
  const trendYears = [selectedYear - 4, selectedYear - 3, selectedYear - 2, selectedYear - 1, selectedYear]
  const trendSpending = [240, 255, 270, 282, 286].map(b => b * 1_000_000_000) // MAD millions -> normalize
  const trendRevenue = [220, 238, 255, 270, 275].map(b => b * 1_000_000_000)
  const trendDeficitPct = [ -4.1, -4.0, -3.8, -3.9, -3.9 ]

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    },
    header: {
      backgroundColor: '#ea580c',
      color: 'white',
      padding: '24px',
      borderRadius: '8px',
      marginBottom: '24px'
    },
    filters: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb'
    },
    toolbarRight: {
      marginLeft: 'auto'
    },
    summary: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    },
    summaryCard: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb',
      textAlign: 'center' as const
    },
    chartContainer: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb'
    },
    twoCol: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px'
    },
    table: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb',
      overflow: 'hidden'
    },
    tableHeader: {
      backgroundColor: '#f9fafb',
      padding: '16px',
      borderBottom: '1px solid #e5e7eb'
    },
    tableRow: {
      padding: '16px',
      borderBottom: '1px solid #e5e7eb',
      display: 'grid',
      gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr',
      gap: '16px',
      alignItems: 'center'
    },
    tableHeaderRow: {
      padding: '16px',
      borderBottom: '1px solid #e5e7eb',
      display: 'grid',
      gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr',
      gap: '16px',
      alignItems: 'center',
      backgroundColor: '#f9fafb',
      fontWeight: '600',
      fontSize: '14px',
      color: '#374151'
    },
    thButton: {
      background: 'transparent',
      border: 'none',
      padding: 0,
      margin: 0,
      color: '#374151',
      cursor: 'pointer',
      textAlign: 'left' as const
    },
    input: {
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      marginRight: '12px'
    },
    select: {
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      marginRight: '12px',
      backgroundColor: 'white'
    },
    button: {
      backgroundColor: '#ea580c',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500'
    },
    badge: {
      display: 'inline-block',
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500'
    },
    statusBadge: {
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
    },
    progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: '#e5e7eb',
      borderRadius: '4px',
      overflow: 'hidden',
      marginTop: '8px'
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#16a34a',
      transition: 'width 0.3s ease'
    }
  }

  if (loading) {
    return <div style={styles.loading}>Loading budget data...</div>
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
          Budget Transparency
        </h1>
        <p style={{ fontSize: '16px', margin: 0, opacity: 0.9 }}>
          Explore government budget allocations, spending, and financial transparency
        </p>
      </div>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {/* Filters */}
      <div style={styles.filters}>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500' }}>Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            style={styles.select}
          >
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
            <option value={2022}>2022</option>
          </select>

          <label style={{ fontSize: '14px', fontWeight: '500' }}>Ministry:</label>
          <select
            value={selectedMinistry}
            onChange={(e) => setSelectedMinistry(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Ministries</option>
            {ministries.map(ministry => (
              <option key={ministry} value={ministry}>{ministry}</option>
            ))}
          </select>

          <label style={{ fontSize: '14px', fontWeight: '500' }}>Region:</label>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            style={styles.select}
          >
            <option value="national">National</option>
            <option value="casablanca">Casablanca-Settat</option>
            <option value="rabat">Rabat-Salé-Kénitra</option>
          </select>

          <button onClick={loadBudgetData} style={styles.button}>
            Refresh Data
          </button>

          <div style={styles.toolbarRight}>
            <span style={{ color: '#6b7280', fontSize: '12px' }}>Data: mock with live hooks</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={styles.summary}>
        <div style={styles.summaryCard}>
          <h3 style={{ fontSize: '14px', fontWeight: '500', margin: '0 0 8px 0', color: '#6b7280' }}>
            Total Budget
          </h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ea580c' }}>
            {formatCurrency(totalAmount)}
          </div>
        </div>
        
        <div style={styles.summaryCard}>
          <h3 style={{ fontSize: '14px', fontWeight: '500', margin: '0 0 8px 0', color: '#6b7280' }}>
            Executed Amount
          </h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>
            {formatCurrency(executedAmount)}
          </div>
          <div style={styles.progressBar}>
            <div 
              style={{
                ...styles.progressFill,
                width: `${totalAmount > 0 ? (executedAmount / totalAmount) * 100 : 0}%`
              }}
            />
          </div>
        </div>
        
        <div style={styles.summaryCard}>
          <h3 style={{ fontSize: '14px', fontWeight: '500', margin: '0 0 8px 0', color: '#6b7280' }}>
            Remaining Budget
          </h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>
            {formatCurrency(totalAmount - executedAmount)}
          </div>
        </div>
        
        <div style={styles.summaryCard}>
          <h3 style={{ fontSize: '14px', fontWeight: '500', margin: '0 0 8px 0', color: '#6b7280' }}>
            Programs
          </h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7c3aed' }}>
            {filteredData.length}
          </div>
        </div>
      </div>

      {/* Trends + Category Breakdown */}
      <div style={{ ...styles.chartContainer, ...styles.twoCol }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Spending vs Revenue (last 5 years)</h2>
          {trendYears.map((y, idx) => {
            const spend = trendSpending[idx]
            const rev = trendRevenue[idx]
            const max = Math.max(spend, rev)
            return (
              <div key={y} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280' }}>
                  <span>{y}</span>
                  <span>Spend {formatCurrency(spend)} • Rev {formatCurrency(rev)}</span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <div style={{ ...styles.progressBar, height: '10px' }}>
                    <div style={{ ...styles.progressFill, width: `${(spend / max) * 100}%`, backgroundColor: '#ea580c' }} />
                  </div>
                  <div style={{ ...styles.progressBar, height: '10px' }}>
                    <div style={{ ...styles.progressFill, width: `${(rev / max) * 100}%`, backgroundColor: '#2563eb' }} />
                  </div>
                </div>
              </div>
            )
          })}
          <div style={{ marginTop: '12px', fontSize: '12px', color: '#6b7280' }}>
            Deficit % GDP: {trendDeficitPct.map((d, i) => (
              <span key={i} style={{ marginRight: '8px' }}>{trendYears[i]}: {d}%</span>
            ))}
          </div>
        </div>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Expenditure by Category</h2>
          {categoryEntries.map(([cat, val]) => {
            const pct = categoryTotalAll > 0 ? (val / categoryTotalAll) * 100 : 0
            return (
              <div key={cat} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280' }}>
                  <span>{cat}</span>
                  <span>{pct.toFixed(1)}%</span>
                </div>
                <div style={styles.progressBar}>
                  <div style={{ ...styles.progressFill, width: `${pct}%`, backgroundColor: '#2563eb' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Budget by Ministry (ranked) */}
      <div style={styles.chartContainer}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Budget by Ministry ({selectedYear})</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          {ministries.map((m) => {
            const amt = filteredDataBase.filter(i => i.ministry === m).reduce((s, i) => s + i.amount, 0)
            const pct = totalAmount > 0 ? (amt / totalAmount) * 100 : 0
            return (
              <div key={m}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
                  <strong>{m}</strong>
                  <span style={{ color: '#6b7280' }}>{formatCurrency(amt)} ({pct.toFixed(1)}%)</span>
                </div>
                <div style={styles.progressBar}>
                  <div style={{ ...styles.progressFill, width: `${pct}%`, backgroundColor: '#ea580c' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Detailed Table */}
      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
            Budget Programs ({filteredData.length} items)
          </h2>
        </div>
        
        <div style={styles.tableHeaderRow}>
          <div>
            <button style={styles.thButton} onClick={() => setSortBy('ministry_asc')}>Ministry</button>
          </div>
          <div>Program</div>
          <div>
            <button style={styles.thButton} onClick={() => setSortBy(sortBy === 'amount_desc' ? 'amount_asc' : 'amount_desc')}>
              Amount {sortBy === 'amount_desc' ? '↓' : sortBy === 'amount_asc' ? '↑' : ''}
            </button>
          </div>
          <div>Category</div>
          <div>Status</div>
        </div>
        
        {filteredData.map((item) => (
          <div key={item.id} style={styles.tableRow}>
            <div style={{ fontSize: '14px', fontWeight: '500' }}>
              {item.ministry}
            </div>
            <div style={{ fontSize: '14px' }}>
              {item.program}
            </div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#ea580c' }}>
              {formatCurrency(item.amount)}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              {item.category}
            </div>
            <div>
              <span
                style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusColor(item.status) + '20',
                  color: getStatusColor(item.status)
                }}
              >
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div style={styles.chartContainer}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Insights</h2>
        <ul style={{ margin: 0, paddingLeft: '18px', color: '#374151', fontSize: '14px' }}>
          <li>Top ministry by allocation: {ministries.slice(0,1)[0] || 'N/A'}</li>
          <li>Execution rate: {totalAmount > 0 ? ((executedAmount / totalAmount) * 100).toFixed(1) : '0'}%</li>
          <li>Deficit (latest est.): −3.9% of GDP</li>
        </ul>
      </div>
    </div>
  )
}

export default BudgetTransparency
