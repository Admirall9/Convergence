import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBudgetStore } from './budgetStore'
import BudgetChart from './BudgetChart'

export const BudgetDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { year, setYear, region, setRegion, ministry, setMinistry, loading, error, data, load } = useBudgetStore()

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Year</label>
          <input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value || '0', 10))} className="border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Region</label>
          <input type="text" value={region || ''} onChange={(e) => setRegion(e.target.value || undefined)} className="border rounded px-3 py-2" placeholder="All" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ministry</label>
          <input type="text" value={ministry || ''} onChange={(e) => setMinistry(e.target.value || undefined)} className="border rounded px-3 py-2" placeholder="All" />
        </div>
        <button onClick={load} className="px-4 py-2 bg-blue-600 text-white rounded">Apply</button>
      </div>

      {loading && <div>Loading spending data…</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && !error && <BudgetChart data={data} />}

      {/* Example action to integrate with reviews */}
      <div>
        <button onClick={() => navigate('/reviews')} className="px-4 py-2 border rounded">Go to Citizen Reviews</button>
      </div>
    </div>
  )
}

export default BudgetDashboard


