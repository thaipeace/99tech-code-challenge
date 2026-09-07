import { Router } from 'express';
import { ResourceController } from '../controllers/resource.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  createResourceSchema,
  resourceFilterQuerySchema,
  resourceIdParamSchema,
  updateResourceSchema,
} from '../schemas/resource.schema';

const router = Router();
const controller = new ResourceController();

// 1. Create a resource
router.post(
  '/',
  validate(createResourceSchema, 'body'),
  controller.create
);

// 2. List resources with basic filters & pagination
router.get(
  '/',
  validate(resourceFilterQuerySchema, 'query'),
  controller.list
);

// 3. Get details of a resource
router.get(
  '/:id',
  validate(resourceIdParamSchema, 'params'),
  controller.getById
);

// 4. Update resource details (supports both PUT and PATCH)
router.put(
  '/:id',
  validate(resourceIdParamSchema, 'params'),
  validate(updateResourceSchema, 'body'),
  controller.update
);

router.patch(
  '/:id',
  validate(resourceIdParamSchema, 'params'),
  validate(updateResourceSchema, 'body'),
  controller.update
);

// 5. Delete a resource
router.delete(
  '/:id',
  validate(resourceIdParamSchema, 'params'),
  controller.delete
);

export default router;
