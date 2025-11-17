/**
 * Example usage of MongoDB connection utility
 * 
 * This file demonstrates how to use the MongoDB connection
 * in API routes and other parts of your Next.js application.
 */

import connectToDatabase, { isConnected, getConnectionInfo } from './mongodb';

/**
 * Example: Using the connection in an API route
 * 
 * Usage in pages/api/example.ts or app/api/example/route.ts:
 */

/*
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { ApiResponse } from '@/lib/types/database';

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Your database operations here
    // const users = await User.find({});
    
    const response: ApiResponse = {
      success: true,
      message: 'Data fetched successfully',
      data: [] // your data here
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    
    const response: ApiResponse = {
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}
*/

/**
 * Example: Check connection status
 */
export async function checkDatabaseConnection() {
  try {
    if (isConnected()) {
      console.log('Already connected to database');
      return getConnectionInfo();
    }
    
    await connectToDatabase();
    console.log('Database connection established');
    return getConnectionInfo();
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }
}

/**
 * Example: Database middleware for API routes
 */
export function withDatabase(handler: Function) {
  return async (req: any, res: any) => {
    try {
      await connectToDatabase();
      return await handler(req, res);
    } catch (error) {
      console.error('Database connection failed:', error);
      return res.status(500).json({
        success: false,
        message: 'Database connection failed'
      });
    }
  };
}