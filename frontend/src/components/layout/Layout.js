import React from 'react';
import SearchBar from '../search/SearchBar';

// In the toolbar, replace the search with:
<SearchBar />
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  IconButton,
  Badge,
  InputBase,
  useScrollTrigger,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { colors } from '../../theme';
import { useCart } from '../../context/CartContext';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 30,
  backgroundColor: alpha(colors.dustyRose, 0.08),
  '&:hover': {
    backgroundColor: alpha(colors.dustyRose, 0.15),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  transition: 'all 0.3s ease',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: colors.lightText,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 1, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
    },
  },
}));

const NavButton = styled(Button)({
  borderRadius: 30,
  padding: '8px 20px',
  textTransform: 'none',
  fontWeight: 500,
  color: colors.darkText,
  '&:hover': {
    background: 'rgba(239, 165, 182, 0.12)',
  },
});

const SignUpButton = styled(Button)({
  borderRadius: 30,
  padding: '8px 20px',
  textTransform: 'none',
  fontWeight: 500,
  background: 'linear-gradient(135deg, #EFA5B6 0%, #FFC6A8 100%)',
  color: '#FFFFFF',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: '0 8px 25px rgba(239, 165, 182, 0.45)',
  },
});

const LogoText = styled(Typography)({
  fontFamily: '"Playfair Display", serif',
  fontWeight: 700,
  fontSize: '1.8rem',
  background: 'linear-gradient(135deg, #EFA5B6 0%, #FFC6A8 50%, #DCC8FF 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textDecoration: 'none',
  letterSpacing: '-0.5px',
});

function ElevationScroll({ children }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
    sx: {
      background: trigger ? 'rgba(255, 249, 245, 0.92)' : 'rgba(255, 249, 245, 0.85)',
    },
  });
}

const Layout = ({ children }) => {
  const { getTotalItems } = useCart();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = user.name ? true : false;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#FFF9F5' }}>
      <ElevationScroll>
        <AppBar position="sticky" color="transparent" elevation={0}>
          <Toolbar sx={{ py: 1 }}>
            <LogoText component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none' }}>
              Fruite
            </LogoText>

            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search for fruits, treats..."
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <NavButton component={Link} to="/products">
                Shop
              </NavButton>
              
              {isLoggedIn ? (
                <IconButton component={Link} to="/profile" sx={{ color: colors.darkText }}>
                  <PersonOutlineIcon />
                </IconButton>
              ) : (
                <>
                  <NavButton component={Link} to="/login">
                    Sign In
                  </NavButton>
                  <SignUpButton component={Link} to="/register">
                    Sign Up
                  </SignUpButton>
                </>
              )}
              
              <IconButton component={Link} to="/cart" sx={{ color: colors.darkText }}>
                <Badge 
                  badgeContent={getTotalItems()} 
                  sx={{ '& .MuiBadge-badge': { bgcolor: colors.strawberryRed, color: 'white' } }}
                >
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </ElevationScroll>

      <Container component="main" sx={{ flex: 1, py: 4, maxWidth: '1400px' }}>
        {children}
      </Container>

      <Box component="footer" sx={{ py: 4, mt: 'auto', bgcolor: 'rgba(239, 165, 182, 0.06)', borderTop: '1px solid rgba(239, 165, 182, 0.12)' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
            <Box>
              <Typography variant="h6" fontFamily='"Playfair Display", serif' color="primary">
                Fruite
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
                Premium fruits and treats delivered with love. Fresh, elegant, and delightful.
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={600}>Quick Links</Typography>
              <Typography variant="body2" color="text.secondary" component={Link} to="/products" sx={{ display: 'block', textDecoration: 'none' }}>
                Shop All
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                About Us
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                Contact
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={600}>Follow Us</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                Instagram
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                Pinterest
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                TikTok
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;