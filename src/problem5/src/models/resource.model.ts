export type ResourceStatus = 'active' | 'archived' | 'draft';

export interface Resource {
  id: number;
  title: string;
  description: string | null;
  category: string;
  price: number;
  status: ResourceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResourceDTO {
  title: string;
  description?: string;
  category: string;
  price: number;
  status?: ResourceStatus;
}

export interface UpdateResourceDTO {
  title?: string;
  description?: string;
  category?: string;
  price?: number;
  status?: ResourceStatus;
}

export interface ResourceFilterQuery {
  search?: string;
  category?: string;
  status?: ResourceStatus;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
