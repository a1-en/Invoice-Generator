// src/app/_app.js
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import HomePage from './page'; // Import your main page component
// For Next.js, in src/app/layout.js or pages/_app.js
import 'antd/dist/antd.css'; // Import Ant Design styles

const stripePromise = loadStripe('pk_test_51QGIKjHWlEJoVonTv2Hjbq4nyxaZnnzIvgj7fSCRgPk6EnsRYZICJj0NeSTyNUdR02BDvKepvxFSC39WkZOgGL3i00Br5fmN1E'); // Your Publishable Key

function MyApp({ Component, pageProps }) {
  return (
    <Elements stripe={stripePromise}>
      <Component {...pageProps} />
    </Elements>
  );
}

export default MyApp;
