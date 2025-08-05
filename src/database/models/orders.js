import database from '../connection.js';
import { v4 as uuidv4 } from 'uuid';

export const orders = {
  async create({ userId, items, totalAmount, currency = 'BRL', status = 'pending' }) {
    const id = uuidv4();
    const query = `
      INSERT INTO orders (id, user_id, items, total_amount, currency, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `;
    const result = await database.query(query, [
      id, 
      userId, 
      JSON.stringify(items), 
      totalAmount, 
      currency, 
      status
    ]);
    return result.rows[0];
  },

  async findById(id) {
    const query = 'SELECT * FROM orders WHERE id = $1';
    const result = await database.query(query, [id]);
    const order = result.rows[0];
    if (order && order.items) {
      order.items = JSON.parse(order.items);
    }
    return order;
  },

  async findByUser(userId, limit = 20, offset = 0) {
    const query = `
      SELECT * FROM orders 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;
    const result = await database.query(query, [userId, limit, offset]);
    return result.rows.map(order => ({
      ...order,
      items: order.items ? JSON.parse(order.items) : []
    }));
  },

  async updateStatus(id, status) {
    const query = `
      UPDATE orders 
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
    const result = await database.query(query, [status, id]);
    const order = result.rows[0];
    if (order && order.items) {
      order.items = JSON.parse(order.items);
    }
    return order;
  }
};