import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
const GovernmentHierarchy = () => {
    const [hierarchyData, setHierarchyData] = useState({
        grades: [],
        officials: [],
        institutions: [],
        territorialAreas: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedNodes, setExpandedNodes] = useState(new Set([1, 2, 3])); // Start with some expanded
    const loadHierarchyData = async () => {
        try {
            setLoading(true);
            // Mock data based on Moroccan government structure
            const mockGrades = [
                {
                    grade_id: 1,
                    grade_name: 'Monarque',
                    level: 1,
                    description: 'Chef de l\'État, sommet du pouvoir',
                    jurisdiction_scope: 'National'
                },
                {
                    grade_id: 2,
                    grade_name: 'Chef du Gouvernement',
                    level: 2,
                    description: 'Premier Ministre, préside le Conseil des Ministres',
                    jurisdiction_scope: 'National'
                },
                {
                    grade_id: 3,
                    grade_name: 'Ministre',
                    level: 3,
                    description: 'Portefeuilles ministériels nationaux',
                    jurisdiction_scope: 'National'
                },
                {
                    grade_id: 4,
                    grade_name: 'Ministre Délégué',
                    level: 4,
                    description: 'Secrétaire d\'État, assiste les Ministres',
                    jurisdiction_scope: 'National'
                },
                {
                    grade_id: 5,
                    grade_name: 'Directeur Ministériel',
                    level: 5,
                    description: 'Directeur Général, chefs de départements centraux',
                    jurisdiction_scope: 'National'
                },
                {
                    grade_id: 6,
                    grade_name: 'Directeur Régional',
                    level: 6,
                    description: 'Chef de branche régionale du ministère',
                    jurisdiction_scope: 'Régional'
                },
                {
                    grade_id: 7,
                    grade_name: 'Délégué Provincial',
                    level: 7,
                    description: 'Préfet, supervision provinciale',
                    jurisdiction_scope: 'Provincial'
                },
                {
                    grade_id: 8,
                    grade_name: 'Agent Local',
                    level: 8,
                    description: 'Fonctionnaire communal, personnel municipal',
                    jurisdiction_scope: 'Local'
                },
                {
                    grade_id: 9,
                    grade_name: 'Inspecteur',
                    level: 9,
                    description: 'Agents de terrain, personnel de niveau le plus bas',
                    jurisdiction_scope: 'Local'
                }
            ];
            const mockTerritorialAreas = [
                { area_id: 1, area_name: 'Casablanca-Settat', area_type: 'region', code: 'CAS', parent_area_id: undefined },
                { area_id: 2, area_name: 'Rabat-Salé-Kénitra', area_type: 'region', code: 'RAB', parent_area_id: undefined },
                { area_id: 3, area_name: 'Marrakech-Safi', area_type: 'region', code: 'MAR', parent_area_id: undefined },
                { area_id: 4, area_name: 'Fès-Meknès', area_type: 'region', code: 'FES', parent_area_id: undefined },
                { area_id: 5, area_name: 'Casablanca', area_type: 'province', code: 'CAS-P', parent_area_id: 1 },
                { area_id: 6, area_name: 'Rabat', area_type: 'province', code: 'RAB-P', parent_area_id: 2 },
                { area_id: 7, area_name: 'Hay Mohammadi', area_type: 'commune', code: 'CAS-C1', parent_area_id: 5 },
                { area_id: 8, area_name: 'Ain Sebaa', area_type: 'commune', code: 'CAS-C2', parent_area_id: 5 }
            ];
            const mockInstitutions = [
                {
                    institution_id: 1,
                    name: 'Ministère de l\'Intérieur',
                    code: 'MIN-INT',
                    type: 'Ministère',
                    territorial_area_id: undefined,
                    description: 'Responsable de la sécurité intérieure et de l\'administration locale'
                },
                {
                    institution_id: 2,
                    name: 'Ministère de la Santé',
                    code: 'MIN-SANTE',
                    type: 'Ministère',
                    territorial_area_id: undefined,
                    description: 'Politique de santé publique et services de soins'
                },
                {
                    institution_id: 3,
                    name: 'Direction Régionale de la Santé - Casablanca',
                    code: 'DRS-CAS',
                    type: 'Direction Régionale',
                    parent_institution_id: 2,
                    territorial_area_id: 1,
                    description: 'Administration régionale de la santé pour Casablanca-Settat'
                },
                {
                    institution_id: 4,
                    name: 'Délégation Provinciale de la Santé - Casablanca',
                    code: 'DPS-CAS',
                    type: 'Délégation Provinciale',
                    parent_institution_id: 3,
                    territorial_area_id: 5,
                    description: 'Services de santé provinciaux pour la province de Casablanca'
                },
                {
                    institution_id: 5,
                    name: 'Centre de Santé Communal - Hay Mohammadi',
                    code: 'CSC-HM',
                    type: 'Service Local',
                    parent_institution_id: 4,
                    territorial_area_id: 7,
                    description: 'Services de santé locaux pour la commune de Hay Mohammadi'
                }
            ];
            const mockOfficials = [
                {
                    official_id: 1,
                    full_name: 'Sa Majesté le Roi Mohammed VI',
                    current_position: 'Roi du Maroc',
                    grade_id: 1,
                    institution_id: 1,
                    start_date: '1999-07-23',
                    is_active: true,
                    grade: mockGrades[0],
                    institution: mockInstitutions[0]
                },
                {
                    official_id: 2,
                    full_name: 'Aziz Akhannouch',
                    current_position: 'Chef du Gouvernement',
                    grade_id: 2,
                    institution_id: 1,
                    start_date: '2021-10-07',
                    is_active: true,
                    grade: mockGrades[1],
                    institution: mockInstitutions[0]
                },
                {
                    official_id: 3,
                    full_name: 'Dr. Khalid Ait Taleb',
                    current_position: 'Ministre de la Santé',
                    grade_id: 3,
                    institution_id: 2,
                    start_date: '2021-10-07',
                    is_active: true,
                    grade: mockGrades[2],
                    institution: mockInstitutions[1]
                },
                {
                    official_id: 4,
                    full_name: 'Dr. Fatima Zahra Mansouri',
                    current_position: 'Directrice Régionale de la Santé',
                    grade_id: 6,
                    institution_id: 3,
                    territorial_area_id: 1,
                    start_date: '2022-01-15',
                    is_active: true,
                    grade: mockGrades[5],
                    institution: mockInstitutions[2],
                    territorial_area: mockTerritorialAreas[0]
                },
                {
                    official_id: 5,
                    full_name: 'Dr. Ahmed Benali',
                    current_position: 'Délégué Provincial de la Santé',
                    grade_id: 7,
                    institution_id: 4,
                    territorial_area_id: 5,
                    start_date: '2022-03-01',
                    is_active: true,
                    grade: mockGrades[6],
                    institution: mockInstitutions[3],
                    territorial_area: mockTerritorialAreas[4]
                },
                {
                    official_id: 6,
                    full_name: 'Mme. Khadija Tazi',
                    current_position: 'Agente Locale de Santé',
                    grade_id: 8,
                    institution_id: 5,
                    territorial_area_id: 7,
                    start_date: '2022-06-01',
                    is_active: true,
                    grade: mockGrades[7],
                    institution: mockInstitutions[4],
                    territorial_area: mockTerritorialAreas[6]
                }
            ];
            setHierarchyData({
                grades: mockGrades,
                officials: mockOfficials,
                institutions: mockInstitutions,
                territorialAreas: mockTerritorialAreas
            });
        }
        catch (err) {
            console.error('Hierarchy API Error:', err);
            setError(`Échec du chargement des données de hiérarchie: ${err.response?.data?.detail || err.message}`);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadHierarchyData();
    }, []);
    const toggleNode = (nodeId) => {
        const newExpanded = new Set(expandedNodes);
        if (newExpanded.has(nodeId)) {
            newExpanded.delete(nodeId);
        }
        else {
            newExpanded.add(nodeId);
        }
        setExpandedNodes(newExpanded);
    };
    const getGradeColor = (level) => {
        const colors = [
            '#dc2626', // Monarch - Red
            '#ea580c', // Head of Government - Orange
            '#d97706', // Minister - Amber
            '#ca8a04', // Minister Delegate - Yellow
            '#65a30d', // Ministry Director - Lime
            '#16a34a', // Regional Director - Green
            '#059669', // Provincial Delegate - Emerald
            '#0891b2', // Local Agent - Cyan
            '#0284c7' // Inspector - Blue
        ];
        return colors[level - 1] || '#6b7280';
    };
    const renderTreeStructure = () => {
        // Create a proper tree structure starting from the top
        const treeData = [
            {
                id: 'king',
                name: 'Sa Majesté le Roi Mohammed VI',
                position: 'Roi du Maroc',
                level: 1,
                children: [
                    {
                        id: 'pm',
                        name: 'Aziz Akhannouch',
                        position: 'Chef du Gouvernement',
                        level: 2,
                        children: [
                            {
                                id: 'ministers',
                                name: 'Conseil des Ministres',
                                position: 'Gouvernement',
                                level: 3,
                                children: [
                                    {
                                        id: 'health-minister',
                                        name: 'Dr. Khalid Ait Taleb',
                                        position: 'Ministre de la Santé',
                                        level: 4,
                                        children: [
                                            {
                                                id: 'regional-director',
                                                name: 'Dr. Fatima Zahra Mansouri',
                                                position: 'Directrice Régionale de la Santé - Casablanca',
                                                level: 5,
                                                children: [
                                                    {
                                                        id: 'provincial-delegate',
                                                        name: 'Dr. Ahmed Benali',
                                                        position: 'Délégué Provincial de la Santé - Casablanca',
                                                        level: 6,
                                                        children: [
                                                            {
                                                                id: 'local-agent',
                                                                name: 'Mme. Khadija Tazi',
                                                                position: 'Agente Locale de Santé - Hay Mohammadi',
                                                                level: 7,
                                                                children: []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        id: 'interior-minister',
                                        name: 'Ministre de l\'Intérieur',
                                        position: 'Ministre de l\'Intérieur',
                                        level: 4,
                                        children: [
                                            {
                                                id: 'interior-regional',
                                                name: 'Directeur Régional de l\'Intérieur',
                                                position: 'Directeur Régional - Casablanca',
                                                level: 5,
                                                children: [
                                                    {
                                                        id: 'interior-provincial',
                                                        name: 'Délégué Provincial de l\'Intérieur',
                                                        position: 'Délégué Provincial - Casablanca',
                                                        level: 6,
                                                        children: [
                                                            {
                                                                id: 'interior-local',
                                                                name: 'Agent Local de l\'Intérieur',
                                                                position: 'Agent Local - Hay Mohammadi',
                                                                level: 7,
                                                                children: []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];
        const renderTreeNode = (node, depth = 0) => {
            const isExpanded = expandedNodes.has(node.id);
            const hasChildren = node.children && node.children.length > 0;
            return (_jsxs("div", { style: { position: 'relative', marginLeft: `${depth * 40}px` }, children: [hasChildren && isExpanded && (_jsx("div", { style: {
                            position: 'absolute',
                            left: '12px',
                            top: '70px',
                            bottom: '-8px',
                            width: '2px',
                            backgroundColor: '#dee2e6'
                        } })), _jsx("div", { style: {
                            position: 'relative',
                            marginBottom: '16px',
                            paddingLeft: hasChildren ? '40px' : '0px'
                        }, children: _jsxs("div", { style: {
                                backgroundColor: 'white',
                                padding: '20px',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                border: '1px solid #e9ecef',
                                cursor: hasChildren ? 'pointer' : 'default',
                                transition: 'all 0.2s ease',
                                position: 'relative'
                            }, onClick: () => hasChildren && toggleNode(node.id), onMouseOver: (e) => {
                                if (hasChildren) {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.15)';
                                }
                            }, onMouseOut: (e) => {
                                if (hasChildren) {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                                }
                            }, children: [_jsx("div", { style: {
                                        position: 'absolute',
                                        top: '16px',
                                        right: '16px',
                                        width: '32px',
                                        height: '32px',
                                        backgroundColor: getGradeColor(node.level) + '20',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        color: getGradeColor(node.level)
                                    }, children: node.level }), hasChildren && (_jsx("div", { style: {
                                        position: 'absolute',
                                        top: '16px',
                                        left: '16px',
                                        width: '24px',
                                        height: '24px',
                                        backgroundColor: '#0066cc',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }, children: isExpanded ? '−' : '+' })), _jsxs("div", { style: { paddingLeft: hasChildren ? '40px' : '0px' }, children: [_jsx("h3", { style: {
                                                fontSize: '18px',
                                                fontWeight: '600',
                                                color: '#2d3436',
                                                margin: '0 0 8px 0',
                                                fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
                                            }, children: node.name }), _jsx("p", { style: {
                                                fontSize: '14px',
                                                color: '#636e72',
                                                margin: '0 0 12px 0',
                                                fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
                                            }, children: node.position }), _jsxs("div", { style: {
                                                display: 'inline-block',
                                                padding: '4px 12px',
                                                backgroundColor: getGradeColor(node.level) + '20',
                                                color: getGradeColor(node.level),
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
                                            }, children: ["Niveau ", node.level, " - ", node.level === 1 ? 'Monarque' :
                                                    node.level === 2 ? 'Chef du Gouvernement' :
                                                        node.level === 3 ? 'Conseil des Ministres' :
                                                            node.level === 4 ? 'Ministre' :
                                                                node.level === 5 ? 'Directeur Régional' :
                                                                    node.level === 6 ? 'Délégué Provincial' :
                                                                        'Agent Local'] })] })] }) }), hasChildren && isExpanded && (_jsx("div", { style: { position: 'relative', marginTop: '8px' }, children: node.children.map((child, index) => (_jsxs("div", { style: { position: 'relative' }, children: [_jsx("div", { style: {
                                        position: 'absolute',
                                        left: '-28px',
                                        top: '40px',
                                        width: '28px',
                                        height: '2px',
                                        backgroundColor: '#dee2e6'
                                    } }), renderTreeNode(child, depth + 1)] }, child.id))) }))] }, node.id));
        };
        return (_jsxs("div", { style: { position: 'relative' }, children: [_jsx("h2", { style: {
                        fontSize: '24px',
                        fontWeight: '600',
                        color: '#2d3436',
                        marginBottom: '32px',
                        fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif'
                    }, children: "Hi\u00E9rarchie Gouvernementale du Maroc" }), _jsx("div", { style: {
                        backgroundColor: '#f8f9fa',
                        padding: '32px',
                        borderRadius: '16px',
                        border: '1px solid #e9ecef'
                    }, children: treeData.map(node => renderTreeNode(node)) })] }));
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
        return (_jsx("div", { style: styles.container, className: "text-white", children: _jsx("div", { style: styles.loading, children: "Chargement de la hi\u00E9rarchie gouvernementale..." }) }));
    }
    return (_jsxs("div", { style: styles.container, className: "text-white", children: [_jsxs("div", { style: styles.header, className: "backdrop-blur-sm bg-white/5 border border-white/10", children: [_jsx("h1", { style: styles.title, className: "bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent", children: "Hi\u00E9rarchie Gouvernementale" }), _jsx("p", { style: styles.subtitle, className: "text-white/80", children: "Structure administrative du Maroc du niveau national au niveau local" })] }), error && (_jsx("div", { style: styles.error, children: error })), _jsx("div", { className: "backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6", children: renderTreeStructure() })] }));
};
export default GovernmentHierarchy;
