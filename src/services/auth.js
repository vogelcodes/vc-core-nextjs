import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { users } from '../database/models/users.js';

export const authService = {
  async hashPassword(password) {
    return await bcrypt.hash(password, 12);
  },

  async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  },

  generateToken(payload, expiresIn = '7d') {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is required');
    }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  },

  verifyToken(token) {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is required');
    }
    return jwt.verify(token, process.env.JWT_SECRET);
  },

  async register(email, password, username) {
    // Verificar se usuário já existe
    const existingUser = await users.findByEmail(email);
    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    // Criar usuário
    const user = await users.create({ email, password, username });
    
    // Gerar token
    const token = this.generateToken({ 
      userId: user.id, 
      email: user.email 
    });

    return { user, token };
  },

  async login(email, password) {
    const user = await users.findByEmail(email);
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const isValidPassword = await this.comparePassword(password, user.password);
    
    if (!isValidPassword) {
      throw new Error('Senha inválida');
    }

    const token = this.generateToken({ 
      userId: user.id, 
      email: user.email 
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        created_at: user.created_at
      },
      token
    };
  },

  async refreshToken(token) {
    try {
      const decoded = this.verifyToken(token);
      const user = await users.findById(decoded.userId);
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const newToken = this.generateToken({ 
        userId: user.id, 
        email: user.email 
      });

      return { token: newToken, user };
    } catch (error) {
      throw new Error('Token inválido');
    }
  }
};