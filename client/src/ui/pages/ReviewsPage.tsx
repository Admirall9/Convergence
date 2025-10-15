import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Rating, 
  Button, 
  TextField, 
  Grid, 
  Chip,
  Avatar,
  Divider,
  Paper
} from '@mui/material';
import { Person, Star, Comment } from '@mui/icons-material';

interface Review {
  id: number;
  officialName: string;
  officialTitle: string;
  institution: string;
  rating: number;
  title: string;
  comment: string;
  reviewerName: string;
  datePosted: string;
  isApproved: boolean;
}

const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
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

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, color: 'primary.main' }}>
        Citizen Reviews
      </Typography>

      {/* Submit Review Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Submit a Review
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Official Name"
              variant="outlined"
              placeholder="Search for an official..."
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Institution"
              variant="outlined"
              placeholder="Ministry, Agency, etc."
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Review Title"
              variant="outlined"
              placeholder="Brief summary of your review"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Your Review"
              variant="outlined"
              placeholder="Share your experience and feedback..."
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography>Rating:</Typography>
              <Rating
                name="review-rating"
                defaultValue={0}
                precision={0.5}
                size="large"
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button 
              variant="contained" 
              size="large"
              onClick={handleSubmitReview}
              startIcon={<Comment />}
            >
              Submit Review
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Reviews List */}
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Recent Reviews ({reviews.length})
      </Typography>

      {loading ? (
        <Typography>Loading reviews...</Typography>
      ) : (
        <Grid container spacing={3}>
          {reviews.map((review) => (
            <Grid item xs={12} key={review.id}>
              <Card sx={{ boxShadow: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      <Person />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="div">
                        {review.officialName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {review.officialTitle} - {review.institution}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating 
                        value={review.rating} 
                        readOnly 
                        precision={0.1}
                        size="small"
                      />
                      <Typography variant="body2">
                        {review.rating}/5
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    {review.title}
                  </Typography>

                  <Typography variant="body1" paragraph>
                    {review.comment}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        By {review.reviewerName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • {new Date(review.datePosted).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Chip 
                      label={review.isApproved ? "Approved" : "Pending"} 
                      color={review.isApproved ? "success" : "warning"}
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {reviews.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No reviews yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Be the first to submit a review about a government official
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ReviewsPage;
