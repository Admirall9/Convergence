import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

export async function fetchSpendingAggregate(year: number, region?: string, ministry?: string) {
  const params: Record<string, string | number> = { year }
  if (region) params.region = region
  if (ministry) params.ministry = ministry
  const url = `${API_BASE}/api/spending/aggregate`
  const res = await axios.get(url, { params })
  return res.data
}


