import { Router } from 'express';
import { findAll, findOne, update, remove, create } from './medicalSpecialty.controller.js';
import { authMiddleware } from '../shared/middlewares/auth.middleware.js';
import { validateInput } from '../shared/middlewares/validateInput.js';
import { medicalSpecialtySchema } from '../shared/schemas/appointmentRelatedSchemas.js';

export const medicalSpecialtyRouter = Router();

medicalSpecialtyRouter.get(
  '/findAll',
  authMiddleware('MedicalSpecialty', 'view'),
  validateInput({ location: 'body', schema: medicalSpecialtySchema }),
  findAll
);
medicalSpecialtyRouter.get(
  '/findOne/:id',
  authMiddleware('MedicalSpecialty', 'view'),
  validateInput({ location: 'body', schema: medicalSpecialtySchema }),
  findOne
);
medicalSpecialtyRouter.post(
  '/create',
  authMiddleware('MedicalSpecialty', 'create'),
  validateInput({ location: 'body', schema: medicalSpecialtySchema }),
  create
);
medicalSpecialtyRouter.post(
  '/update/:id',
  authMiddleware('MedicalSpecialty', 'update'),
  validateInput({ location: 'body', schema: medicalSpecialtySchema }),
  update
);
medicalSpecialtyRouter.delete(
  '/remove/:id',
  authMiddleware('MedicalSpecialty', 'delete'),
  validateInput({ location: 'body', schema: medicalSpecialtySchema }),
  remove
);
