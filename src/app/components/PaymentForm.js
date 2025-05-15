// src/app/components/PaymentForm.js
"use client";  // Enable client-side functionality for client hooks

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';  // Import useRouter from next/navigation
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Paper,
  Grid,
  InputAdornment,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';

const MotionCard = motion(Card);

// Dynamically import the StripeCardElement component with no SSR
const StripeCardElement = dynamic(
  () => import('./StripeCardElement'),
  { 
    ssr: false,
    loading: () => (
      <Box 
        sx={{ 
          p: 3, 
          border: '1px solid', 
          borderColor: 'divider', 
          borderRadius: 2,
          background: (theme) => alpha(theme.palette.background.paper, 0.5),
        }}
      >
        <CircularProgress size={24} />
      </Box>
    )
  }
);

const PaymentForm = ({ onCancel, selectedPlan }) => {
  const theme = useTheme();
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();  // Initialize the router for navigation
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);  // State for Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState('');  // Snackbar message
  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  // Check if CardElement is ready
  const isCardReady = !!elements?.getElement(CardElement);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      setErrorMessage('Payment system is not ready. Please try again.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setErrorMessage('Card details are not properly loaded. Please refresh the page.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        setErrorMessage(stripeError.message);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          selectedPlan,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      if (data.error) {
        setErrorMessage(data.error);
        setLoading(false);
      } else {
        setSnackbarMessage('Payment successful! Redirecting to invoice...');
        setSnackbarOpen(true);
        setTimeout(() => {
          router.push('/invoice');
        }, 2000);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage('An error occurred during payment processing. Please try again.');
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);  // Close Snackbar
  };

  const steps = ['Personal Information', 'Payment Details'];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
      }}
    >
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          maxWidth: 800,
          width: '100%',
          borderRadius: 4,
          boxShadow: (theme) => `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            fontWeight={600}
            sx={{ 
              mb: 4,
              background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Complete Your Payment
        </Typography>
        
          <Stepper 
            activeStep={activeStep} 
            sx={{ 
              mb: 6,
              '& .MuiStepLabel-root .Mui-completed': {
                color: 'secondary.main',
              },
              '& .MuiStepLabel-root .Mui-active': {
                color: 'primary.main',
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box component="form" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {activeStep === 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </motion.div>
              )}

              {activeStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      background: (theme) => alpha(theme.palette.background.paper, 0.5),
                    }}
                  >
                    <StripeCardElement />
                  </Paper>
                </motion.div>
              )}
            </AnimatePresence>

            {errorMessage && activeStep === 1 && (
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 2,
                  borderRadius: 2,
                }}
              >
                {errorMessage}
              </Alert>
            )}

            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mt: 4,
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={activeStep === 0 ? onCancel : handleBack}
                disabled={loading}
                startIcon={<ArrowBackIcon />}
                sx={{
                  borderRadius: 2,
                  px: 3,
                }}
              >
                {activeStep === 0 ? 'Cancel' : 'Back'}
              </Button>
              {activeStep === 0 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!formData.name || !formData.email || !formData.phone || !formData.address}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={
                    !stripe ||
                    !elements ||
                    loading ||
                    !formData.name ||
                    !formData.email ||
                    !formData.phone ||
                    !formData.address
                  }
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PaymentIcon />}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  }}
                >
                  {loading ? 'Processing...' : 'Pay Now'}
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </MotionCard>

      {/* Snackbar for payment success message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity="success" 
          sx={{ 
            width: '100%',
            borderRadius: 2,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PaymentForm;
