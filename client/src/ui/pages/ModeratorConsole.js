import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Tabs, Tab, Badge } from '@mui/material';
import { CheckCircle, Cancel, Visibility, Flag, Person, Gavel, RateReview, Warning } from '@mui/icons-material';
const ModeratorConsole = () => {
    const [pendingItems, setPendingItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedItem, setSelectedItem] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [moderationNote, setModerationNote] = useState('');
    useEffect(() => {
        // Simulate loading pending items from API
        setTimeout(() => {
            setPendingItems([
                {
                    id: 1,
                    type: 'review',
                    title: 'Review of Minister Laftit',
                    description: 'The minister showed good leadership during the recent crisis management.',
                    submittedBy: 'Ahmed Alami',
                    submittedDate: '2024-01-15',
                    priority: 'medium',
                    status: 'pending'
                },
                {
                    id: 2,
                    type: 'flag',
                    title: 'Inappropriate content flagged',
                    description: 'User reported offensive language in a review',
                    submittedBy: 'System',
                    submittedDate: '2024-01-14',
                    priority: 'high',
                    status: 'pending'
                },
                {
                    id: 3,
                    type: 'content',
                    title: 'New law document uploaded',
                    description: 'Law 03-24 on Environmental Protection uploaded',
                    submittedBy: 'Legal Team',
                    submittedDate: '2024-01-13',
                    priority: 'low',
                    status: 'pending'
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);
    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };
    const handleReviewItem = (item) => {
        setSelectedItem(item);
        setOpenDialog(true);
    };
    const handleApprove = () => {
        if (selectedItem) {
            setPendingItems(items => items.map(item => item.id === selectedItem.id
                ? { ...item, status: 'approved' }
                : item));
            setOpenDialog(false);
            setSelectedItem(null);
            setModerationNote('');
        }
    };
    const handleReject = () => {
        if (selectedItem) {
            setPendingItems(items => items.map(item => item.id === selectedItem.id
                ? { ...item, status: 'rejected' }
                : item));
            setOpenDialog(false);
            setSelectedItem(null);
            setModerationNote('');
        }
    };
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'success';
            default: return 'default';
        }
    };
    const getTypeIcon = (type) => {
        switch (type) {
            case 'review': return _jsx(RateReview, {});
            case 'flag': return _jsx(Flag, {});
            case 'content': return _jsx(Gavel, {});
            default: return _jsx(Warning, {});
        }
    };
    const filteredItems = pendingItems.filter(item => {
        switch (selectedTab) {
            case 0: return item.status === 'pending';
            case 1: return item.status === 'approved';
            case 2: return item.status === 'rejected';
            default: return true;
        }
    });
    const pendingCount = pendingItems.filter(item => item.status === 'pending').length;
    const approvedCount = pendingItems.filter(item => item.status === 'approved').length;
    const rejectedCount = pendingItems.filter(item => item.status === 'rejected').length;
    return (_jsxs(Box, { sx: { maxWidth: 1400, mx: 'auto', p: 3 }, children: [_jsx(Typography, { variant: "h4", gutterBottom: true, sx: { mb: 4, color: 'primary.main' }, children: "Moderator Console" }), _jsxs(Grid, { container: true, spacing: 3, sx: { mb: 4 }, children: [_jsx(Grid, { item: true, xs: 12, md: 3, children: _jsx(Card, { sx: { boxShadow: 2 }, children: _jsxs(CardContent, { children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 1 }, children: [_jsx(Warning, { color: "warning", sx: { mr: 1 } }), _jsx(Typography, { variant: "h6", color: "warning.main", children: "Pending Review" })] }), _jsx(Typography, { variant: "h4", sx: { fontWeight: 'bold' }, children: pendingCount }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Items awaiting moderation" })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 3, children: _jsx(Card, { sx: { boxShadow: 2 }, children: _jsxs(CardContent, { children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 1 }, children: [_jsx(CheckCircle, { color: "success", sx: { mr: 1 } }), _jsx(Typography, { variant: "h6", color: "success.main", children: "Approved" })] }), _jsx(Typography, { variant: "h4", sx: { fontWeight: 'bold' }, children: approvedCount }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Items approved today" })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 3, children: _jsx(Card, { sx: { boxShadow: 2 }, children: _jsxs(CardContent, { children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 1 }, children: [_jsx(Cancel, { color: "error", sx: { mr: 1 } }), _jsx(Typography, { variant: "h6", color: "error.main", children: "Rejected" })] }), _jsx(Typography, { variant: "h4", sx: { fontWeight: 'bold' }, children: rejectedCount }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Items rejected today" })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 3, children: _jsx(Card, { sx: { boxShadow: 2 }, children: _jsxs(CardContent, { children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 1 }, children: [_jsx(Person, { color: "info", sx: { mr: 1 } }), _jsx(Typography, { variant: "h6", color: "info.main", children: "Total Items" })] }), _jsx(Typography, { variant: "h4", sx: { fontWeight: 'bold' }, children: pendingItems.length }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "All moderation items" })] }) }) })] }), _jsx(Paper, { sx: { mb: 3 }, children: _jsxs(Tabs, { value: selectedTab, onChange: handleTabChange, sx: { borderBottom: 1, borderColor: 'divider' }, children: [_jsx(Tab, { label: _jsx(Badge, { badgeContent: pendingCount, color: "warning", children: "Pending" }) }), _jsx(Tab, { label: _jsx(Badge, { badgeContent: approvedCount, color: "success", children: "Approved" }) }), _jsx(Tab, { label: _jsx(Badge, { badgeContent: rejectedCount, color: "error", children: "Rejected" }) })] }) }), _jsx(Paper, { sx: { boxShadow: 2 }, children: _jsx(TableContainer, { children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsx("strong", { children: "Type" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Title" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Description" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Submitted By" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Date" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Priority" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Status" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Actions" }) })] }) }), _jsx(TableBody, { children: loading ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 8, align: "center", children: _jsx(Typography, { children: "Loading moderation items..." }) }) })) : filteredItems.length === 0 ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 8, align: "center", children: _jsx(Typography, { color: "text.secondary", children: "No items found for this category" }) }) })) : (filteredItems.map((item) => (_jsxs(TableRow, { hover: true, children: [_jsx(TableCell, { children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [getTypeIcon(item.type), _jsx(Typography, { variant: "body2", sx: { ml: 1 }, children: item.type.charAt(0).toUpperCase() + item.type.slice(1) })] }) }), _jsx(TableCell, { children: _jsx(Typography, { variant: "subtitle2", children: item.title }) }), _jsx(TableCell, { children: _jsx(Typography, { variant: "body2", sx: { maxWidth: 200 }, children: item.description }) }), _jsx(TableCell, { children: _jsx(Typography, { variant: "body2", children: item.submittedBy }) }), _jsx(TableCell, { children: _jsx(Typography, { variant: "body2", children: new Date(item.submittedDate).toLocaleDateString() }) }), _jsx(TableCell, { children: _jsx(Chip, { label: item.priority, size: "small", color: getPriorityColor(item.priority) }) }), _jsx(TableCell, { children: _jsx(Chip, { label: item.status, size: "small", color: item.status === 'approved' ? 'success' :
                                                    item.status === 'rejected' ? 'error' : 'warning' }) }), _jsx(TableCell, { children: _jsxs(Box, { sx: { display: 'flex', gap: 1 }, children: [_jsx(IconButton, { size: "small", onClick: () => handleReviewItem(item), disabled: item.status !== 'pending', children: _jsx(Visibility, {}) }), item.status === 'pending' && (_jsxs(_Fragment, { children: [_jsx(IconButton, { size: "small", color: "success", onClick: () => handleReviewItem(item), children: _jsx(CheckCircle, {}) }), _jsx(IconButton, { size: "small", color: "error", onClick: () => handleReviewItem(item), children: _jsx(Cancel, {}) })] }))] }) })] }, item.id)))) })] }) }) }), _jsxs(Dialog, { open: openDialog, onClose: () => setOpenDialog(false), maxWidth: "md", fullWidth: true, children: [_jsxs(DialogTitle, { children: ["Review Item: ", selectedItem?.title] }), _jsxs(DialogContent, { children: [_jsxs(Box, { sx: { mb: 2 }, children: [_jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: "Description:" }), _jsx(Typography, { variant: "body1", paragraph: true, children: selectedItem?.description })] }), _jsxs(Box, { sx: { mb: 2 }, children: [_jsxs(Typography, { variant: "subtitle2", gutterBottom: true, children: ["Submitted by: ", selectedItem?.submittedBy] }), _jsxs(Typography, { variant: "subtitle2", gutterBottom: true, children: ["Date: ", selectedItem && new Date(selectedItem.submittedDate).toLocaleDateString()] }), _jsxs(Typography, { variant: "subtitle2", gutterBottom: true, children: ["Priority: ", selectedItem?.priority] })] }), _jsx(TextField, { fullWidth: true, multiline: true, rows: 3, label: "Moderation Notes", value: moderationNote, onChange: (e) => setModerationNote(e.target.value), placeholder: "Add notes about your moderation decision..." })] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setOpenDialog(false), children: "Cancel" }), _jsx(Button, { onClick: handleReject, color: "error", variant: "outlined", children: "Reject" }), _jsx(Button, { onClick: handleApprove, color: "success", variant: "contained", children: "Approve" })] })] })] }));
};
export default ModeratorConsole;
