import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Search as SearchIcon, Description as FileTextIcon, CalendarToday as CalendarIcon, LocalOffer as TagIcon, FilterList as FilterIcon } from '@mui/icons-material';
const LegalSearch = ({ onLawSelect }) => {
    const [laws, setLaws] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        query: '',
        from_date: '',
        to_date: '',
        category: '',
    });
    const [categories, setCategories] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        page_size: 25,
        total: 0,
    });
    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);
    // Search laws when filters change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (filters.query || filters.from_date || filters.to_date || filters.category) {
                searchLaws();
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [filters, pagination.page]);
    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/v1/legal/categories');
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        }
        catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };
    const searchLaws = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                page_size: pagination.page_size.toString(),
            });
            if (filters.query)
                params.append('q', filters.query);
            if (filters.from_date)
                params.append('from', filters.from_date);
            if (filters.to_date)
                params.append('to', filters.to_date);
            if (filters.category)
                params.append('category', filters.category);
            const response = await fetch(`/api/v1/legal/laws?${params}`);
            if (!response.ok) {
                throw new Error('Failed to search laws');
            }
            const data = await response.json();
            setLaws(data.items);
            setPagination(prev => ({
                ...prev,
                total: data.total,
            }));
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
        finally {
            setLoading(false);
        }
    };
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };
    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR');
    };
    const getCategoryColor = (category) => {
        const colors = {
            'Labor': 'bg-blue-100 text-blue-800',
            'Tax': 'bg-green-100 text-green-800',
            'Health': 'bg-red-100 text-red-800',
            'Education': 'bg-purple-100 text-purple-800',
            'Environment': 'bg-emerald-100 text-emerald-800',
            'Finance': 'bg-yellow-100 text-yellow-800',
            'Administration': 'bg-gray-100 text-gray-800',
            'Justice': 'bg-indigo-100 text-indigo-800',
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-sm border p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Legal Repository" }), _jsxs("button", { onClick: () => setShowFilters(!showFilters), className: "flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50", children: [_jsx(FilterIcon, { className: "w-4 h-4" }), _jsx("span", { children: "Filters" })] })] }), _jsxs("div", { className: "relative", children: [_jsx(SearchIcon, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" }), _jsx("input", { type: "text", placeholder: "Search laws, articles, or keywords...", value: filters.query, onChange: (e) => handleFilterChange('query', e.target.value), className: "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }), showFilters && (_jsxs("div", { className: "mt-4 grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "From Date" }), _jsx("input", { type: "date", value: filters.from_date, onChange: (e) => handleFilterChange('from_date', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "To Date" }), _jsx("input", { type: "date", value: filters.to_date, onChange: (e) => handleFilterChange('to_date', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Category" }), _jsxs("select", { value: filters.category, onChange: (e) => handleFilterChange('category', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: "", children: "All Categories" }), categories.map((category) => (_jsx("option", { value: category, children: category }, category)))] })] })] }))] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm border", children: [loading && (_jsxs("div", { className: "p-8 text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" }), _jsx("p", { className: "mt-2 text-gray-600", children: "Searching laws..." })] })), error && (_jsxs("div", { className: "p-8 text-center", children: [_jsx("div", { className: "text-red-600 mb-2", children: "Error" }), _jsx("p", { className: "text-gray-600", children: error })] })), !loading && !error && laws.length === 0 && (_jsxs("div", { className: "p-8 text-center", children: [_jsx(FileTextIcon, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "No laws found. Try adjusting your search criteria." })] })), !loading && !error && laws.length > 0 && (_jsxs(_Fragment, { children: [_jsx("div", { className: "p-4 border-b border-gray-200", children: _jsxs("p", { className: "text-sm text-gray-600", children: ["Found ", pagination.total, " laws"] }) }), _jsx("div", { className: "divide-y divide-gray-200", children: laws.map((law) => (_jsx("div", { className: "p-6 hover:bg-gray-50 cursor-pointer transition-colors", onClick: () => onLawSelect?.(law), children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-2", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: law.title }), law.category && (_jsx("span", { className: `px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(law.category)}`, children: law.category }))] }), _jsxs("div", { className: "flex items-center space-x-4 text-sm text-gray-600 mb-3", children: [law.law_number && (_jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(TagIcon, { className: "w-4 h-4" }), _jsx("span", { children: law.law_number })] })), law.publication_date && (_jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(CalendarIcon, { className: "w-4 h-4" }), _jsx("span", { children: formatDate(law.publication_date) })] }))] }), law.effective_date && (_jsxs("p", { className: "text-sm text-gray-600", children: ["Effective: ", formatDate(law.effective_date)] }))] }), law.pdf_url && (_jsx("a", { href: law.pdf_url, target: "_blank", rel: "noopener noreferrer", className: "ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors", onClick: (e) => e.stopPropagation(), children: _jsx(FileTextIcon, { className: "w-5 h-5" }) }))] }) }, law.law_id))) }), pagination.total > pagination.page_size && (_jsx("div", { className: "p-4 border-t border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("p", { className: "text-sm text-gray-600", children: ["Showing ", ((pagination.page - 1) * pagination.page_size) + 1, " to", ' ', Math.min(pagination.page * pagination.page_size, pagination.total), " of", ' ', pagination.total, " results"] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => handlePageChange(pagination.page - 1), disabled: pagination.page === 1, className: "px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed", children: "Previous" }), _jsx("button", { onClick: () => handlePageChange(pagination.page + 1), disabled: pagination.page * pagination.page_size >= pagination.total, className: "px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed", children: "Next" })] })] }) }))] }))] })] }));
};
export default LegalSearch;
