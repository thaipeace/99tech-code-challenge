import { z } from 'zod';

export const createResourceSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
  description: z.string().trim().max(1000, 'Description cannot exceed 1000 characters').optional(),
  category: z.string().trim().min(1, 'Category is required').max(100, 'Category cannot exceed 100 characters'),
  price: z.number({ invalid_type_error: 'Price must be a number' }).nonnegative('Price must be greater than or equal to 0'),
  status: z.enum(['active', 'archived', 'draft']).default('active'),
});

export const updateResourceSchema = z
  .object({
    title: z.string().trim().min(1, 'Title cannot be empty').max(200, 'Title cannot exceed 200 characters').optional(),
    description: z.string().trim().max(1000, 'Description cannot exceed 1000 characters').optional(),
    category: z.string().trim().min(1, 'Category cannot be empty').max(100, 'Category cannot exceed 100 characters').optional(),
    price: z.number({ invalid_type_error: 'Price must be a number' }).nonnegative('Price must be greater than or equal to 0').optional(),
    status: z.enum(['active', 'archived', 'draft']).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export const resourceIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID must be a valid positive integer')
    .transform((val) => parseInt(val, 10)),
});

export const resourceFilterQuerySchema = z.object({
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  status: z.enum(['active', 'archived', 'draft']).optional(),
  minPrice: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? parseFloat(val) : undefined))
    .refine((val) => val === undefined || (!isNaN(val) && val >= 0), {
      message: 'minPrice must be a non-negative number',
    }),
  maxPrice: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? parseFloat(val) : undefined))
    .refine((val) => val === undefined || (!isNaN(val) && val >= 0), {
      message: 'maxPrice must be a non-negative number',
    }),
  sortBy: z.enum(['price', 'createdAt', 'title']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? parseInt(val, 10) : 1))
    .refine((val) => !isNaN(val) && val > 0, {
      message: 'page must be a positive integer',
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? parseInt(val, 10) : 10))
    .refine((val) => !isNaN(val) && val > 0 && val <= 100, {
      message: 'limit must be a positive integer between 1 and 100',
    }),
});
