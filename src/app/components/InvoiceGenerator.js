"use client";  // Enable client-side rendering for this component


import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import styled from "styled-components";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: #1f1f1f;
  padding: 30px;
  width: 450px;
  border-radius: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

  button {
    align-self: flex-end;
  }
`;

const Input = styled.input`
  border-radius: 10px;
  border: none;
  width: 100%;
  height: 40px;
  background-color: #2b2b2b;
  color: #f1f1f1;
  padding: 0 10px;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #aaa;
  }
`;

const TextArea = styled.textarea`
  border-radius: 10px;
  border: none;
  resize: none;
  width: 100%;
  height: 40px;
  background-color: #2b2b2b;
  color: #f1f1f1;
  padding: 10px;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #aaa;
  }
`;

const Button = styled.button`
  margin: 20px 0 10px 0;
  background-color: #2d79f3;
  border: none;
  color: white;
  font-size: 15px;
  font-weight: 500;
  border-radius: 10px;
  height: 50px;
  width: 100%;
  cursor: pointer;

  &:hover {
    background-color: #1e5fbb;
  }
`;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;

  label {
    color: #f1f1f1;
    font-weight: 400;
  }

  & > div {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
`;

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

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setInvoiceData({ ...invoiceData, logo: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: "", quantity: 1, price: 0 }],
    });
  };

  const calculateTotal = () => {
    return invoiceData.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0).toFixed(2);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const marginX = 20;
    const marginY = 20;

    const existingImageUrl = '/images/invoice.png'; // Replace with your image URL/path
    loadImage(existingImageUrl).then((img) => {
      // Add the image as a background
      doc.addImage(img, 'PNG', 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height);

      // Draw the invoice data on top of the image
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
    <FormContainer>
      <h3 style={{ color: '#f1f1f1' }}>S.No: {invoiceData.serialNumber}</h3>
      <h4 style={{ color: '#f1f1f1' }}>Date: {currentDate}</h4>
      <label>
        Logo:
        <Input type="file" accept="image/*" onChange={handleLogoUpload} />
      </label>
      <label>
        Name:
        <Input
          type="text"
          name="name"
          value={invoiceData.name}
          onChange={handleChange}
          placeholder="Enter your name"
        />
      </label>
      <label>
        Email:
        <Input
          type="email"
          name="email"
          value={invoiceData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />
      </label>
      <label>
        Phone:
        <Input
          type="tel"
          name="phone"
          value={invoiceData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
        />
      </label>

      <div>
        <h3 style={{ color: '#f1f1f1' }}>Items</h3>
        {invoiceData.items.map((item, index) => (
          <ItemContainer key={index}>
            <div>
              <label>
                Description:
                <TextArea
                  name="description"
                  value={item.description}
                  onChange={(e) => handleItemChange(e, index)}
                  placeholder=""
                />
              </label>
              <label>
                Price:
                <Input
                  type="number"
                  name="price"
                  value={item.price}
                  onChange={(e) => handleItemChange(e, index)}
                  min="0"
                  step="0.01"
                />
              </label>
              <label>
                Quantity:
                <Input
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(e, index)}
                  min="1"
                />
              </label>
            </div>
          </ItemContainer>
        ))}
      </div>

      <h4 style={{ color: '#f1f1f1' }}>Total Amount: ${calculateTotal()}</h4>

      <Button onClick={generatePDF}>Download PDF</Button>
    </FormContainer>
  );
};

export default InvoiceGenerator;
