import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';


dotenv.config();
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-09-30.acacia' });
const prisma = new PrismaClient();



app.use(cors());
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency, userId } = req.body; // Asegúrate de que el frontend envíe el userId
  try {
    // Crear un PaymentIntent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    // Guardar la transacción en la base de datos
    await prisma.transaction.create({
      data: {
        amount,
        currency,
        userId, // Referencia al ID del usuario que realiza la transacción
      },
    });

    // Retornar el client secret al frontend
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

app.get('/transactions', async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Error al recuperar transacciones' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
