"use client";

import { CardElement } from '@stripe/react-stripe-js';
import { Box } from '@mui/material';

const StripeCardElement = () => (
  <Box sx={{ p: 2 }}>
    <CardElement
      options={{
        style: {
          base: {
            fontSize: '16px',
            color: 'text.primary',
            '::placeholder': { color: 'text.secondary' },
            ':-webkit-autofill': { color: 'text.primary' },
          },
          invalid: { color: 'error.main' },
        },
        hidePostalCode: true,
      }}
    />
  </Box>
);

export default StripeCardElement; 