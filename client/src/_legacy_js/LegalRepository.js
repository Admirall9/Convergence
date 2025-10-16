import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { motion } from 'framer-motion';
const LegalRepository = () => {
    const [laws, setLaws] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLaw, setSelectedLaw] = useState(null);
    const [filters, setFilters] = useState({
        dateFrom: '',
        dateTo: '',
        category: '',
        ministry: ''
    });
    const loadLaws = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchTerm)
                params.append('q', searchTerm);
            if (filters.dateFrom)
                params.append('from', filters.dateFrom);
            if (filters.dateTo)
                params.append('to', filters.dateTo);
            if (filters.category)
                params.append('category', filters.category);
            if (filters.ministry)
                params.append('ministry', filters.ministry);
            const response = await apiService.legal.getLaws(params);
            // Handle different response formats
            let lawsData = response.data;
            if (Array.isArray(lawsData)) {
                setLaws(lawsData);
            }
            else if (lawsData && Array.isArray(lawsData.items)) {
                setLaws(lawsData.items);
            }
            else if (lawsData && Array.isArray(lawsData.data)) {
                setLaws(lawsData.data);
            }
            else {
                // Mock data for testing
                const mockLaws = [
                    {
                        law_id: 1,
                        law_number: "12-2024",
                        title: "Loi sur les Services Gouvernementaux Numériques",
                        effective_date: "2024-01-01",
                        issue_date: "2023-12-15",
                        source_url: "https://example.com/law-12-2024",
                        articles: [
                            {
                                article_id: 1,
                                article_number: "1",
                                content: "Cette loi vise à moderniser les services gouvernementaux par la transformation numérique.",
                                law_id: 1
                            },
                            {
                                article_id: 2,
                                article_number: "2",
                                content: "Toutes les institutions gouvernementales doivent fournir des services en ligne dans un délai de 18 mois.",
                                law_id: 1
                            }
                        ]
                    },
                    {
                        law_id: 2,
                        law_number: "08-2023",
                        title: "Loi sur la Protection des Données et la Vie Privée",
                        effective_date: "2023-06-01",
                        issue_date: "2023-05-20",
                        source_url: "https://example.com/law-08-2023",
                        articles: [
                            {
                                article_id: 3,
                                article_number: "1",
                                content: "Cette loi protège les données personnelles et les droits à la vie privée des citoyens.",
                                law_id: 2
                            }
                        ]
                    }
                ];
                setLaws(mockLaws);
            }
        }
        catch (err) {
            console.error('API Error:', err);
            setError(`Échec du chargement des lois: ${err.response?.data?.detail || err.message}`);
            setLaws([]); // Set empty array on error
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadLaws();
    }, [searchTerm, filters]);
    const handleSearch = (e) => {
        e.preventDefault();
        loadLaws();
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    const styles = {
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '32px',
            fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
        },
        header: {
            backgroundColor: '#0066cc',
            color: 'white',
            padding: '32px',
            borderRadius: '16px',
            marginBottom: '32px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
        title: {
            fontSize: '32px',
            fontWeight: 'bold',
            margin: '0 0 8px 0',
            fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
        },
        subtitle: {
            fontSize: '18px',
            margin: 0,
            opacity: 0.9,
            fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
        },
        searchBox: {
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '16px',
            marginBottom: '32px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e9ecef'
        },
        input: {
            width: '100%',
            padding: '16px',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            fontSize: '16px',
            marginBottom: '16px',
            fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif',
            outline: 'none',
            transition: 'border-color 0.2s'
        },
        button: {
            backgroundColor: '#0066cc',
            color: 'white',
            padding: '16px 32px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif',
            transition: 'background-color 0.2s'
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: selectedLaw ? '1fr 1fr' : '1fr',
            gap: '32px'
        },
        lawCard: {
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e9ecef',
            marginBottom: '20px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
        },
        lawCardSelected: {
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 8px 15px rgba(0, 0, 0, 0.15)',
            border: '2px solid #0066cc',
            marginBottom: '20px',
            cursor: 'pointer'
        },
        articleCard: {
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '16px',
            border: '1px solid #e9ecef',
            fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
        },
        loading: {
            textAlign: 'center',
            padding: '64px',
            color: '#636e72',
            fontSize: '18px',
            fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
        },
        error: {
            backgroundColor: '#ffe6e6',
            color: '#e17055',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '24px',
            border: '1px solid #ffb3b3',
            fontSize: '16px',
            fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
        }
    };
    if (loading) {
        return (_jsx("div", { style: styles.container, children: _jsx("div", { style: styles.loading, children: "Chargement des documents l\u00E9gaux..." }) }));
    }
    return (_jsxs("div", { style: styles.container, className: "text-white", children: [_jsxs("div", { style: styles.header, className: "backdrop-blur-sm bg-white/5 border border-white/10", children: [_jsx("h1", { style: styles.title, className: "bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent", children: "R\u00E9pertoire L\u00E9gal" }), _jsx("p", { style: styles.subtitle, className: "text-white/80", children: "Recherchez et parcourez les documents l\u00E9gaux du Maroc depuis le Bulletin Officiel" })] }), error && (_jsx("div", { style: styles.error, children: error })), _jsx("div", { style: styles.searchBox, className: "backdrop-blur-sm bg-white/5 border border-white/10", children: _jsxs("form", { onSubmit: handleSearch, children: [_jsx("input", { type: "text", placeholder: "Rechercher des lois par titre, num\u00E9ro ou mots-cl\u00E9s...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), style: styles.input, className: "bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-300/60" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }, children: [_jsx("input", { type: "date", placeholder: "Date de d\u00E9but", value: filters.dateFrom, onChange: (e) => setFilters({ ...filters, dateFrom: e.target.value }), style: styles.input, className: "bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-300/60" }), _jsx("input", { type: "date", placeholder: "Date de fin", value: filters.dateTo, onChange: (e) => setFilters({ ...filters, dateTo: e.target.value }), style: styles.input, className: "bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-300/60" }), _jsx("input", { type: "text", placeholder: "Cat\u00E9gorie", value: filters.category, onChange: (e) => setFilters({ ...filters, category: e.target.value }), style: styles.input, className: "bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-300/60" }), _jsx("input", { type: "text", placeholder: "Minist\u00E8re", value: filters.ministry, onChange: (e) => setFilters({ ...filters, ministry: e.target.value }), style: styles.input, className: "bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-300/60" })] }), _jsx("button", { type: "submit", style: styles.button, className: "bg-cyan-600 hover:bg-cyan-500", children: "Rechercher des Lois" })] }) }), _jsxs("div", { style: styles.grid, children: [_jsxs("div", { children: [_jsxs("h2", { style: {
                                    fontSize: '24px',
                                    fontWeight: '600',
                                    marginBottom: '24px',
                                    color: '#2d3436',
                                    fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
                                }, children: ["Lois (", laws.length, ")"] }), laws.length === 0 ? (_jsx("div", { style: {
                                    textAlign: 'center',
                                    padding: '64px',
                                    color: '#e5e7eb',
                                    fontSize: '16px',
                                    fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
                                }, children: "Aucune loi trouv\u00E9e. Essayez d'ajuster vos crit\u00E8res de recherche." })) : (laws.map((law, idx) => (_jsxs(motion.div, { style: selectedLaw?.law_id === law.law_id ? styles.lawCardSelected : styles.lawCard, className: "backdrop-blur-sm bg-white/5 border border-white/10", initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.03 * idx, duration: 0.3 }, onClick: () => setSelectedLaw(law), onMouseOver: (e) => {
                                    if (selectedLaw?.law_id !== law.law_id) {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.25)';
                                    }
                                }, onMouseOut: (e) => {
                                    if (selectedLaw?.law_id !== law.law_id) {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                                    }
                                }, children: [_jsxs("h3", { style: {
                                            fontSize: '20px',
                                            fontWeight: '600',
                                            margin: '0 0 12px 0',
                                            color: '#7dd3fc',
                                            fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
                                        }, children: ["Loi ", law.law_number] }), _jsx("h4", { style: {
                                            fontSize: '18px',
                                            fontWeight: '500',
                                            margin: '0 0 16px 0',
                                            color: '#ffffff',
                                            fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
                                        }, children: law.title }), _jsxs("div", { style: {
                                            fontSize: '14px',
                                            color: '#cbd5e1',
                                            marginBottom: '12px',
                                            fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
                                        }, children: [_jsxs("div", { children: ["Entr\u00E9e en vigueur: ", formatDate(law.effective_date)] }), _jsxs("div", { children: ["Date de publication: ", formatDate(law.issue_date)] }), _jsxs("div", { children: ["Articles: ", law.articles?.length || 0] })] }), law.source_url && (_jsx("a", { href: law.source_url, target: "_blank", rel: "noopener noreferrer", style: {
                                            color: '#7dd3fc',
                                            textDecoration: 'none',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
                                        }, children: "Voir la source officielle \u2192" }))] }, law.law_id))))] }), selectedLaw && (_jsxs("div", { children: [_jsxs("h2", { style: {
                                    fontSize: '24px',
                                    fontWeight: '600',
                                    marginBottom: '24px',
                                    color: '#2d3436',
                                    fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
                                }, children: ["Loi ", selectedLaw.law_number, " - Articles"] }), _jsxs("div", { style: {
                                    backgroundColor: 'white',
                                    padding: '32px',
                                    borderRadius: '16px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    border: '1px solid #e9ecef'
                                }, children: [_jsx("h3", { style: {
                                            fontSize: '20px',
                                            fontWeight: '600',
                                            margin: '0 0 12px 0',
                                            color: '#2d3436',
                                            fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
                                        }, children: selectedLaw.title }), _jsxs("p", { style: {
                                            fontSize: '14px',
                                            color: '#636e72',
                                            marginBottom: '24px',
                                            fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
                                        }, children: ["Entr\u00E9e en vigueur: ", formatDate(selectedLaw.effective_date), " | Publication: ", formatDate(selectedLaw.issue_date)] }), _jsxs("div", { children: [_jsxs("h4", { style: {
                                                    fontSize: '18px',
                                                    fontWeight: '600',
                                                    marginBottom: '16px',
                                                    color: '#2d3436',
                                                    fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
                                                }, children: ["Articles (", selectedLaw.articles?.length || 0, ")"] }), selectedLaw.articles && selectedLaw.articles.length > 0 ? (selectedLaw.articles.map((article) => (_jsxs("div", { style: styles.articleCard, children: [_jsxs("h5", { style: {
                                                            fontSize: '16px',
                                                            fontWeight: '600',
                                                            margin: '0 0 12px 0',
                                                            color: '#0066cc',
                                                            fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
                                                        }, children: ["Article ", article.article_number] }), _jsx("p", { style: {
                                                            fontSize: '14px',
                                                            lineHeight: '1.6',
                                                            margin: 0,
                                                            color: '#2d3436',
                                                            fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
                                                        }, children: article.content })] }, article.article_id)))) : (_jsx("p", { style: {
                                                    fontSize: '14px',
                                                    color: '#636e72',
                                                    fontStyle: 'italic',
                                                    fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
                                                }, children: "Aucun article disponible pour cette loi." }))] })] })] }))] })] }));
};
export default LegalRepository;
