"use client";

import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Container } from '@mui/material';
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
    setSelectedPlan(plan); // Set the selected plan to 'Paid'
    setIsPayment(false); // Hide payment form
  };

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        {!isPayment && !selectedPlan && (
          <Container sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
            <PricingCard
              title="Free Plan"
              price={0}
              description="Up to 10 invoices per day"
              features={['10 invoices per day', 'Basic support']}
              onClick={handleFreePlan}
            />
            <PricingCard
              title="Paid Plan"
              price={10}
              description="Unlimited invoices and premium support"
              features={['Unlimited invoices', 'Premium support']}
              onClick={handlePaidPlan}
            />
          </Container>
        )}
        {isPayment && (
          <Elements stripe={stripePromise}>
            <PaymentForm onCancel={handlePaymentCancel} onSuccess={handlePaymentSuccess} />
          </Elements>
        )}
        {selectedPlan && <InvoiceGenerator plan={selectedPlan} />}
      </Container>
    </ThemeProvider>
  );
};

export default HomePage;
