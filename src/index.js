// Database exports
export { default as database } from './database/connection.js';
export * from './database/models/index.js';

// Services exports
export { authService } from './services/auth.js';
export { userService } from './services/users.js';
export { mediaService } from './services/media.js';
export { paymentService } from './services/payments.js';

// Middlewares exports
export { withAuth } from './middlewares/auth.js';

// Utils exports
export * from './utils/index.js';

// Package info
export const version = '1.0.0';