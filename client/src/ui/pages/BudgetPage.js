import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { TrendingUp, TrendingDown, AccountBalance, Search, FilterList } from '@mui/icons-material';
const BudgetPage = () => {
    const [budgetData, setBudgetData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState(2024);
    const [selectedCategory, setSelectedCategory] = useState('');
    useEffect(() => {
        // Simulate loading budget data from API
        setTimeout(() => {
            setBudgetData([
                {
                    id: 1,
                    institution: "Ministry of Interior",
                    category: "Security",
                    program: "National Security Program",
                    amount: 15000000000,
                    year: 2024,
                    status: "Active"
                },
                {
                    id: 2,
                    institution: "Ministry of Justice",
                    category: "Legal System",
                    program: "Judicial Reform",
                    amount: 8500000000,
                    year: 2024,
                    status: "Active"
                },
                {
                    id: 3,
                    institution: "Ministry of Economy and Finance",
                    category: "Economic Development",
                    program: "Infrastructure Development",
                    amount: 25000000000,
                    year: 2024,
                    status: "Active"
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ar-MA', {
            style: 'currency',
            currency: 'MAD',
            minimumFractionDigits: 0,
        }).format(amount);
    };
    const totalBudget = budgetData.reduce((sum, item) => sum + item.amount, 0);
    const filteredData = budgetData.filter(item => {
        const matchesSearch = item.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.program.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesYear = item.year === selectedYear;
        const matchesCategory = !selectedCategory || item.category === selectedCategory;
        return matchesSearch && matchesYear && matchesCategory;
    });
    return (_jsxs(Box, { sx: { maxWidth: 1400, mx: 'auto', p: 3 }, children: [_jsx(Typography, { variant: "h4", gutterBottom: true, sx: { mb: 4, color: 'primary.main' }, children: "Budget Transparency" }), _jsxs(Grid, { container: true, spacing: 3, sx: { mb: 4 }, children: [_jsx(Grid, { item: true, xs: 12, md: 3, children: _jsx(Card, { sx: { boxShadow: 2 }, children: _jsxs(CardContent, { children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 1 }, children: [_jsx(AccountBalance, { color: "primary", sx: { mr: 1 } }), _jsx(Typography, { variant: "h6", color: "primary", children: "Total Budget" })] }), _jsx(Typography, { variant: "h4", sx: { fontWeight: 'bold' }, children: formatCurrency(totalBudget) }), _jsxs(Typography, { variant: "body2", color: "text.secondary", children: [selectedYear, " Fiscal Year"] })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 3, children: _jsx(Card, { sx: { boxShadow: 2 }, children: _jsxs(CardContent, { children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 1 }, children: [_jsx(TrendingUp, { color: "success", sx: { mr: 1 } }), _jsx(Typography, { variant: "h6", color: "success.main", children: "Active Programs" })] }), _jsx(Typography, { variant: "h4", sx: { fontWeight: 'bold' }, children: budgetData.filter(item => item.status === 'Active').length }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Currently funded" })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 3, children: _jsx(Card, { sx: { boxShadow: 2 }, children: _jsxs(CardContent, { children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 1 }, children: [_jsx(TrendingDown, { color: "warning", sx: { mr: 1 } }), _jsx(Typography, { variant: "h6", color: "warning.main", children: "Institutions" })] }), _jsx(Typography, { variant: "h4", sx: { fontWeight: 'bold' }, children: new Set(budgetData.map(item => item.institution)).size }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "With budget allocations" })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 3, children: _jsx(Card, { sx: { boxShadow: 2 }, children: _jsxs(CardContent, { children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 1 }, children: [_jsx(FilterList, { color: "info", sx: { mr: 1 } }), _jsx(Typography, { variant: "h6", color: "info.main", children: "Categories" })] }), _jsx(Typography, { variant: "h4", sx: { fontWeight: 'bold' }, children: new Set(budgetData.map(item => item.category)).size }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Budget categories" })] }) }) })] }), _jsxs(Paper, { sx: { p: 3, mb: 3 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Search & Filter" }), _jsxs(Grid, { container: true, spacing: 2, alignItems: "center", children: [_jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(TextField, { fullWidth: true, label: "Search institutions or programs", variant: "outlined", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), InputProps: {
                                        startAdornment: _jsx(Search, { sx: { mr: 1, color: 'text.secondary' } })
                                    } }) }), _jsx(Grid, { item: true, xs: 12, md: 3, children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "Year" }), _jsxs(Select, { value: selectedYear, label: "Year", onChange: (e) => setSelectedYear(Number(e.target.value)), children: [_jsx(MenuItem, { value: 2024, children: "2024" }), _jsx(MenuItem, { value: 2023, children: "2023" }), _jsx(MenuItem, { value: 2022, children: "2022" })] })] }) }), _jsx(Grid, { item: true, xs: 12, md: 3, children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "Category" }), _jsxs(Select, { value: selectedCategory, label: "Category", onChange: (e) => setSelectedCategory(e.target.value), children: [_jsx(MenuItem, { value: "", children: "All Categories" }), _jsx(MenuItem, { value: "Security", children: "Security" }), _jsx(MenuItem, { value: "Legal System", children: "Legal System" }), _jsx(MenuItem, { value: "Economic Development", children: "Economic Development" }), _jsx(MenuItem, { value: "Education", children: "Education" }), _jsx(MenuItem, { value: "Healthcare", children: "Healthcare" })] })] }) }), _jsx(Grid, { item: true, xs: 12, md: 2, children: _jsx(Button, { variant: "outlined", fullWidth: true, onClick: () => {
                                        setSearchTerm('');
                                        setSelectedCategory('');
                                        setSelectedYear(2024);
                                    }, children: "Clear Filters" }) })] })] }), _jsx(Paper, { sx: { boxShadow: 2 }, children: _jsx(TableContainer, { children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsx("strong", { children: "Institution" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Category" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Program" }) }), _jsx(TableCell, { align: "right", children: _jsx("strong", { children: "Amount" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Status" }) })] }) }), _jsx(TableBody, { children: loading ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 5, align: "center", children: _jsx(Typography, { children: "Loading budget data..." }) }) })) : filteredData.length === 0 ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 5, align: "center", children: _jsx(Typography, { color: "text.secondary", children: "No budget data found matching your criteria" }) }) })) : (filteredData.map((item) => (_jsxs(TableRow, { hover: true, children: [_jsx(TableCell, { children: _jsx(Typography, { variant: "subtitle2", children: item.institution }) }), _jsx(TableCell, { children: _jsx(Chip, { label: item.category, size: "small", color: "primary", variant: "outlined" }) }), _jsx(TableCell, { children: _jsx(Typography, { variant: "body2", children: item.program }) }), _jsx(TableCell, { align: "right", children: _jsx(Typography, { variant: "subtitle1", sx: { fontWeight: 'bold' }, children: formatCurrency(item.amount) }) }), _jsx(TableCell, { children: _jsx(Chip, { label: item.status, size: "small", color: item.status === 'Active' ? 'success' : 'default' }) })] }, item.id)))) })] }) }) }), filteredData.length > 0 && (_jsx(Box, { sx: { mt: 2, textAlign: 'center' }, children: _jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["Showing ", filteredData.length, " of ", budgetData.length, " budget items"] }) }))] }));
};
export default BudgetPage;
