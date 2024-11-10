// src/app/components/PaymentForm.js
"use client";  // Enable client-side functionality for client hooks

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';  // Import useRouter from next/navigation
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';  // Import Snackbar and Alert
import styled from 'styled-components';

const Modal = styled.div`
  width: 500px;
  height: auto;
  background: #ffffff;
  box-shadow: 0px 187px 75px rgba(0, 0, 0, 0.01), 
              0px 105px 63px rgba(0, 0, 0, 0.05),
              0px 47px 47px rgba(0, 0, 0, 0.09),
              0px 12px 26px rgba(0, 0, 0, 0.1);
  border-radius: 26px;
  padding: 20px;
  overflow: auto;
  
  @media (max-width: 600px) {
    width: 90%;
    padding: 15px;
    border-radius: 20px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
`;

const InputField = styled.input`
  width: auto;
  height: 40px;
  padding: 0 0 0 16px;
  border-radius: 9px;
  outline: none;
  color: #333;
  background-color: #f2f2f2;
  border: 1px solid #e5e5e500;
  transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);

  &:focus {
    border: 1px solid transparent;
    box-shadow: 0px 0px 0px 2px #242424;
    background-color: #ffffff;
  }
`;

const SubmitButton = styled(Button)`
  height: 55px;
  background: linear-gradient(180deg, #363636 0%, #1b1b1b 50%, #000000 100%);
  border-radius: 11px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);

  &:hover {
    box-shadow: 0px 0px 0px 2px #ffffff, 0px 0px 0px 4px rgba(0, 0, 0, 0.23);
  }

  @media (max-width: 600px) {
    font-size: 12px;
    height: 45px;
  }
`;

const PaymentForm = ({ onCancel, selectedPlan }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();  // Initialize the router for navigation
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);  // State for Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState('');  // Snackbar message

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    setLoading(true);
    setErrorMessage('');

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      setErrorMessage(error.message);
    } else {
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

      const data = await response.json();
      if (data.error) {
        setErrorMessage(data.error);
      } else {
        setSnackbarMessage('Payment successful!');  // Set message for Snackbar
        setSnackbarOpen(true);  // Open Snackbar
        router.push('/invoice');  // Redirect to the InvoiceGenerator page route
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);  // Close Snackbar
  };

  return (
    <Modal>
      <Form onSubmit={handleSubmit}>
        <Typography style={{ color: 'black' }} variant="h6">
          Payment Details for {selectedPlan === 'Paid' ? 'Paid Plan' : 'Free Plan'}
        </Typography>
        
        <InputField
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <InputField
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <InputField
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <InputField
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
        
        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        
        <SubmitButton type="submit" disabled={!stripe || loading}>
          {loading ? <CircularProgress size={24} /> : 'Pay'}
        </SubmitButton>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </Form>

      {/* Snackbar for payment success message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Modal>
  );
};

export default PaymentForm;
