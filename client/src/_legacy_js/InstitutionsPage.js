import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
const InstitutionsPage = () => {
    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedInstitution, setSelectedInstitution] = useState(null);
    const loadInstitutions = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchTerm)
                params.append('search', searchTerm);
            if (selectedType !== 'all')
                params.append('type', selectedType);
            const response = await apiService.gov.getInstitutions(params);
            // Handle different response formats
            let institutionsData = response.data;
            if (Array.isArray(institutionsData)) {
                setInstitutions(institutionsData);
            }
            else if (institutionsData && Array.isArray(institutionsData.items)) {
                setInstitutions(institutionsData.items);
            }
            else if (institutionsData && Array.isArray(institutionsData.data)) {
                setInstitutions(institutionsData.data);
            }
            else {
                // Mock data for testing
                const mockInstitutions = [
                    {
                        id: 1,
                        code: 'MIN-HEALTH-001',
                        name: 'Ministry of Health',
                        type: 'Ministry',
                        description: 'Responsible for public health policy, healthcare services, and medical regulation in Morocco.',
                        address: 'Avenue Annakhil, Rabat 10000, Morocco',
                        phone: '+212 537 27 37 37',
                        email: 'contact@sante.gov.ma',
                        website: 'https://www.sante.gov.ma',
                        created_at: '2024-01-01T00:00:00Z',
                        updated_at: '2024-01-15T10:30:00Z'
                    },
                    {
                        id: 2,
                        code: 'MIN-EDU-001',
                        name: 'Ministry of National Education',
                        type: 'Ministry',
                        description: 'Oversees primary, secondary, and higher education systems in Morocco.',
                        address: 'Avenue Allal Ben Abdellah, Rabat 10000, Morocco',
                        phone: '+212 537 77 17 17',
                        email: 'contact@men.gov.ma',
                        website: 'https://www.men.gov.ma',
                        created_at: '2024-01-01T00:00:00Z',
                        updated_at: '2024-01-15T10:30:00Z'
                    },
                    {
                        id: 3,
                        code: 'MIN-INT-001',
                        name: 'Ministry of Interior',
                        type: 'Ministry',
                        description: 'Responsible for internal security, local administration, and civil protection.',
                        address: 'Place Mohammed V, Rabat 10000, Morocco',
                        phone: '+212 537 76 80 80',
                        email: 'contact@interieur.gov.ma',
                        website: 'https://www.interieur.gov.ma',
                        created_at: '2024-01-01T00:00:00Z',
                        updated_at: '2024-01-15T10:30:00Z'
                    },
                    {
                        id: 4,
                        code: 'MIN-FIN-001',
                        name: 'Ministry of Economy and Finance',
                        type: 'Ministry',
                        description: 'Manages national economy, public finances, and economic policy.',
                        address: 'Avenue Mohammed V, Rabat 10000, Morocco',
                        phone: '+212 537 76 85 85',
                        email: 'contact@finances.gov.ma',
                        website: 'https://www.finances.gov.ma',
                        created_at: '2024-01-01T00:00:00Z',
                        updated_at: '2024-01-15T10:30:00Z'
                    },
                    {
                        id: 5,
                        code: 'AGY-DIGITAL-001',
                        name: 'Digital Development Agency',
                        type: 'Agency',
                        parent_id: 4,
                        description: 'Promotes digital transformation and e-government initiatives.',
                        address: 'Avenue Mohammed VI, Rabat 10000, Morocco',
                        phone: '+212 537 77 77 77',
                        email: 'contact@add.gov.ma',
                        website: 'https://www.add.gov.ma',
                        created_at: '2024-01-01T00:00:00Z',
                        updated_at: '2024-01-15T10:30:00Z'
                    },
                    {
                        id: 6,
                        code: 'DEPT-ADMIN-001',
                        name: 'Administrative Reform Department',
                        type: 'Department',
                        parent_id: 3,
                        description: 'Oversees public administration modernization and civil service reform.',
                        address: 'Avenue Hassan II, Rabat 10000, Morocco',
                        phone: '+212 537 78 88 88',
                        email: 'contact@reforme.gov.ma',
                        created_at: '2024-01-01T00:00:00Z',
                        updated_at: '2024-01-15T10:30:00Z'
                    }
                ];
                setInstitutions(mockInstitutions);
            }
        }
        catch (err) {
            console.error('Institutions API Error:', err);
            setError(`Failed to load institutions: ${err.response?.data?.detail || err.message}`);
            // Set mock data on error
            const mockInstitutions = [
                {
                    id: 1,
                    code: 'MIN-HEALTH-001',
                    name: 'Ministry of Health',
                    type: 'Ministry',
                    description: 'Responsible for public health policy and healthcare services.',
                    address: 'Avenue Annakhil, Rabat 10000, Morocco',
                    phone: '+212 537 27 37 37',
                    email: 'contact@sante.gov.ma',
                    website: 'https://www.sante.gov.ma',
                    created_at: '2024-01-01T00:00:00Z',
                    updated_at: '2024-01-15T10:30:00Z'
                }
            ];
            setInstitutions(mockInstitutions);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadInstitutions();
    }, [searchTerm, selectedType]);
    const filteredInstitutions = institutions.filter(inst => inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (inst.description && inst.description.toLowerCase().includes(searchTerm.toLowerCase())));
    const getTypeColor = (type) => {
        switch (type.toLowerCase()) {
            case 'ministry': return '#2563eb';
            case 'agency': return '#dc2626';
            case 'department': return '#16a34a';
            case 'office': return '#ea580c';
            default: return '#6b7280';
        }
    };
    const types = [...new Set(institutions.map(inst => inst.type))];
    const styles = {
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px'
        },
        header: {
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '24px',
            borderRadius: '8px',
            marginBottom: '24px'
        },
        searchBox: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: selectedInstitution ? '1fr 1fr' : '1fr',
            gap: '24px'
        },
        input: {
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            marginBottom: '12px'
        },
        select: {
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            marginBottom: '12px',
            backgroundColor: 'white'
        },
        stats: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
        },
        statCard: {
            backgroundColor: 'white',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
        },
        institutionCard: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
            marginBottom: '16px',
            cursor: 'pointer',
            transition: 'all 0.2s'
        },
        institutionCardSelected: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: '2px solid #2563eb',
            marginBottom: '16px',
            cursor: 'pointer'
        },
        detailCard: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
            height: 'fit-content'
        },
        badge: {
            display: 'inline-block',
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
        }
    };
    if (loading) {
        return _jsx("div", { style: styles.loading, children: "Loading institutions..." });
    }
    return (_jsxs("div", { style: styles.container, children: [_jsxs("div", { style: styles.header, children: [_jsx("h1", { style: { fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0' }, children: "Government Institutions Directory" }), _jsx("p", { style: { fontSize: '16px', margin: 0, opacity: 0.9 }, children: "Browse and search through Morocco's government institutions and departments" })] }), error && (_jsx("div", { style: styles.error, children: error })), _jsxs("div", { style: styles.searchBox, children: [_jsx("input", { type: "text", placeholder: "Search institutions by name, code, or description...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), style: styles.input }), _jsxs("select", { value: selectedType, onChange: (e) => setSelectedType(e.target.value), style: styles.select, children: [_jsx("option", { value: "all", children: "All Types" }), types.map(type => (_jsx("option", { value: type, children: type }, type)))] })] }), _jsxs("div", { style: styles.stats, children: [_jsxs("div", { style: styles.statCard, children: [_jsx("h3", { style: { fontSize: '14px', fontWeight: '500', margin: '0 0 8px 0', color: '#6b7280' }, children: "Total Institutions" }), _jsx("div", { style: { fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }, children: institutions.length })] }), types.map(type => (_jsxs("div", { style: styles.statCard, children: [_jsxs("h3", { style: { fontSize: '14px', fontWeight: '500', margin: '0 0 8px 0', color: '#6b7280' }, children: [type, "s"] }), _jsx("div", { style: { fontSize: '24px', fontWeight: 'bold', color: getTypeColor(type) }, children: institutions.filter(i => i.type === type).length })] }, type)))] }), _jsxs("div", { style: styles.grid, children: [_jsxs("div", { children: [_jsxs("h2", { style: { fontSize: '20px', fontWeight: '600', marginBottom: '16px' }, children: ["Institutions (", filteredInstitutions.length, ")"] }), filteredInstitutions.length === 0 ? (_jsx("div", { style: { textAlign: 'center', padding: '40px', color: '#6b7280' }, children: "No institutions found. Try adjusting your search criteria." })) : (filteredInstitutions.map((institution) => (_jsxs("div", { style: selectedInstitution?.id === institution.id ? styles.institutionCardSelected : styles.institutionCard, onClick: () => setSelectedInstitution(institution), onMouseOver: (e) => {
                                    if (selectedInstitution?.id !== institution.id) {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                                    }
                                }, onMouseOut: (e) => {
                                    if (selectedInstitution?.id !== institution.id) {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                                    }
                                }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }, children: [_jsxs("div", { children: [_jsx("h3", { style: { fontSize: '18px', fontWeight: '600', margin: '0 0 4px 0' }, children: institution.name }), _jsxs("div", { style: { fontSize: '14px', color: '#6b7280', marginBottom: '8px' }, children: ["Code: ", institution.code] })] }), _jsx("span", { style: {
                                                    ...styles.badge,
                                                    backgroundColor: getTypeColor(institution.type) + '20',
                                                    color: getTypeColor(institution.type)
                                                }, children: institution.type })] }), institution.description && (_jsx("p", { style: { fontSize: '14px', lineHeight: '1.5', margin: '0 0 12px 0', color: '#374151' }, children: institution.description })), _jsxs("div", { style: { fontSize: '12px', color: '#6b7280' }, children: [_jsxs("div", { style: { marginBottom: '4px' }, children: ["\uD83D\uDCCD ", institution.address || 'Address not available'] }), _jsxs("div", { style: { marginBottom: '4px' }, children: ["\uD83D\uDCDE ", institution.phone || 'Phone not available'] }), _jsxs("div", { children: ["\u2709\uFE0F ", institution.email || 'Email not available'] })] })] }, institution.id))))] }), selectedInstitution && (_jsxs("div", { children: [_jsx("h2", { style: { fontSize: '20px', fontWeight: '600', marginBottom: '16px' }, children: "Institution Details" }), _jsxs("div", { style: styles.detailCard, children: [_jsx("h3", { style: { fontSize: '20px', fontWeight: '600', margin: '0 0 12px 0', color: '#2563eb' }, children: selectedInstitution.name }), _jsxs("div", { style: { marginBottom: '16px' }, children: [_jsx("div", { style: { fontSize: '14px', fontWeight: '500', marginBottom: '4px' }, children: "Institution Code:" }), _jsx("div", { style: { fontSize: '16px', color: '#6b7280', fontFamily: 'monospace' }, children: selectedInstitution.code })] }), _jsxs("div", { style: { marginBottom: '16px' }, children: [_jsx("div", { style: { fontSize: '14px', fontWeight: '500', marginBottom: '4px' }, children: "Type:" }), _jsx("span", { style: {
                                                    ...styles.badge,
                                                    backgroundColor: getTypeColor(selectedInstitution.type) + '20',
                                                    color: getTypeColor(selectedInstitution.type)
                                                }, children: selectedInstitution.type })] }), selectedInstitution.description && (_jsxs("div", { style: { marginBottom: '16px' }, children: [_jsx("div", { style: { fontSize: '14px', fontWeight: '500', marginBottom: '4px' }, children: "Description:" }), _jsx("div", { style: { fontSize: '14px', lineHeight: '1.6', color: '#374151' }, children: selectedInstitution.description })] })), _jsxs("div", { style: { marginBottom: '16px' }, children: [_jsx("div", { style: { fontSize: '14px', fontWeight: '500', marginBottom: '8px' }, children: "Contact Information:" }), selectedInstitution.address && (_jsxs("div", { style: { fontSize: '14px', marginBottom: '8px' }, children: [_jsx("strong", { children: "Address:" }), " ", selectedInstitution.address] })), selectedInstitution.phone && (_jsxs("div", { style: { fontSize: '14px', marginBottom: '8px' }, children: [_jsx("strong", { children: "Phone:" }), " ", selectedInstitution.phone] })), selectedInstitution.email && (_jsxs("div", { style: { fontSize: '14px', marginBottom: '8px' }, children: [_jsx("strong", { children: "Email:" }), " ", selectedInstitution.email] })), selectedInstitution.website && (_jsxs("div", { style: { fontSize: '14px', marginBottom: '8px' }, children: [_jsx("strong", { children: "Website:" }), ' ', _jsx("a", { href: selectedInstitution.website, target: "_blank", rel: "noopener noreferrer", style: { color: '#2563eb', textDecoration: 'none' }, children: selectedInstitution.website })] }))] }), _jsxs("div", { style: { fontSize: '12px', color: '#6b7280', borderTop: '1px solid #e5e7eb', paddingTop: '12px' }, children: [_jsxs("div", { children: ["Created: ", new Date(selectedInstitution.created_at).toLocaleDateString()] }), _jsxs("div", { children: ["Last Updated: ", new Date(selectedInstitution.updated_at).toLocaleDateString()] })] })] })] }))] })] }));
};
export default InstitutionsPage;
