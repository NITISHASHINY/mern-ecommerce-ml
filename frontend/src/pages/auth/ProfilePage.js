import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { colors } from '../../theme';

const ProfilePage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [profile, setProfile] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: '',
    address: '',
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem('user', JSON.stringify(profile));
    alert('Profile updated successfully!');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user.name) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" fontFamily='"Playfair Display", serif' gutterBottom>
          Please log in
        </Typography>
        <Button variant="contained" onClick={() => navigate('/login')}>
          Go to Login
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontFamily='"Playfair Display", serif' gutterBottom>
        My Profile
      </Typography>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  margin: '0 auto',
                  bgcolor: colors.dustyRose,
                  fontSize: '3rem',
                }}
              >
                {profile.name?.charAt(0) || '🍓'}
              </Avatar>
              <Typography variant="h6" fontFamily='"Playfair Display", serif' sx={{ mt: 2 }}>
                {profile.name || 'Guest'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile.email || 'No email'}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                sx={{ mt: 3 }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4, borderRadius: 4 }}>
              <Typography variant="h6" fontFamily='"Playfair Display", serif' gutterBottom>
                Edit Profile
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="Address"
                name="address"
                multiline
                rows={2}
                value={profile.address}
                onChange={handleChange}
                sx={{ mb: 3 }}
              />

              <Button variant="contained" onClick={handleSave}>
                Save Changes
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default ProfilePage;