import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';

interface CheckoutFormProps {
  amount: number;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    try {
      const { data: clientSecret } = await axios.post('http://localhost:3001/create-payment-intent', {
        amount,
        currency: 'usd',
      });

      const cardElement = elements.getElement(CardElement);

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement!,
        },
      });

      if (error) {
        setError(error.message || 'Ocurrió un error');
      } else if (paymentIntent?.status === 'succeeded') {
        alert('Pago exitoso');
      }
    } catch (err: any) {
      setError(err.message || 'Error en el pago');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>Pagar</button>
      {error && <div>{error}</div>}
    </form>
  );
};

export default CheckoutForm;
