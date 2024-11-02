import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const { paymentMethodId } = await req.json();

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // Amount in cents for the paid plan
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      // Specify the return URL here
      return_url: 'http://localhost:3000/return', // Replace with your actual return URL
    });

    return new Response(JSON.stringify({ success: true, paymentIntent }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
