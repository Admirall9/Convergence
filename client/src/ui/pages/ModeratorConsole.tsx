import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Badge
} from '@mui/material';
import { 
  CheckCircle, 
  Cancel, 
  Visibility, 
  Flag, 
  Person,
  Gavel,
  RateReview,
  Warning
} from '@mui/icons-material';

interface PendingItem {
  id: number;
  type: 'review' | 'flag' | 'content';
  title: string;
  description: string;
  submittedBy: string;
  submittedDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'rejected';
}

const ModeratorConsole: React.FC = () => {
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedItem, setSelectedItem] = useState<PendingItem | null>(null);
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleReviewItem = (item: PendingItem) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleApprove = () => {
    if (selectedItem) {
      setPendingItems(items => 
        items.map(item => 
          item.id === selectedItem.id 
            ? { ...item, status: 'approved' as const }
            : item
        )
      );
      setOpenDialog(false);
      setSelectedItem(null);
      setModerationNote('');
    }
  };

  const handleReject = () => {
    if (selectedItem) {
      setPendingItems(items => 
        items.map(item => 
          item.id === selectedItem.id 
            ? { ...item, status: 'rejected' as const }
            : item
        )
      );
      setOpenDialog(false);
      setSelectedItem(null);
      setModerationNote('');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'review': return <RateReview />;
      case 'flag': return <Flag />;
      case 'content': return <Gavel />;
      default: return <Warning />;
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

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, color: 'primary.main' }}>
        Moderator Console
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Warning color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6" color="warning.main">
                  Pending Review
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {pendingCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Items awaiting moderation
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircle color="success" sx={{ mr: 1 }} />
                <Typography variant="h6" color="success.main">
                  Approved
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {approvedCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Items approved today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Cancel color="error" sx={{ mr: 1 }} />
                <Typography variant="h6" color="error.main">
                  Rejected
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {rejectedCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Items rejected today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Person color="info" sx={{ mr: 1 }} />
                <Typography variant="h6" color="info.main">
                  Total Items
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {pendingItems.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All moderation items
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={selectedTab} 
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            label={
              <Badge badgeContent={pendingCount} color="warning">
                Pending
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={approvedCount} color="success">
                Approved
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={rejectedCount} color="error">
                Rejected
              </Badge>
            } 
          />
        </Tabs>
      </Paper>

      {/* Items Table */}
      <Paper sx={{ boxShadow: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell><strong>Title</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Submitted By</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Priority</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography>Loading moderation items...</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography color="text.secondary">
                      No items found for this category
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getTypeIcon(item.type)}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {item.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200 }}>
                        {item.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {item.submittedBy}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(item.submittedDate).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={item.priority} 
                        size="small" 
                        color={getPriorityColor(item.priority)}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={item.status} 
                        size="small" 
                        color={
                          item.status === 'approved' ? 'success' :
                          item.status === 'rejected' ? 'error' : 'warning'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleReviewItem(item)}
                          disabled={item.status !== 'pending'}
                        >
                          <Visibility />
                        </IconButton>
                        {item.status === 'pending' && (
                          <>
                            <IconButton 
                              size="small" 
                              color="success"
                              onClick={() => handleReviewItem(item)}
                            >
                              <CheckCircle />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleReviewItem(item)}
                            >
                              <Cancel />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Moderation Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Review Item: {selectedItem?.title}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Description:
            </Typography>
            <Typography variant="body1" paragraph>
              {selectedItem?.description}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Submitted by: {selectedItem?.submittedBy}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Date: {selectedItem && new Date(selectedItem.submittedDate).toLocaleDateString()}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Priority: {selectedItem?.priority}
            </Typography>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Moderation Notes"
            value={moderationNote}
            onChange={(e) => setModerationNote(e.target.value)}
            placeholder="Add notes about your moderation decision..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleReject} 
            color="error"
            variant="outlined"
          >
            Reject
          </Button>
          <Button 
            onClick={handleApprove} 
            color="success"
            variant="contained"
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ModeratorConsole;
