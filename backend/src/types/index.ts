// src/types/index.ts
import { Request } from 'express';
import { Document, Types } from 'mongoose';

// ─── Enums ───────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'sales';

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';

export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export type SortOrder = 'latest' | 'oldest';

// ─── User Types ──────────────────────────────────────────────────────────────

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserPublic {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

// ─── Lead Types ──────────────────────────────────────────────────────────────

export interface ILead extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Auth Types ───────────────────────────────────────────────────────────────

export interface IAuthPayload {
  userId: string;
  role: UserRole;
}

export interface IRegisterBody {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface ILoginBody {
  email: string;
  password: string;
}

// ─── Request Types ────────────────────────────────────────────────────────────

export interface AuthRequest extends Request {
  user?: IAuthPayload;
}

// ─── Lead Query Types ─────────────────────────────────────────────────────────

export interface LeadQueryParams {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: SortOrder;
  page?: string;
  limit?: string;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}
