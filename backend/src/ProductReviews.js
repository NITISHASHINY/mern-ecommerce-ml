import React, { useState } from 'react';
import {
  Box,
  Typography,
  Rating,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Avatar,
  Divider,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { reviewAPI } from '../../services/api';

const ProductReviews = ({ productId }) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    ['reviews', productId],
    () => reviewAPI.getProductReviews(productId)
  );

  const createMutation = useMutation(reviewAPI.createReview, {
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews', productId]);
      queryClient.invalidateQueries(['product', productId]);
      handleClose();
    },
  });

  const handleSubmit = () => {
    setSubmitting(true);
    createMutation.mutate({
      productId,
      rating,
      title,
      comment,
    });
    setSubmitting(false);
  };

  const handleClose = () => {
    setOpen(false);
    setRating(0);
    setTitle('');
    setComment('');
  };

  const reviews = data?.data?.data?.reviews || [];
  const stats = data?.data?.data?.ratingDistribution || {};

  return (
    <Box sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontFamily='"Playfair Display", serif'>
          Customer Reviews
        </Typography>
        <Button variant="outlined" onClick={() => setOpen(true)}>
          Write a Review
        </Button>
      </Box>

      {/* Rating Summary */}
      <Box display="flex" alignItems="center" gap={4} sx={{ my: 2 }}>
        <Box textAlign="center">
          <Typography variant="h3">★</Typography>
          <Typography variant="h5">{data?.data?.data?.average || 0}</Typography>
          <Typography variant="caption">out of 5</Typography>
        </Box>
        <Box>
          {[5, 4, 3, 2, 1].map((star) => (
            <Box key={star} display="flex" alignItems="center" gap={1}>
              <Typography variant="caption">{star}★</Typography>
              <Box sx={{ width: 150, bgcolor: '#f0f0f0', borderRadius: 2, height: 8 }}>
                <Box
                  sx={{
                    width: `${(stats[star] || 0) / (reviews.length || 1) * 100}%`,
                    bgcolor: '#EFA5B6',
                    borderRadius: 2,
                    height: '100%',
                  }}
                />
              </Box>
              <Typography variant="caption">{stats[star] || 0}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Reviews List */}
      {reviews.map((review) => (
        <Paper key={review._id} sx={{ p: 3, mb: 2, borderRadius: 4 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: '#EFA5B6' }}>
              {review.userName?.[0] || 'U'}
            </Avatar>
            <Box>
              <Typography variant="subtitle1">{review.userName}</Typography>
              <Rating value={review.rating} readOnly size="small" />
            </Box>
          </Box>
          <Typography variant="h6" sx={{ mt: 1 }}>
            {review.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {review.comment}
          </Typography>
          {review.isVerifiedPurchase && (
            <Typography variant="caption" color="success.main">
              ✅ Verified Purchase
            </Typography>
          )}
        </Paper>
      ))}

      {/* Review Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle fontFamily='"Playfair Display", serif'>
          Write a Review
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Rating</Typography>
            <Rating
              value={rating}
              onChange={(e, v) => setRating(v)}
              size="large"
            />
            
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mt: 2 }}
            />
            
            <TextField
              fullWidth
              label="Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              multiline
              rows={4}
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!rating || !title || !comment || submitting}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductReviews;