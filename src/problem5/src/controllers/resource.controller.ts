import { NextFunction, Request, Response } from 'express';
import { CreateResourceDTO, ResourceFilterQuery, UpdateResourceDTO } from '../models/resource.model';
import { ResourceService } from '../services/resource.service';

export class ResourceController {
  private service: ResourceService;

  constructor() {
    this.service = new ResourceService();
  }

  create = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const dto: CreateResourceDTO = req.body;
      const created = this.service.createResource(dto);
      res.status(201).json({
        success: true,
        data: created,
        message: 'Resource created successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  list = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const query = req.query as unknown as ResourceFilterQuery;
      const result = this.service.getResources(query);
      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

  getById = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = Number(req.params.id);
      const resource = this.service.getResourceById(id);
      res.status(200).json({
        success: true,
        data: resource,
      });
    } catch (error) {
      next(error);
    }
  };

  update = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = Number(req.params.id);
      const dto: UpdateResourceDTO = req.body;
      const updated = this.service.updateResource(id, dto);
      res.status(200).json({
        success: true,
        data: updated,
        message: 'Resource updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  delete = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = Number(req.params.id);
      this.service.deleteResource(id);
      res.status(200).json({
        success: true,
        message: 'Resource deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
