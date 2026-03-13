import { Schema, model, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, UserRole } from '../types';

// ─── Document Interface ───────────────────────────────────────────────────────

export interface UserDocument extends Omit<IUser, '_id'>, Document {
  comparePassword(candidate: string): Promise<boolean>;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Never returned in queries by default
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.User,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

// ─── Pre-save: hash password ─────────────────────────────────────────────────

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Instance method: compare password ───────────────────────────────────────

userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password as string);
};

// ─── Model ───────────────────────────────────────────────────────────────────

export const User: Model<UserDocument> = model<UserDocument>('User', userSchema);
