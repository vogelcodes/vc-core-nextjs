// Exemplo de teste básico
const { authService } = require('../src/services/auth.js');

// Configurar variáveis de ambiente para teste
process.env.JWT_SECRET = 'test-secret-key';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';

describe('Auth Service', () => {
  test('should hash password', async () => {
    const password = 'testpassword123';
    const hashed = await authService.hashPassword(password);
    
    expect(hashed).toBeDefined();
    expect(hashed).not.toBe(password);
  });

  test('should generate token', () => {
    const payload = { userId: 1, email: 'test@example.com' };
    const token = authService.generateToken(payload);
    
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  test('should verify token', () => {
    const payload = { userId: 1, email: 'test@example.com' };
    const token = authService.generateToken(payload);
    const decoded = authService.verifyToken(token);
    
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.email).toBe(payload.email);
  });
});