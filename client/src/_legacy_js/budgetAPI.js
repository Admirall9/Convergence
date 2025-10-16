import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
export async function fetchSpendingAggregate(year, region, ministry) {
    const params = { year };
    if (region)
        params.region = region;
    if (ministry)
        params.ministry = ministry;
    const url = `${API_BASE}/api/spending/aggregate`;
    const res = await axios.get(url, { params });
    return res.data;
}
