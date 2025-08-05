import Stripe from 'stripe';
import { orders } from '../database/models/orders.js';

let stripe;

function getStripe() {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
}

export const paymentService = {
  async createCheckoutSession({ items, userId, successUrl, cancelUrl, metadata = {} }) {
    const stripeClient = getStripe();
    
    // Criar pedido no banco
    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const order = await orders.create({
      userId,
      items,
      totalAmount,
      currency: 'BRL',
      status: 'pending'
    });

    // Criar sessão do Stripe
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'brl',
          product_data: {
            name: item.name,
            description: item.description,
            images: item.images || []
          },
          unit_amount: Math.round(item.price * 100), // Converter para centavos
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        orderId: order.id,
        userId: userId.toString(),
        ...metadata
      },
    });

    return {
      sessionId: session.id,
      sessionUrl: session.url,
      orderId: order.id
    };
  },

  async handleWebhook(body, signature) {
    const stripeClient = getStripe();
    
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('STRIPE_WEBHOOK_SECRET environment variable is required');
    }

    const event = stripeClient.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const orderId = session.metadata.orderId;
        
        if (orderId) {
          await orders.updateStatus(orderId, 'completed');
        }
        break;

      case 'checkout.session.expired':
        const expiredSession = event.data.object;
        const expiredOrderId = expiredSession.metadata.orderId;
        
        if (expiredOrderId) {
          await orders.updateStatus(expiredOrderId, 'expired');
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return event;
  },

  async getOrder(orderId) {
    return await orders.findById(orderId);
  },

  async getUserOrders(userId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    return await orders.findByUser(userId, limit, offset);
  }
};