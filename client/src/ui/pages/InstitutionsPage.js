import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Paper, Stack, TextField, Typography, Grid, Card, CardContent, Chip, Box, Alert, CircularProgress } from '@mui/material';
// Removed icons to prevent blank page issues
import axios from 'axios';
export const InstitutionsPage = () => {
    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const loadInstitutions = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/v1/gov/institutions');
            setInstitutions(response.data);
        }
        catch (err) {
            setError('Failed to load institutions');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadInstitutions();
    }, []);
    const filteredInstitutions = institutions.filter(inst => inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.type.toLowerCase().includes(searchTerm.toLowerCase()));
    const getTypeColor = (type) => {
        switch (type.toLowerCase()) {
            case 'ministry': return 'primary';
            case 'agency': return 'secondary';
            case 'department': return 'success';
            case 'office': return 'warning';
            default: return 'default';
        }
    };
    if (loading) {
        return (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }, children: _jsx(CircularProgress, {}) }));
    }
    return (_jsxs(Stack, { spacing: 3, children: [_jsx(Typography, { variant: "h4", sx: { color: 'primary.main' }, children: "Government Institutions Directory" }), _jsx(Typography, { variant: "body1", color: "text.secondary", children: "Browse and search through Morocco's government institutions and departments." }), _jsx(Paper, { sx: { p: 2 }, children: _jsx(TextField, { fullWidth: true, label: "Search institutions...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: "Search by name, code, or type..." }) }), error && (_jsx(Alert, { severity: "error", children: error })), _jsxs(Grid, { container: true, spacing: 2, sx: { mb: 2 }, children: [_jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", color: "primary", children: "Total Institutions" }), _jsx(Typography, { variant: "h4", sx: { fontWeight: 'bold' }, children: institutions.length })] }) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", color: "secondary", children: "Ministries" }), _jsx(Typography, { variant: "h4", sx: { fontWeight: 'bold' }, children: institutions.filter(i => i.type.toLowerCase() === 'ministry').length })] }) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", color: "success.main", children: "Agencies" }), _jsx(Typography, { variant: "h4", sx: { fontWeight: 'bold' }, children: institutions.filter(i => i.type.toLowerCase() === 'agency').length })] }) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", color: "warning.main", children: "Departments" }), _jsx(Typography, { variant: "h4", sx: { fontWeight: 'bold' }, children: institutions.filter(i => i.type.toLowerCase() === 'department').length })] }) }) })] }), _jsx(Grid, { container: true, spacing: 3, children: filteredInstitutions.map((institution) => (_jsx(Grid, { item: true, xs: 12, sm: 6, md: 4, children: _jsx(Card, { sx: { height: '100%', display: 'flex', flexDirection: 'column' }, children: _jsxs(CardContent, { sx: { flexGrow: 1 }, children: [_jsx(Typography, { variant: "h6", sx: { fontWeight: 'bold', mb: 2 }, children: institution.name }), _jsxs(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 2 }, children: ["Code: ", institution.code] }), _jsx(Chip, { label: institution.type, color: getTypeColor(institution.type), size: "small", sx: { mb: 2 } }), institution.description && (_jsx(Typography, { variant: "body2", sx: { mb: 2 }, children: institution.description })), _jsxs(Stack, { spacing: 1, children: [institution.address && (_jsxs(Typography, { variant: "caption", color: "text.secondary", children: ["\uD83D\uDCCD ", institution.address] })), institution.phone && (_jsxs(Typography, { variant: "caption", color: "text.secondary", children: ["\uD83D\uDCDE ", institution.phone] })), institution.email && (_jsxs(Typography, { variant: "caption", color: "text.secondary", children: ["\u2709\uFE0F ", institution.email] }))] })] }) }) }, institution.id))) }), filteredInstitutions.length === 0 && !loading && (_jsxs(Paper, { sx: { p: 4, textAlign: 'center' }, children: [_jsx(Typography, { variant: "h6", color: "text.secondary", children: "No institutions found" }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Try adjusting your search terms" })] }))] }));
};
