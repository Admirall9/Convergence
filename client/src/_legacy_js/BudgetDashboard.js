import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBudgetStore } from './budgetStore';
import BudgetChart from './BudgetChart';
export const BudgetDashboard = () => {
    const navigate = useNavigate();
    const { year, setYear, region, setRegion, ministry, setMinistry, loading, error, data, load } = useBudgetStore();
    useEffect(() => { load(); }, []);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-wrap gap-4 items-end", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Year" }), _jsx("input", { type: "number", value: year, onChange: (e) => setYear(parseInt(e.target.value || '0', 10)), className: "border rounded px-3 py-2" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Region" }), _jsx("input", { type: "text", value: region || '', onChange: (e) => setRegion(e.target.value || undefined), className: "border rounded px-3 py-2", placeholder: "All" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Ministry" }), _jsx("input", { type: "text", value: ministry || '', onChange: (e) => setMinistry(e.target.value || undefined), className: "border rounded px-3 py-2", placeholder: "All" })] }), _jsx("button", { onClick: load, className: "px-4 py-2 bg-blue-600 text-white rounded", children: "Apply" })] }), loading && _jsx("div", { children: "Loading spending data\u2026" }), error && _jsx("div", { className: "text-red-600", children: error }), !loading && !error && _jsx(BudgetChart, { data: data }), _jsx("div", { children: _jsx("button", { onClick: () => navigate('/reviews'), className: "px-4 py-2 border rounded", children: "Go to Citizen Reviews" }) })] }));
};
export default BudgetDashboard;
