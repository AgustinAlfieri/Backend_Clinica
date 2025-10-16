import { Router } from 'express';
import { findAll, findOne, update, create, remove } from './patient.controller.js';
import { authMiddleware } from '../../../shared/middlewares/auth.middleware.js';
import { validateInput } from '../../../shared/middlewares/validateInput.js';
import { patientSchema } from '../../../shared/schemas/userSchemas.js';

export const patientRouter = Router();

patientRouter.get(
  '/findAll',
  authMiddleware('Patient', 'view'),
  validateInput({ location: 'body', schema: patientSchema }),
  findAll
);
patientRouter.get(
  '/findOne/:id',
  authMiddleware('Patient', 'view'),
  validateInput({ location: 'body', schema: patientSchema }),
  findOne
);
patientRouter.post(
  '/create',
  authMiddleware('Patient', 'create'),
  validateInput({ location: 'body', schema: patientSchema }),
  create
);
patientRouter.post(
  '/update/:id',
  authMiddleware('Patient', 'update'),
  validateInput({ location: 'body', schema: patientSchema }),
  update
);
patientRouter.delete(
  '/remove/:id',
  authMiddleware('Patient', 'delete'),
  validateInput({ location: 'body', schema: patientSchema }),
  remove
);
