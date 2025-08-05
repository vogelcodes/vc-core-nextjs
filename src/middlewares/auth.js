import { authService } from '../services/auth.js';
import { users } from '../database/models/users.js';

export function withAuth(handler) {
  return async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token não fornecido' });
      }

      const token = authHeader.replace('Bearer ', '');
      const decoded = authService.verifyToken(token);
      
      // Buscar dados atualizados do usuário
      const user = await users.findById(decoded.userId);
      
      if (!user) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }

      req.user = user;
      
      return await handler(req, res);
    } catch (error) {
      return res.status(401).json({ 
        error: 'Token inválido',
        details: error.message 
      });
    }
  };
}

export function withOptionalAuth(handler) {
  return async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.replace('Bearer ', '');
        const decoded = authService.verifyToken(token);
        const user = await users.findById(decoded.userId);
        
        if (user) {
          req.user = user;
        }
      }
      
      return await handler(req, res);
    } catch (error) {
      // Em caso de erro, continua sem usuário autenticado
      return await handler(req, res);
    }
  };
}