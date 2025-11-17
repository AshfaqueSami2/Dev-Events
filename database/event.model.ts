import { Schema, model, models, Document, Types } from 'mongoose';

// TypeScript interface for Event document
export interface IEvent extends Document {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  overview: {
    type: String,
    required: [true, 'Overview is required'],
    trim: true,
    maxlength: [1000, 'Overview cannot exceed 1000 characters']
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
  },
  venue: {
    type: String,
    required: [true, 'Venue is required'],
    trim: true,
    maxlength: [200, 'Venue cannot exceed 200 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  date: {
    type: String,
    required: [true, 'Date is required'],
    validate: {
      validator: function(value: string) {
        // Validate ISO date format (YYYY-MM-DD)
        return /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(Date.parse(value));
      },
      message: 'Date must be in ISO format (YYYY-MM-DD)'
    }
  },
  time: {
    type: String,
    required: [true, 'Time is required'],
    validate: {
      validator: function(value: string) {
        // Validate 24-hour time format (HH:MM)
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
      },
      message: 'Time must be in 24-hour format (HH:MM)'
    }
  },
  mode: {
    type: String,
    required: [true, 'Event mode is required'],
    enum: {
      values: ['online', 'offline', 'hybrid'],
      message: 'Mode must be either online, offline, or hybrid'
    },
    lowercase: true
  },
  audience: {
    type: String,
    required: [true, 'Target audience is required'],
    trim: true,
    maxlength: [100, 'Audience cannot exceed 100 characters']
  },
  agenda: {
    type: [String],
    required: [true, 'Agenda is required'],
    validate: {
      validator: function(array: string[]) {
        return array.length > 0 && array.every(item => item.trim().length > 0);
      },
      message: 'Agenda must contain at least one non-empty item'
    }
  },
  organizer: {
    type: String,
    required: [true, 'Organizer is required'],
    trim: true,
    maxlength: [100, 'Organizer cannot exceed 100 characters']
  },
  tags: {
    type: [String],
    required: [true, 'Tags are required'],
    validate: {
      validator: function(array: string[]) {
        return array.length > 0 && array.every(tag => tag.trim().length > 0);
      },
      message: 'Tags must contain at least one non-empty tag'
    }
  }
}, {
  timestamps: true, // Auto-generate createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save hook for slug generation and data normalization
EventSchema.pre('save', function(this: IEvent, next) {
  // Generate slug only if title is new or modified
  if (this.isNew || this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    
    // Ensure slug is not empty
    if (!this.slug) {
      return next(new Error('Unable to generate slug from title'));
    }
  }

  // Normalize date to ISO format if modified
  if (this.isModified('date')) {
    try {
      const parsedDate = new Date(this.date);
      if (isNaN(parsedDate.getTime())) {
        return next(new Error('Invalid date format'));
      }
      this.date = parsedDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    } catch (error) {
      return next(new Error('Invalid date format'));
    }
  }

  // Normalize time format if modified
  if (this.isModified('time')) {
    // Ensure time is in HH:MM format (pad single digits)
    const timeMatch = this.time.match(/^(\d{1,2}):(\d{2})$/);
    if (timeMatch) {
      const hours = timeMatch[1].padStart(2, '0');
      const minutes = timeMatch[2];
      this.time = `${hours}:${minutes}`;
    }
  }

  // Normalize arrays by trimming and filtering empty strings
  if (this.isModified('agenda')) {
    this.agenda = this.agenda
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }

  if (this.isModified('tags')) {
    this.tags = this.tags
      .map(tag => tag.toLowerCase().trim())
      .filter(tag => tag.length > 0);
  }

  next();
});

// Create unique index on slug
EventSchema.index({ slug: 1 }, { unique: true });

// Additional indexes for common queries
EventSchema.index({ date: 1, time: 1 });
EventSchema.index({ tags: 1 });
EventSchema.index({ mode: 1 });

// Export the model, using existing model if already compiled
const Event = models.Event || model<IEvent>('Event', EventSchema);

export default Event;