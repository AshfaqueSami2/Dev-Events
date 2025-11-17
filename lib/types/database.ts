/**
 * Common TypeScript interfaces and types for MongoDB models
 * 
 * This file contains shared types used across the application
 * for consistent typing with MongoDB documents and Mongoose models.
 */

import { Document, Types } from 'mongoose';

/**
 * Base interface for all MongoDB documents
 * Extends Mongoose Document to include common fields
 */
export interface BaseDocument extends Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Generic API response structure
 * Provides consistent response format across all API endpoints
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Database connection status
 */
export interface ConnectionStatus {
  isConnected: boolean;
  readyState: number;
  name?: string;
  host?: string;
  port?: number;
}

/**
 * Generic query options for database operations
 */
export interface QueryOptions {
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
  select?: string;
  populate?: string | string[];
}

/**
 * Generic filter interface for database queries
 */
export interface DatabaseFilter {
  [key: string]: unknown;
}

export default BaseDocument;