import { Schema, model, models, Document, Types } from 'mongoose';
import Event from './event.model';

// TypeScript interface for Booking document
export interface IBooking extends Document {
  _id: Types.ObjectId;
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required'],
    validate: {
      validator: async function(value: Types.ObjectId) {
        // Verify that the referenced event exists
        const event = await Event.findById(value);
        return !!event;
      },
      message: 'Referenced event does not exist'
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    validate: {
      validator: function(value: string) {
        // Email validation regex
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: 'Please provide a valid email address'
    },
    maxlength: [254, 'Email cannot exceed 254 characters']
  }
}, {
  timestamps: true, // Auto-generate createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save hook for event validation
BookingSchema.pre('save', async function(this: IBooking, next) {
  // Only validate eventId if it's new or modified
  if (this.isNew || this.isModified('eventId')) {
    try {
      const eventExists = await Event.findById(this.eventId);
      if (!eventExists) {
        return next(new Error(`Event with ID ${this.eventId} does not exist`));
      }
    } catch (error) {
      return next(new Error('Error validating event reference'));
    }
  }

  // Normalize email format
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase().trim();
    
    // Additional email validation
    if (this.email.length === 0) {
      return next(new Error('Email cannot be empty'));
    }
  }

  next();
});

// Create indexes for faster queries
BookingSchema.index({ eventId: 1 }); // Index on eventId for event-based queries
BookingSchema.index({ email: 1 }); // Index on email for user-based queries
BookingSchema.index({ eventId: 1, email: 1 }, { unique: true }); // Prevent duplicate bookings

// Virtual populate for event details
BookingSchema.virtual('event', {
  ref: 'Event',
  localField: 'eventId',
  foreignField: '_id',
  justOne: true
});

// Export the model, using existing model if already compiled
const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;