import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import axios from 'axios';
const BudgetTransparency = () => {
    const [budgetData, setBudgetData] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMinistry, setSelectedMinistry] = useState('all');
    const [selectedRegion, setSelectedRegion] = useState('national');
    const [sortBy, setSortBy] = useState('amount_desc');
    const loadBudgetData = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            params.append('year', selectedYear.toString());
            if (selectedMinistry !== 'all') {
                params.append('ministry', selectedMinistry);
            }
            const response = await axios.get(`/api/v1/budget/items?${params.toString()}`);
            // Handle different response formats
            let budgetItems = response.data;
            if (Array.isArray(budgetItems)) {
                setBudgetData(budgetItems);
            }
            else if (budgetItems && Array.isArray(budgetItems.items)) {
                setBudgetData(budgetItems.items);
            }
            else if (budgetItems && Array.isArray(budgetItems.data)) {
                setBudgetData(budgetItems.data);
            }
            else {
                // Mock data for testing
                const mockBudgetData = [
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
                ];
                setBudgetData(mockBudgetData);
            }
            // Mock summary data
            const mockSummary = {
                total_budget: 7800000000,
                executed_amount: 3300000000,
                pending_amount: 4500000000,
                year: selectedYear,
                ministries_count: 5
            };
            setSummary(mockSummary);
        }
        catch (err) {
            console.error('Budget API Error:', err);
            setError(`Failed to load budget data: ${err.response?.data?.detail || err.message}`);
            // Set mock data on error
            const mockBudgetData = [
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
            ];
            setBudgetData(mockBudgetData);
            const mockSummary = {
                total_budget: 7800000000,
                executed_amount: 3300000000,
                pending_amount: 4500000000,
                year: selectedYear,
                ministries_count: 5
            };
            setSummary(mockSummary);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadBudgetData();
    }, [selectedYear, selectedMinistry]);
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'MAD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'executed': return '#16a34a';
            case 'approved': return '#ea580c';
            case 'pending': return '#dc2626';
            default: return '#6b7280';
        }
    };
    const ministries = [...new Set(budgetData.map(item => item.ministry))];
    const filteredDataBase = selectedMinistry === 'all'
        ? budgetData
        : budgetData.filter(item => item.ministry === selectedMinistry);
    const filteredData = [...filteredDataBase].sort((a, b) => {
        if (sortBy === 'amount_desc')
            return b.amount - a.amount;
        if (sortBy === 'amount_asc')
            return a.amount - b.amount;
        return a.ministry.localeCompare(b.ministry);
    });
    const totalAmount = filteredData.reduce((sum, item) => sum + item.amount, 0);
    const executedAmount = filteredData
        .filter(item => item.status === 'executed')
        .reduce((sum, item) => sum + item.amount, 0);
    // Aggregate by category for donut-like breakdown
    const categoryTotals = filteredData.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.amount;
        return acc;
    }, {});
    const categoryEntries = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    const categoryTotalAll = Object.values(categoryTotals).reduce((s, v) => s + v, 0);
    // Simple trend mock (spending vs revenue vs deficit%) for last 5y
    const trendYears = [selectedYear - 4, selectedYear - 3, selectedYear - 2, selectedYear - 1, selectedYear];
    const trendSpending = [240, 255, 270, 282, 286].map(b => b * 1000000000); // MAD millions -> normalize
    const trendRevenue = [220, 238, 255, 270, 275].map(b => b * 1000000000);
    const trendDeficitPct = [-4.1, -4.0, -3.8, -3.9, -3.9];
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
            textAlign: 'center'
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
            textAlign: 'left'
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
            textTransform: 'uppercase'
        },
        loading: {
            textAlign: 'center',
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
    };
    if (loading) {
        return _jsx("div", { style: styles.loading, children: "Loading budget data..." });
    }
    return (_jsxs("div", { style: styles.container, children: [_jsxs("div", { style: styles.header, children: [_jsx("h1", { style: { fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0' }, children: "Budget Transparency" }), _jsx("p", { style: { fontSize: '16px', margin: 0, opacity: 0.9 }, children: "Explore government budget allocations, spending, and financial transparency" })] }), error && (_jsx("div", { style: styles.error, children: error })), _jsx("div", { style: styles.filters, children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }, children: [_jsx("label", { style: { fontSize: '14px', fontWeight: '500' }, children: "Year:" }), _jsxs("select", { value: selectedYear, onChange: (e) => setSelectedYear(parseInt(e.target.value)), style: styles.select, children: [_jsx("option", { value: 2024, children: "2024" }), _jsx("option", { value: 2023, children: "2023" }), _jsx("option", { value: 2022, children: "2022" })] }), _jsx("label", { style: { fontSize: '14px', fontWeight: '500' }, children: "Ministry:" }), _jsxs("select", { value: selectedMinistry, onChange: (e) => setSelectedMinistry(e.target.value), style: styles.select, children: [_jsx("option", { value: "all", children: "All Ministries" }), ministries.map(ministry => (_jsx("option", { value: ministry, children: ministry }, ministry)))] }), _jsx("label", { style: { fontSize: '14px', fontWeight: '500' }, children: "Region:" }), _jsxs("select", { value: selectedRegion, onChange: (e) => setSelectedRegion(e.target.value), style: styles.select, children: [_jsx("option", { value: "national", children: "National" }), _jsx("option", { value: "casablanca", children: "Casablanca-Settat" }), _jsx("option", { value: "rabat", children: "Rabat-Sal\u00E9-K\u00E9nitra" })] }), _jsx("button", { onClick: loadBudgetData, style: styles.button, children: "Refresh Data" }), _jsx("div", { style: styles.toolbarRight, children: _jsx("span", { style: { color: '#6b7280', fontSize: '12px' }, children: "Data: mock with live hooks" }) })] }) }), _jsxs("div", { style: styles.summary, children: [_jsxs("div", { style: styles.summaryCard, children: [_jsx("h3", { style: { fontSize: '14px', fontWeight: '500', margin: '0 0 8px 0', color: '#6b7280' }, children: "Total Budget" }), _jsx("div", { style: { fontSize: '24px', fontWeight: 'bold', color: '#ea580c' }, children: formatCurrency(totalAmount) })] }), _jsxs("div", { style: styles.summaryCard, children: [_jsx("h3", { style: { fontSize: '14px', fontWeight: '500', margin: '0 0 8px 0', color: '#6b7280' }, children: "Executed Amount" }), _jsx("div", { style: { fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }, children: formatCurrency(executedAmount) }), _jsx("div", { style: styles.progressBar, children: _jsx("div", { style: {
                                        ...styles.progressFill,
                                        width: `${totalAmount > 0 ? (executedAmount / totalAmount) * 100 : 0}%`
                                    } }) })] }), _jsxs("div", { style: styles.summaryCard, children: [_jsx("h3", { style: { fontSize: '14px', fontWeight: '500', margin: '0 0 8px 0', color: '#6b7280' }, children: "Remaining Budget" }), _jsx("div", { style: { fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }, children: formatCurrency(totalAmount - executedAmount) })] }), _jsxs("div", { style: styles.summaryCard, children: [_jsx("h3", { style: { fontSize: '14px', fontWeight: '500', margin: '0 0 8px 0', color: '#6b7280' }, children: "Programs" }), _jsx("div", { style: { fontSize: '24px', fontWeight: 'bold', color: '#7c3aed' }, children: filteredData.length })] })] }), _jsxs("div", { style: { ...styles.chartContainer, ...styles.twoCol }, children: [_jsxs("div", { children: [_jsx("h2", { style: { fontSize: '18px', fontWeight: '600', marginBottom: '8px' }, children: "Spending vs Revenue (last 5 years)" }), trendYears.map((y, idx) => {
                                const spend = trendSpending[idx];
                                const rev = trendRevenue[idx];
                                const max = Math.max(spend, rev);
                                return (_jsxs("div", { style: { marginBottom: '8px' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280' }, children: [_jsx("span", { children: y }), _jsxs("span", { children: ["Spend ", formatCurrency(spend), " \u2022 Rev ", formatCurrency(rev)] })] }), _jsxs("div", { style: { display: 'flex', gap: '6px' }, children: [_jsx("div", { style: { ...styles.progressBar, height: '10px' }, children: _jsx("div", { style: { ...styles.progressFill, width: `${(spend / max) * 100}%`, backgroundColor: '#ea580c' } }) }), _jsx("div", { style: { ...styles.progressBar, height: '10px' }, children: _jsx("div", { style: { ...styles.progressFill, width: `${(rev / max) * 100}%`, backgroundColor: '#2563eb' } }) })] })] }, y));
                            }), _jsxs("div", { style: { marginTop: '12px', fontSize: '12px', color: '#6b7280' }, children: ["Deficit % GDP: ", trendDeficitPct.map((d, i) => (_jsxs("span", { style: { marginRight: '8px' }, children: [trendYears[i], ": ", d, "%"] }, i)))] })] }), _jsxs("div", { children: [_jsx("h2", { style: { fontSize: '18px', fontWeight: '600', marginBottom: '8px' }, children: "Expenditure by Category" }), categoryEntries.map(([cat, val]) => {
                                const pct = categoryTotalAll > 0 ? (val / categoryTotalAll) * 100 : 0;
                                return (_jsxs("div", { style: { marginBottom: '10px' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280' }, children: [_jsx("span", { children: cat }), _jsxs("span", { children: [pct.toFixed(1), "%"] })] }), _jsx("div", { style: styles.progressBar, children: _jsx("div", { style: { ...styles.progressFill, width: `${pct}%`, backgroundColor: '#2563eb' } }) })] }, cat));
                            })] })] }), _jsxs("div", { style: styles.chartContainer, children: [_jsxs("h2", { style: { fontSize: '18px', fontWeight: '600', marginBottom: '8px' }, children: ["Budget by Ministry (", selectedYear, ")"] }), _jsx("div", { style: { display: 'grid', gap: '12px' }, children: ministries.map((m) => {
                            const amt = filteredDataBase.filter(i => i.ministry === m).reduce((s, i) => s + i.amount, 0);
                            const pct = totalAmount > 0 ? (amt / totalAmount) * 100 : 0;
                            return (_jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }, children: [_jsx("strong", { children: m }), _jsxs("span", { style: { color: '#6b7280' }, children: [formatCurrency(amt), " (", pct.toFixed(1), "%)"] })] }), _jsx("div", { style: styles.progressBar, children: _jsx("div", { style: { ...styles.progressFill, width: `${pct}%`, backgroundColor: '#ea580c' } }) })] }, m));
                        }) })] }), _jsxs("div", { style: styles.table, children: [_jsx("div", { style: styles.tableHeader, children: _jsxs("h2", { style: { fontSize: '18px', fontWeight: '600', margin: 0 }, children: ["Budget Programs (", filteredData.length, " items)"] }) }), _jsxs("div", { style: styles.tableHeaderRow, children: [_jsx("div", { children: _jsx("button", { style: styles.thButton, onClick: () => setSortBy('ministry_asc'), children: "Ministry" }) }), _jsx("div", { children: "Program" }), _jsx("div", { children: _jsxs("button", { style: styles.thButton, onClick: () => setSortBy(sortBy === 'amount_desc' ? 'amount_asc' : 'amount_desc'), children: ["Amount ", sortBy === 'amount_desc' ? '↓' : sortBy === 'amount_asc' ? '↑' : ''] }) }), _jsx("div", { children: "Category" }), _jsx("div", { children: "Status" })] }), filteredData.map((item) => (_jsxs("div", { style: styles.tableRow, children: [_jsx("div", { style: { fontSize: '14px', fontWeight: '500' }, children: item.ministry }), _jsx("div", { style: { fontSize: '14px' }, children: item.program }), _jsx("div", { style: { fontSize: '14px', fontWeight: '500', color: '#ea580c' }, children: formatCurrency(item.amount) }), _jsx("div", { style: { fontSize: '14px', color: '#6b7280' }, children: item.category }), _jsx("div", { children: _jsx("span", { style: {
                                        ...styles.statusBadge,
                                        backgroundColor: getStatusColor(item.status) + '20',
                                        color: getStatusColor(item.status)
                                    }, children: item.status }) })] }, item.id)))] }), _jsxs("div", { style: styles.chartContainer, children: [_jsx("h2", { style: { fontSize: '18px', fontWeight: '600', marginBottom: '8px' }, children: "Insights" }), _jsxs("ul", { style: { margin: 0, paddingLeft: '18px', color: '#374151', fontSize: '14px' }, children: [_jsxs("li", { children: ["Top ministry by allocation: ", ministries.slice(0, 1)[0] || 'N/A'] }), _jsxs("li", { children: ["Execution rate: ", totalAmount > 0 ? ((executedAmount / totalAmount) * 100).toFixed(1) : '0', "%"] }), _jsx("li", { children: "Deficit (latest est.): \u22123.9% of GDP" })] })] })] }));
};
export default BudgetTransparency;
