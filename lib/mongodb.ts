/**
 * MongoDB connection utility for Next.js applications with Mongoose
 * 
 * This module provides a cached connection to MongoDB Atlas using Mongoose.
 * The connection is cached to prevent multiple connections during development
 * due to Next.js hot reloading and serverless function behavior.
 */

import mongoose, { Connection } from 'mongoose';

// Define the structure for our cached connection
interface MongooseCache {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

// Extend the global object to include our mongoose cache
declare global {
  var mongoose: MongooseCache | undefined;
}

/**
 * Environment variables validation
 * Ensures MONGODB_URI is properly set before attempting connection
 */
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Initialize the cache object
 * In development, use a global variable to preserve the cached connection
 * across hot reloads. In production, create a new cache object.
 */
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (process.env.NODE_ENV === 'development') {
  global.mongoose = cached;
}

/**
 * Database connection options for production optimization
 * These options help with connection pooling and performance
 */
const connectionOptions = {
  bufferCommands: false, // Disable mongoose buffering
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};

/**
 * Main connection function
 * 
 * Returns a cached connection if available, otherwise creates a new one.
 * This prevents multiple database connections in serverless environments
 * and during Next.js development with hot reloading.
 * 
 * @returns {Promise<Connection>} Mongoose connection instance
 */
async function connectToDatabase(): Promise<Connection> {
  // Return cached connection if it exists and is ready
  if (cached.conn && cached.conn.readyState === 1) {
    console.log('📡 Using cached MongoDB connection');
    return cached.conn;
  }

  // If no cached promise exists, create a new connection
  if (!cached.promise) {
    console.log('🔄 Creating new MongoDB connection...');
    
    cached.promise = mongoose.connect(MONGODB_URI as string, connectionOptions).then((mongoose) => {
      console.log('✅ Successfully connected to MongoDB');
      return mongoose.connection;
    }).catch((error) => {
      console.error('❌ MongoDB connection error:', error);
      // Reset the promise so we can retry
      cached.promise = null;
      throw error;
    });
  }

  try {
    // Wait for the connection to be established
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    // Reset both promise and connection on error
    cached.promise = null;
    cached.conn = null;
    throw error;
  }
}

/**
 * Connection state checker
 * 
 * @returns {boolean} True if connected to database
 */
export function isConnected(): boolean {
  return cached.conn?.readyState === 1;
}

/**
 * Graceful disconnection function
 * Useful for cleanup in serverless functions or application shutdown
 * 
 * @returns {Promise<void>}
 */
export async function disconnectFromDatabase(): Promise<void> {
  if (cached.conn) {
    await cached.conn.close();
    cached.conn = null;
    cached.promise = null;
    console.log('🔌 Disconnected from MongoDB');
  }
}

/**
 * Get connection statistics
 * Useful for monitoring and debugging
 * 
 * @returns {object} Connection state information
 */
export function getConnectionInfo() {
  return {
    isConnected: isConnected(),
    readyState: cached.conn?.readyState,
    name: cached.conn?.name,
    host: cached.conn?.host,
    port: cached.conn?.port,
  };
}

// Export the main connection function as default
export default connectToDatabase;