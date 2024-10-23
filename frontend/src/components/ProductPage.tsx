import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe('tu_clave_publica_de_stripe');

const ProductPage: React.FC = () => {
  const product = {
    name: 'Producto 1',
    price: 2000, // en centavos (ej. $20.00)
  };

  return (
    <Elements stripe={stripePromise}>
      <h2>{product.name}</h2>
      <p>Precio: ${(product.price / 100).toFixed(2)}</p>
      <CheckoutForm amount={product.price} />
    </Elements>
  );
};

export default ProductPage;
