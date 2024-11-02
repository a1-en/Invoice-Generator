// src/app/components/PricingCard.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const PricingCard = ({ title, price, description, features, onClick }) => {
  return (
    <Box
      sx={{
        borderRadius: '16px',
        boxShadow: '0 30px 30px -25px rgba(0, 38, 255, 0.205)',
        padding: { xs: '10px', sm: '20px' },
        backgroundColor: '#fff',
        color: '#697e91',
        maxWidth: { xs: '100%', sm: '300px' },
        position: 'relative',
        margin: '0 auto',
      }}
    >
      <Box
        sx={{
          padding: { xs: '16px', sm: '20px' },
          paddingTop: '40px',
          backgroundColor: '#ecf0ff',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '0',
            right: '0',
            backgroundColor: '#bed6fb',
            borderRadius: '99em 0 0 99em',
            display: 'flex',
            alignItems: 'center',
            padding: '0.5em 0.75em',
            fontSize: { xs: '1rem', sm: '1.25rem' },
            fontWeight: '600',
            color: '#425475',
          }}
        >
          <span>
            ${price} <small>/ m</small>
          </span>
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 600, color: '#425675', mt: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          {title}
        </Typography>
        <Typography sx={{ mt: 1, textAlign: 'center', fontSize: { xs: '0.875rem', sm: '1rem' } }}>{description}</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', mt: 2 }}>
          {features.map((feature, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', mb: 1 }}>
              <Box
                sx={{
                  backgroundColor: '#1FCAC5',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  borderRadius: '50%',
                  width: { xs: '18px', sm: '20px' },
                  height: { xs: '18px', sm: '20px' },
                }}
              >
                <svg height="14" width="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 0h24v24H0z" fill="none"></path>
                  <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                </svg>
              </Box>
              <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>{feature}</Typography>
            </Box>
          ))}
        </Box>
        <Button
          variant="contained"
          onClick={onClick}
          sx={{
            backgroundColor: '#6558d3',
            borderRadius: '6px',
            color: '#fff',
            fontWeight: 500,
            fontSize: { xs: '1rem', sm: '1.125rem' },
            width: '100%',
            mt: 'auto',
            padding: '0.625em 0.75em',
            '&:hover': {
              backgroundColor: '#4133B7',
            },
          }}
        >
          Choose plan
        </Button>
      </Box>
    </Box>
  );
};

export default PricingCard;
