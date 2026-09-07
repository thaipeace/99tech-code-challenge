import {
  CreateResourceDTO,
  PaginatedResult,
  Resource,
  ResourceFilterQuery,
  UpdateResourceDTO,
} from '../models/resource.model';
import { ResourceRepository } from '../repositories/resource.repository';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}

export class ResourceService {
  private repository: ResourceRepository;

  constructor() {
    this.repository = new ResourceRepository();
  }

  createResource(dto: CreateResourceDTO): Resource {
    return this.repository.create(dto);
  }

  getResources(query: ResourceFilterQuery): PaginatedResult<Resource> {
    return this.repository.findAll(query);
  }

  getResourceById(id: number): Resource {
    const resource = this.repository.findById(id);
    if (!resource) {
      throw new AppError(`Resource with ID ${id} not found`, 404);
    }
    return resource;
  }

  updateResource(id: number, dto: UpdateResourceDTO): Resource {
    // Check if resource exists
    this.getResourceById(id);

    const updated = this.repository.update(id, dto);
    if (!updated) {
      throw new AppError(`Failed to update resource with ID ${id}`, 400);
    }
    return updated;
  }

  deleteResource(id: number): void {
    // Check if resource exists
    this.getResourceById(id);

    const deleted = this.repository.delete(id);
    if (!deleted) {
      throw new AppError(`Failed to delete resource with ID ${id}`, 400);
    }
  }
}
