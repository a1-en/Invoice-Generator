// src/app/invoice/page.js

import React from 'react';
import InvoiceGenerator from '../components/InvoiceGenerator';  // Adjust path if necessary

const InvoicePage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      <InvoiceGenerator />  {/* Render the InvoiceGenerator component */}
    </div>
  );
};

export default InvoicePage;
