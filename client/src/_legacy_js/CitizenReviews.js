import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
const CitizenReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedInstitution, setSelectedInstitution] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    // Form state
    const [formData, setFormData] = useState({
        institution: '',
        official_name: '',
        rating: 5,
        title: '',
        content: '',
        category: 'service',
        is_anonymous: false
    });
    const loadReviews = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (selectedInstitution !== 'all') {
                params.append('institution', selectedInstitution);
            }
            if (filterCategory !== 'all') {
                params.append('category', filterCategory);
            }
            params.append('sort', sortBy);
            const response = await apiService.reviews.getReviews(params);
            // Handle different response formats
            let reviewsData = response.data;
            if (Array.isArray(reviewsData)) {
                setReviews(reviewsData);
            }
            else if (reviewsData && Array.isArray(reviewsData.items)) {
                setReviews(reviewsData.items);
            }
            else if (reviewsData && Array.isArray(reviewsData.data)) {
                setReviews(reviewsData.data);
            }
            else {
                // Mock data for testing
                const mockReviews = [
                    {
                        id: 1,
                        institution: 'Ministry of Health',
                        official_name: 'Dr. Ahmed Benali',
                        rating: 4,
                        title: 'Excellent Healthcare Services',
                        content: 'The new digital health platform is very user-friendly and efficient. I was able to book an appointment and access my medical records easily.',
                        category: 'service',
                        status: 'approved',
                        created_at: '2024-01-15T10:30:00Z',
                        user_name: 'Fatima Alami',
                        is_anonymous: false
                    },
                    {
                        id: 2,
                        institution: 'Ministry of Education',
                        official_name: 'Prof. Khadija Tazi',
                        rating: 5,
                        title: 'Outstanding Educational Support',
                        content: 'The digital learning initiative has transformed my children\'s education. The online resources are comprehensive and well-organized.',
                        category: 'service',
                        status: 'approved',
                        created_at: '2024-01-14T15:45:00Z',
                        user_name: 'Anonymous',
                        is_anonymous: true
                    },
                    {
                        id: 3,
                        institution: 'Ministry of Interior',
                        official_name: 'Col. Youssef Idrissi',
                        rating: 3,
                        title: 'Slow Response Time',
                        content: 'The service was adequate but the response time for document processing was longer than expected. Could be improved.',
                        category: 'responsiveness',
                        status: 'approved',
                        created_at: '2024-01-13T09:20:00Z',
                        user_name: 'Mohammed Alami',
                        is_anonymous: false
                    },
                    {
                        id: 4,
                        institution: 'Ministry of Finance',
                        official_name: 'Ms. Aicha Benkirane',
                        rating: 2,
                        title: 'Transparency Issues',
                        content: 'Had difficulty understanding the tax calculation process. More transparency in financial procedures would be helpful.',
                        category: 'transparency',
                        status: 'pending',
                        created_at: '2024-01-12T14:15:00Z',
                        user_name: 'Anonymous',
                        is_anonymous: true
                    }
                ];
                setReviews(mockReviews);
            }
            // Mock stats
            const mockStats = {
                total_reviews: 156,
                average_rating: 3.8,
                pending_reviews: 12,
                approved_reviews: 144
            };
            setStats(mockStats);
        }
        catch (err) {
            console.error('Reviews API Error:', err);
            setError(`Failed to load reviews: ${err.response?.data?.detail || err.message}`);
            // Set mock data on error
            const mockReviews = [
                {
                    id: 1,
                    institution: 'Ministry of Health',
                    official_name: 'Dr. Ahmed Benali',
                    rating: 4,
                    title: 'Excellent Healthcare Services',
                    content: 'The new digital health platform is very user-friendly and efficient.',
                    category: 'service',
                    status: 'approved',
                    created_at: '2024-01-15T10:30:00Z',
                    user_name: 'Fatima Alami',
                    is_anonymous: false
                }
            ];
            setReviews(mockReviews);
            const mockStats = {
                total_reviews: 156,
                average_rating: 3.8,
                pending_reviews: 12,
                approved_reviews: 144
            };
            setStats(mockStats);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadReviews();
    }, [selectedInstitution, filterCategory, sortBy]);
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            await apiService.reviews.createReview(formData);
            setShowForm(false);
            setFormData({
                institution: '',
                official_name: '',
                rating: 5,
                title: '',
                content: '',
                category: 'service',
                is_anonymous: false
            });
            loadReviews();
        }
        catch (err) {
            console.error('Submit Review Error:', err);
            setError('Failed to submit review. Please try again.');
        }
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    const getCategoryColor = (category) => {
        switch (category) {
            case 'service': return '#16a34a';
            case 'responsiveness': return '#ea580c';
            case 'transparency': return '#7c3aed';
            case 'corruption': return '#dc2626';
            default: return '#6b7280';
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return '#16a34a';
            case 'pending': return '#ea580c';
            case 'rejected': return '#dc2626';
            default: return '#6b7280';
        }
    };
    const renderStars = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };
    const institutions = [...new Set(reviews.map(review => review.institution))];
    const styles = {
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px'
        },
        header: {
            backgroundColor: '#16a34a',
            color: 'white',
            padding: '24px',
            borderRadius: '8px',
            marginBottom: '24px'
        },
        stats: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
        },
        statCard: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
        },
        filters: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
        },
        reviewCard: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
        },
        form: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
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
        textarea: {
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            marginBottom: '12px',
            minHeight: '100px',
            resize: 'vertical'
        },
        button: {
            backgroundColor: '#16a34a',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            marginRight: '8px'
        },
        buttonSecondary: {
            backgroundColor: '#6b7280',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
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
        return _jsx("div", { style: styles.loading, children: "Loading reviews..." });
    }
    return (_jsxs("div", { style: styles.container, className: "text-white", children: [_jsxs("div", { style: styles.header, className: "backdrop-blur-sm bg-white/5 border border-white/10", children: [_jsx("h1", { style: { fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0' }, className: "bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent", children: "Citizen Reviews" }), _jsx("p", { style: { fontSize: '16px', margin: 0, opacity: 0.9 }, className: "text-white/80", children: "Rate and review government officials and services to promote transparency and accountability" })] }), error && (_jsx("div", { style: styles.error, children: error })), stats && (_jsxs("div", { style: styles.stats, children: [_jsxs("div", { style: styles.statCard, children: [_jsx("h3", { style: { fontSize: '14px', fontWeight: '500', margin: '0 0 8px 0', color: '#6b7280' }, children: "Total Reviews" }), _jsx("div", { style: { fontSize: '24px', fontWeight: 'bold', color: '#7dd3fc' }, children: stats.total_reviews })] }), _jsxs("div", { style: styles.statCard, children: [_jsx("h3", { style: { fontSize: '14px', fontWeight: '500', margin: '0 0 8px 0', color: '#6b7280' }, children: "Average Rating" }), _jsxs("div", { style: { fontSize: '24px', fontWeight: 'bold', color: '#fbbf24' }, children: [stats.average_rating.toFixed(1), "/5.0"] })] }), _jsxs("div", { style: styles.statCard, children: [_jsx("h3", { style: { fontSize: '14px', fontWeight: '500', margin: '0 0 8px 0', color: '#6b7280' }, children: "Pending Reviews" }), _jsx("div", { style: { fontSize: '24px', fontWeight: 'bold', color: '#fb7185' }, children: stats.pending_reviews })] }), _jsxs("div", { style: styles.statCard, children: [_jsx("h3", { style: { fontSize: '14px', fontWeight: '500', margin: '0 0 8px 0', color: '#6b7280' }, children: "Approved Reviews" }), _jsx("div", { style: { fontSize: '24px', fontWeight: 'bold', color: '#34d399' }, children: stats.approved_reviews })] })] })), !showForm ? (_jsx("div", { style: { textAlign: 'center', marginBottom: '24px' }, children: _jsx("button", { onClick: () => setShowForm(true), style: styles.button, className: "bg-cyan-600 hover:bg-cyan-500", children: "Submit a Review" }) })) : (_jsxs("div", { style: styles.form, className: "backdrop-blur-sm bg-white/5 border border-white/10", children: [_jsx("h2", { style: { fontSize: '18px', fontWeight: '600', marginBottom: '16px' }, children: "Submit Your Review" }), _jsxs("form", { onSubmit: handleSubmitReview, children: [_jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }, children: [_jsxs("select", { value: formData.institution, onChange: (e) => setFormData({ ...formData, institution: e.target.value }), style: styles.select, className: "bg-white/10 border-white/20 text-white", required: true, children: [_jsx("option", { value: "", children: "Select Institution" }), _jsx("option", { value: "Ministry of Health", children: "Ministry of Health" }), _jsx("option", { value: "Ministry of Education", children: "Ministry of Education" }), _jsx("option", { value: "Ministry of Interior", children: "Ministry of Interior" }), _jsx("option", { value: "Ministry of Finance", children: "Ministry of Finance" }), _jsx("option", { value: "Ministry of Agriculture", children: "Ministry of Agriculture" })] }), _jsx("input", { type: "text", placeholder: "Official Name (Optional)", value: formData.official_name, onChange: (e) => setFormData({ ...formData, official_name: e.target.value }), style: styles.input, className: "bg-white/10 border-white/20 text-white" })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }, children: [_jsxs("select", { value: formData.category, onChange: (e) => setFormData({ ...formData, category: e.target.value }), style: styles.select, className: "bg-white/10 border-white/20 text-white", children: [_jsx("option", { value: "service", children: "Service Quality" }), _jsx("option", { value: "responsiveness", children: "Responsiveness" }), _jsx("option", { value: "transparency", children: "Transparency" }), _jsx("option", { value: "corruption", children: "Corruption Report" })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [_jsx("label", { style: { fontSize: '14px' }, children: "Rating:" }), _jsxs("select", { value: formData.rating, onChange: (e) => setFormData({ ...formData, rating: parseInt(e.target.value) }), style: { ...styles.select, width: 'auto', marginBottom: 0 }, className: "bg-white/10 border-white/20 text-white", children: [_jsx("option", { value: 5, children: "5 Stars (Excellent)" }), _jsx("option", { value: 4, children: "4 Stars (Very Good)" }), _jsx("option", { value: 3, children: "3 Stars (Good)" }), _jsx("option", { value: 2, children: "2 Stars (Fair)" }), _jsx("option", { value: 1, children: "1 Star (Poor)" })] })] })] }), _jsx("input", { type: "text", placeholder: "Review Title", value: formData.title, onChange: (e) => setFormData({ ...formData, title: e.target.value }), style: styles.input, className: "bg-white/10 border-white/20 text-white", required: true }), _jsx("textarea", { placeholder: "Write your review here...", value: formData.content, onChange: (e) => setFormData({ ...formData, content: e.target.value }), style: styles.textarea, className: "bg-white/10 border-white/20 text-white", required: true }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }, children: [_jsx("input", { type: "checkbox", id: "anonymous", checked: formData.is_anonymous, onChange: (e) => setFormData({ ...formData, is_anonymous: e.target.checked }) }), _jsx("label", { htmlFor: "anonymous", style: { fontSize: '14px' }, children: "Submit anonymously" })] }), _jsxs("div", { children: [_jsx("button", { type: "submit", style: styles.button, className: "bg-cyan-600 hover:bg-cyan-500", children: "Submit Review" }), _jsx("button", { type: "button", onClick: () => setShowForm(false), style: styles.buttonSecondary, className: "bg-white/20", children: "Cancel" })] })] })] })), _jsx("div", { style: styles.filters, className: "backdrop-blur-sm bg-white/5 border border-white/10", children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }, children: [_jsx("label", { style: { fontSize: '14px', fontWeight: '500' }, children: "Institution:" }), _jsxs("select", { value: selectedInstitution, onChange: (e) => setSelectedInstitution(e.target.value), style: styles.select, className: "bg-white/10 border-white/20 text-white", children: [_jsx("option", { value: "all", children: "All Institutions" }), institutions.map(institution => (_jsx("option", { value: institution, children: institution }, institution)))] }), _jsx("label", { style: { fontSize: '14px', fontWeight: '500' }, children: "Category:" }), _jsxs("select", { value: filterCategory, onChange: (e) => setFilterCategory(e.target.value), style: styles.select, className: "bg-white/10 border-white/20 text-white", children: [_jsx("option", { value: "all", children: "All Categories" }), _jsx("option", { value: "service", children: "Service Quality" }), _jsx("option", { value: "responsiveness", children: "Responsiveness" }), _jsx("option", { value: "transparency", children: "Transparency" }), _jsx("option", { value: "corruption", children: "Corruption Report" })] }), _jsx("label", { style: { fontSize: '14px', fontWeight: '500' }, children: "Sort by:" }), _jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), style: styles.select, className: "bg-white/10 border-white/20 text-white", children: [_jsx("option", { value: "newest", children: "Newest First" }), _jsx("option", { value: "oldest", children: "Oldest First" }), _jsx("option", { value: "rating_high", children: "Highest Rating" }), _jsx("option", { value: "rating_low", children: "Lowest Rating" })] })] }) }), _jsxs("div", { children: [_jsxs("h2", { style: { fontSize: '20px', fontWeight: '600', marginBottom: '16px' }, children: ["Reviews (", reviews.length, ")"] }), reviews.length === 0 ? (_jsx("div", { style: { textAlign: 'center', padding: '40px', color: '#6b7280' }, children: "No reviews found. Be the first to submit a review!" })) : (reviews.map((review) => (_jsxs("div", { style: styles.reviewCard, className: "backdrop-blur-sm bg-white/5 border border-white/10", children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }, children: [_jsxs("div", { children: [_jsx("h3", { style: { fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }, children: review.title }), _jsxs("div", { style: { fontSize: '14px', color: '#6b7280' }, children: [review.institution, " ", review.official_name && `• ${review.official_name}`] })] }), _jsxs("div", { style: { textAlign: 'right' }, children: [_jsx("div", { style: { fontSize: '16px', color: '#ea580c', marginBottom: '4px' }, children: renderStars(review.rating) }), _jsx("div", { style: { fontSize: '12px', color: '#6b7280' }, children: formatDate(review.created_at) })] })] }), _jsx("p", { style: { fontSize: '14px', lineHeight: '1.6', margin: '0 0 12px 0' }, children: review.content }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs("div", { style: { display: 'flex', gap: '8px' }, children: [_jsx("span", { style: {
                                                    ...styles.badge,
                                                    backgroundColor: getCategoryColor(review.category) + '20',
                                                    color: getCategoryColor(review.category)
                                                }, children: review.category }), _jsx("span", { style: {
                                                    ...styles.badge,
                                                    backgroundColor: getStatusColor(review.status) + '20',
                                                    color: getStatusColor(review.status)
                                                }, children: review.status })] }), _jsxs("div", { style: { fontSize: '12px', color: '#6b7280' }, children: ["By ", review.is_anonymous ? 'Anonymous' : (review.user_name || 'Anonymous')] })] })] }, review.id))))] })] }));
};
export default CitizenReviews;
