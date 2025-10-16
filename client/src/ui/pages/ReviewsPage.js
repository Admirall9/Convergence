import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Rating, Button, TextField, Grid, Chip, Avatar, Divider, Paper } from '@mui/material';
import { Person, Comment } from '@mui/icons-material';
const ReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Simulate loading reviews from API
        setTimeout(() => {
            setReviews([
                {
                    id: 1,
                    officialName: "Abdelouafi Laftit",
                    officialTitle: "Minister",
                    institution: "Ministry of Interior",
                    rating: 4.5,
                    title: "Good communication during crisis",
                    comment: "The minister showed good leadership during the recent crisis management.",
                    reviewerName: "Ahmed Alami",
                    datePosted: "2024-01-15",
                    isApproved: true
                },
                {
                    id: 2,
                    officialName: "Mohamed Ben Abdelkader",
                    officialTitle: "Minister",
                    institution: "Ministry of Justice",
                    rating: 3.8,
                    title: "Reform progress is slow",
                    comment: "While the justice reform is moving forward, the pace could be faster.",
                    reviewerName: "Ahmed Alami",
                    datePosted: "2024-01-14",
                    isApproved: true
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);
    const handleSubmitReview = () => {
        // TODO: Implement review submission
        console.log('Submit review');
    };
    return (_jsxs(Box, { sx: { maxWidth: 1200, mx: 'auto', p: 3 }, children: [_jsx(Typography, { variant: "h4", gutterBottom: true, sx: { mb: 4, color: 'primary.main' }, children: "Citizen Reviews" }), _jsxs(Paper, { sx: { p: 3, mb: 4 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Submit a Review" }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, label: "Official Name", variant: "outlined", placeholder: "Search for an official..." }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, label: "Institution", variant: "outlined", placeholder: "Ministry, Agency, etc." }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Review Title", variant: "outlined", placeholder: "Brief summary of your review" }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, multiline: true, rows: 4, label: "Your Review", variant: "outlined", placeholder: "Share your experience and feedback..." }) }), _jsx(Grid, { item: true, xs: 12, children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2 }, children: [_jsx(Typography, { children: "Rating:" }), _jsx(Rating, { name: "review-rating", defaultValue: 0, precision: 0.5, size: "large" })] }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(Button, { variant: "contained", size: "large", onClick: handleSubmitReview, startIcon: _jsx(Comment, {}), children: "Submit Review" }) })] })] }), _jsxs(Typography, { variant: "h6", gutterBottom: true, sx: { mb: 2 }, children: ["Recent Reviews (", reviews.length, ")"] }), loading ? (_jsx(Typography, { children: "Loading reviews..." })) : (_jsx(Grid, { container: true, spacing: 3, children: reviews.map((review) => (_jsx(Grid, { item: true, xs: 12, children: _jsx(Card, { sx: { boxShadow: 2 }, children: _jsxs(CardContent, { children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 2 }, children: [_jsx(Avatar, { sx: { mr: 2, bgcolor: 'primary.main' }, children: _jsx(Person, {}) }), _jsxs(Box, { sx: { flexGrow: 1 }, children: [_jsx(Typography, { variant: "h6", component: "div", children: review.officialName }), _jsxs(Typography, { variant: "body2", color: "text.secondary", children: [review.officialTitle, " - ", review.institution] })] }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(Rating, { value: review.rating, readOnly: true, precision: 0.1, size: "small" }), _jsxs(Typography, { variant: "body2", children: [review.rating, "/5"] })] })] }), _jsx(Typography, { variant: "h6", gutterBottom: true, children: review.title }), _jsx(Typography, { variant: "body1", paragraph: true, children: review.comment }), _jsx(Divider, { sx: { my: 2 } }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["By ", review.reviewerName] }), _jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["\u2022 ", new Date(review.datePosted).toLocaleDateString()] })] }), _jsx(Chip, { label: review.isApproved ? "Approved" : "Pending", color: review.isApproved ? "success" : "warning", size: "small" })] })] }) }) }, review.id))) })), reviews.length === 0 && !loading && (_jsxs(Box, { sx: { textAlign: 'center', py: 4 }, children: [_jsx(Typography, { variant: "h6", color: "text.secondary", gutterBottom: true, children: "No reviews yet" }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Be the first to submit a review about a government official" })] }))] }));
};
export default ReviewsPage;
