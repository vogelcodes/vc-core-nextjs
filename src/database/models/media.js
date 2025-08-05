import database from '../connection.js';
import { v4 as uuidv4 } from 'uuid';

export const media = {
  async create({ title, description, type, url, content, userId }) {
    const id = uuidv4();
    const query = `
      INSERT INTO media_items (id, title, description, type, url, content, user_id, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `;
    const result = await database.query(query, [id, title, description, type, url, content, userId]);
    return result.rows[0];
  },

  async findById(id) {
    const query = 'SELECT * FROM media_items WHERE id = $1';
    const result = await database.query(query, [id]);
    return result.rows[0];
  },

  async findByUser(userId, limit = 20, offset = 0) {
    const query = `
      SELECT * FROM media_items 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;
    const result = await database.query(query, [userId, limit, offset]);
    return result.rows;
  },

  async findByType(type, limit = 20, offset = 0) {
    const query = `
      SELECT * FROM media_items 
      WHERE type = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;
    const result = await database.query(query, [type, limit, offset]);
    return result.rows;
  },

  async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(data)) {
      if (key !== 'id' && value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const query = `
      UPDATE media_items 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await database.query(query, values);
    return result.rows[0];
  },

  async delete(id) {
    const query = 'DELETE FROM media_items WHERE id = $1 RETURNING id';
    const result = await database.query(query, [id]);
    return result.rows[0];
  }
};