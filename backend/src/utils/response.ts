// src/utils/response.ts
import { Response } from 'express';
import { ApiResponse, PaginationMeta } from '../types';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  pagination?: PaginationMeta
): Response => {
  const response: ApiResponse<T> = { success: true, data, message };
  if (pagination) response.pagination = pagination;
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  errors?: { field: string; message: string }[]
): Response => {
  const response: ApiResponse = { success: false, message };
  if (errors) (response as Record<string, unknown>).errors = errors;
  return res.status(statusCode).json(response);
};
