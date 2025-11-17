/**
 * Database Models Index
 * 
 * Central export point for all database models.
 * Import models from here to ensure consistency across the application.
 */

// Export models
export { default as Event } from './event.model';
export { default as Booking } from './booking.model';

// Export TypeScript interfaces
export type { IEvent } from './event.model';
export type { IBooking } from './booking.model';

// Re-export Mongoose types for convenience
export { Types, Document } from 'mongoose';