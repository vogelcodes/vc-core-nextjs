// Type definitions for app-core

export interface User {
  id: number;
  email: string;
  username: string;
  created_at: Date;
  updated_at: Date;
}

export interface MediaItem {
  id: string;
  title: string;
  description?: string;
  type: 'article' | 'photo' | 'video';
  url?: string;
  content?: string;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface Order {
  id: string;
  user_id: number;
  items: OrderItem[];
  total_amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'cancelled' | 'expired';
  stripe_session_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  images?: string[];
}

export interface AuthResult {
  user: Omit<User, 'password'>;
  token: string;
}

export interface CheckoutSession {
  sessionId: string;
  sessionUrl: string;
  orderId: string;
}

// Services
export declare const authService: {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hashedPassword: string): Promise<boolean>;
  generateToken(payload: object, expiresIn?: string): string;
  verifyToken(token: string): any;
  register(email: string, password: string, username: string): Promise<AuthResult>;
  login(email: string, password: string): Promise<AuthResult>;
  refreshToken(token: string): Promise<AuthResult>;
};

export declare const userService: {
  getProfile(userId: number): Promise<User>;
  updateProfile(userId: number, data: Partial<User>): Promise<User>;
  deleteAccount(userId: number): Promise<{id: number}>;
  changePassword(userId: number, currentPassword: string, newPassword: string): Promise<User>;
};

export declare const mediaService: {
  create(data: Omit<MediaItem, 'id' | 'created_at' | 'updated_at'>): Promise<MediaItem>;
  getById(id: string): Promise<MediaItem>;
  getByUser(userId: number, page?: number, limit?: number): Promise<MediaItem[]>;
  getByType(type: string, page?: number, limit?: number): Promise<MediaItem[]>;
  update(id: string, data: Partial<MediaItem>, userId: number): Promise<MediaItem>;
  delete(id: string, userId: number): Promise<{id: string}>;
};

export declare const paymentService: {
  createCheckoutSession(params: {
    items: OrderItem[];
    userId: number;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
  }): Promise<CheckoutSession>;
  handleWebhook(body: any, signature: string): Promise<any>;
  getOrder(orderId: string): Promise<Order>;
  getUserOrders(userId: number, page?: number, limit?: number): Promise<Order[]>;
};

// Database
export declare const database: {
  query(text: string, params?: any[]): Promise<any>;
  getClient(): Promise<any>;
  end(): Promise<void>;
};

// Models
export declare const users: {
  create(data: {email: string, password: string, username: string}): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: number): Promise<User | undefined>;
  update(id: number, data: Partial<User>): Promise<User>;
  delete(id: number): Promise<{id: number}>;
};

export declare const media: {
  create(data: Omit<MediaItem, 'id' | 'created_at' | 'updated_at'>): Promise<MediaItem>;
  findById(id: string): Promise<MediaItem | undefined>;
  findByUser(userId: number, limit?: number, offset?: number): Promise<MediaItem[]>;
  findByType(type: string, limit?: number, offset?: number): Promise<MediaItem[]>;
  update(id: string, data: Partial<MediaItem>): Promise<MediaItem>;
  delete(id: string): Promise<{id: string}>;
};

export declare const orders: {
  create(data: {
    userId: number;
    items: OrderItem[];
    totalAmount: number;
    currency?: string;
    status?: string;
  }): Promise<Order>;
  findById(id: string): Promise<Order | undefined>;
  findByUser(userId: number, limit?: number, offset?: number): Promise<Order[]>;
  updateStatus(id: string, status: string): Promise<Order>;
};

// Middlewares
export declare function withAuth(handler: Function): Function;
export declare function withOptionalAuth(handler: Function): Function;

// Utils
export declare const validation: {
  isEmail(email: string): boolean;
  isStrongPassword(password: string): boolean;
  isValidUsername(username: string): boolean;
  sanitizeString(str: string): string;
  validateRequiredFields(data: Record<string, any>, requiredFields: string[]): string[];
};

export declare const helpers: {
  formatPrice(priceInCents: number, currency?: string): string;
  formatDate(date: Date | string, locale?: string): string;
  formatDateTime(date: Date | string, locale?: string): string;
  generateSlug(text: string): string;
  paginate(totalItems: number, currentPage: number, itemsPerPage: number): {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
  asyncErrorHandler(fn: Function): Function;
};

export declare const version: string;