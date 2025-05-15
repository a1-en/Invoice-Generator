"use client";

import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Container, Box, Typography, Grid } from '@mui/material';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PricingCard from './components/PricingCard'; 
import InvoiceGenerator from './components/InvoiceGenerator'; 
import PaymentForm from './components/PaymentForm'; 
import theme from './theme';

// Load your Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const HomePage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPayment, setIsPayment] = useState(false); 

  const handleFreePlan = () => setSelectedPlan('Free');
  const handlePaidPlan = () => setIsPayment(true); 

  const handlePaymentCancel = () => {
    setIsPayment(false); 
    setSelectedPlan(null); 
  };

  const handlePaymentSuccess = (plan) => {
    setSelectedPlan(plan);
    setIsPayment(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Box sx={{ py: 8 }}>
        {!isPayment && !selectedPlan && (
            <>
              <Typography
                variant="h3"
                component="h1"
                align="center"
                gutterBottom
                fontWeight={700}
                sx={{ mb: 2 }}
              >
                Choose Your Plan
              </Typography>
              <Typography
                variant="h6"
                component="h2"
                align="center"
                color="text.secondary"
                sx={{ mb: 6 }}
              >
                Select the plan that best fits your needs
              </Typography>
              <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} sm={6} md={4}>
            <PricingCard
              title="Free Plan"
              price={0}
                    description="Perfect for small businesses and freelancers"
                    features={[
                      '10 invoices per day',
                      'Basic support',
                      'Standard templates',
                      'Email notifications',
                    ]}
              onClick={handleFreePlan}
            />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
            <PricingCard
              title="Paid Plan"
              price={10}
                    description="For growing businesses with advanced needs"
                    features={[
                      'Unlimited invoices',
                      'Premium support',
                      'Custom templates',
                      'Advanced analytics',
                      'API access',
                    ]}
              onClick={handlePaidPlan}
            />
                </Grid>
              </Grid>
            </>
        )}

        {isPayment && (
          <Elements stripe={stripePromise}>
              <PaymentForm
                onCancel={handlePaymentCancel}
                onSuccess={handlePaymentSuccess}
                selectedPlan="Paid"
              />
          </Elements>
        )}

        {selectedPlan && <InvoiceGenerator plan={selectedPlan} />}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default HomePage;
