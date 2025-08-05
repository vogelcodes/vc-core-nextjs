import { users } from '../database/models/users.js';

export const userService = {
  async getProfile(userId) {
    const user = await users.findById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    return user;
  },

  async updateProfile(userId, data) {
    const allowedFields = ['username', 'email'];
    const updateData = {};
    
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error('Nenhum campo válido para atualizar');
    }

    return await users.update(userId, updateData);
  },

  async deleteAccount(userId) {
    return await users.delete(userId);
  },

  async changePassword(userId, currentPassword, newPassword) {
    const user = await users.findById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar senha atual
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      throw new Error('Senha atual incorreta');
    }

    // Hash da nova senha
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    
    return await users.update(userId, { password: hashedNewPassword });
  }
};