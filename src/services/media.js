import { media } from '../database/models/media.js';

export const mediaService = {
  async create(data) {
    const { title, description, type, url, content, userId } = data;
    
    if (!title || !type || !userId) {
      throw new Error('Title, type e userId são obrigatórios');
    }

    const validTypes = ['article', 'photo', 'video'];
    if (!validTypes.includes(type)) {
      throw new Error('Tipo de mídia inválido');
    }

    return await media.create({
      title,
      description,
      type,
      url,
      content,
      userId
    });
  },

  async getById(id) {
    const item = await media.findById(id);
    if (!item) {
      throw new Error('Item de mídia não encontrado');
    }
    return item;
  },

  async getByUser(userId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    return await media.findByUser(userId, limit, offset);
  },

  async getByType(type, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    return await media.findByType(type, limit, offset);
  },

  async update(id, data, userId) {
    // Verificar se o item pertence ao usuário
    const item = await media.findById(id);
    if (!item) {
      throw new Error('Item não encontrado');
    }
    
    if (item.user_id !== userId) {
      throw new Error('Não autorizado a editar este item');
    }

    const allowedFields = ['title', 'description', 'url', 'content'];
    const updateData = {};
    
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }

    return await media.update(id, updateData);
  },

  async delete(id, userId) {
    // Verificar se o item pertence ao usuário
    const item = await media.findById(id);
    if (!item) {
      throw new Error('Item não encontrado');
    }
    
    if (item.user_id !== userId) {
      throw new Error('Não autorizado a deletar este item');
    }

    return await media.delete(id);
  }
};