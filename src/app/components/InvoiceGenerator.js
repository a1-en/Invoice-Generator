"use client";  // Enable client-side rendering for this component

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import {
  Box,
  Button,
  Typography,
  TextField,
  Card,
  CardContent,
  IconButton,
  Divider,
  Grid,
  Paper,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
  });
};

const InvoiceGenerator = () => {
  const [invoiceData, setInvoiceData] = useState({
    serialNumber: "",
    name: "",
    email: "",
    phone: "",
    items: [{ description: "", quantity: 1, price: 0 }],
    logo: null,
  });
  const [currentDate, setCurrentDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const uniqueSerialNumber = `INV-${Date.now()}`;
    setInvoiceData((prev) => ({ ...prev, serialNumber: uniqueSerialNumber }));

    const today = new Date();
    const formattedDate = today.toLocaleDateString();
    setCurrentDate(formattedDate);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData({ ...invoiceData, [name]: value });
  };

  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    const items = [...invoiceData.items];
    items[index][name] = value;
    setInvoiceData({ ...invoiceData, items });
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: "", quantity: 1, price: 0 }],
    });
  };

  const removeItem = (index) => {
    const items = [...invoiceData.items];
    items.splice(index, 1);
    setInvoiceData({ ...invoiceData, items });
  };

  const calculateTotal = () => {
    return invoiceData.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0).toFixed(2);
  };

  const validateInvoice = () => {
    if (!invoiceData.name.trim() || !invoiceData.email.trim() || !invoiceData.phone.trim()) {
      setError("Please fill in all customer details.");
      return false;
    }
    for (const item of invoiceData.items) {
      if (!item.description.trim() || !item.quantity || !item.price) {
        setError("Please fill in all item fields (description, quantity, price).");
        return false;
      }
      if (isNaN(item.quantity) || isNaN(item.price) || item.quantity <= 0 || item.price < 0) {
        setError("Quantity must be > 0 and price must be >= 0 for all items.");
        return false;
      }
    }
    setError("");
    return true;
  };

  const generatePDF = () => {
    if (!validateInvoice()) return;
    const doc = new jsPDF();
    const marginX = 20;
    const marginY = 20;

    const existingImageUrl = '/images/invoice.png';
    loadImage(existingImageUrl).then((img) => {
      doc.addImage(img, 'PNG', 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height);

      doc.setFontSize(22);
      doc.setFontSize(12);
      doc.text(`Invoice Serial Number: ${invoiceData.serialNumber}`, marginX, marginY + 50);
      doc.text(`Date: ${currentDate}`, marginX, marginY + 60);

      doc.setFontSize(14);
      doc.text("Customer Details:", marginX, marginY + 80);
      doc.setFontSize(12);
      doc.text(`Name: ${invoiceData.name}`, marginX, marginY + 90);
      doc.text(`Email: ${invoiceData.email}`, marginX, marginY + 100);
      doc.text(`Phone: ${invoiceData.phone}`, marginX, marginY + 110);

      doc.setFontSize(14);
      doc.text("Items:", marginX, marginY + 130);

      let currentY = marginY + 140;
      invoiceData.items.forEach((item, index) => {
        const itemDescription = `${index + 1}. ${item.description} - Quantity: ${item.quantity}, Price: $${item.price}`;
        doc.setFontSize(12);
        doc.text(itemDescription, marginX, currentY);
        currentY += 10;
      });

      const totalAmount = calculateTotal();
      currentY += 10;
      doc.setFontSize(14);
      doc.text(`Total Amount: $${totalAmount}`, marginX, currentY);

      doc.save("invoice.pdf");
    }).catch(error => {
      console.error("Failed to load image", error);
    });
  };

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{ maxWidth: 800, width: '100%', mx: 'auto', p: 3 }}
    >
      <CardContent>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
            Invoice Generator
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Serial Number: {invoiceData.serialNumber}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Date: {currentDate}
          </Typography>
        </Box>

        {error && (
          <Box sx={{ mb: 2 }}>
            <Typography color="error" variant="body2">{error}</Typography>
          </Box>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={invoiceData.name}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={invoiceData.email}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={invoiceData.phone}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" gutterBottom>
          Items
        </Typography>

        {invoiceData.items.map((item, index) => (
          <Paper
            key={index}
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={item.description}
                  onChange={(e) => handleItemChange(e, index)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField
                  fullWidth
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(e, index)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={item.price}
                  onChange={(e) => handleItemChange(e, index)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton
                    color="error"
                    onClick={() => removeItem(index)}
                    disabled={invoiceData.items.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        ))}

        <Button
          startIcon={<AddIcon />}
          onClick={addItem}
          variant="outlined"
          sx={{ mb: 3 }}
        >
          Add Item
        </Button>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Total Amount:</Typography>
          <Typography variant="h6" color="primary">
            ${calculateTotal()}
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={generatePDF}
          fullWidth
          size="large"
        >
          Generate PDF
        </Button>
      </CardContent>
    </MotionCard>
  );
};

export default InvoiceGenerator;
