// src/app/components/PricingCard.js
import React from 'react';
import { Box, Typography, Button, Card, CardContent, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const PricingCard = ({ title, price, description, features, onClick }) => {
  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{
        maxWidth: 360,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          transform: 'translateY(-8px)',
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -16,
          right: 16,
          backgroundColor: 'primary.main',
          color: 'white',
          padding: '8px 16px',
          borderRadius: 2,
          fontWeight: 600,
          fontSize: '1.25rem',
        }}
      >
        ${price}/mo
      </Box>

      <CardContent sx={{ flexGrow: 1, pt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
          {title}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          {description}
        </Typography>

        <List sx={{ mb: 2 }}>
          {features.map((feature, index) => (
            <ListItem key={index} sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={feature}
                primaryTypographyProps={{
                  variant: 'body2',
                  color: 'text.primary',
                }}
              />
            </ListItem>
          ))}
        </List>

        <Button
          variant="contained"
          fullWidth
          onClick={onClick}
          sx={{
            mt: 'auto',
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
          }}
        >
          Get Started
        </Button>
      </CardContent>
    </MotionCard>
  );
};

export default PricingCard;
