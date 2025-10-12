import { Router } from 'express';
import { findAll, findOne, create, update, remove } from './typeAppointmentStatus.controller.js';
import { authMiddleware } from '../shared/middlewares/auth.middleware.js';
import { validateInput } from '../shared/middlewares/validateInput.js';
import { typeAppointmentStatusSchema } from '../shared/schemas/appointmentRelatedSchemas.js';

export const typeAppointmentStatusRouter = Router();
// Get all typeAppointmentStatus
typeAppointmentStatusRouter.get(
  '/findAll',
  findAll,
  authMiddleware,
  validateInput({ location: 'body', schema: typeAppointmentStatusSchema }),
  findAll
);

// Get one typeAppointmentStatus by id
typeAppointmentStatusRouter.get(
  '/findOne/:id',
  findOne,
  authMiddleware,
  validateInput({ location: 'body', schema: typeAppointmentStatusSchema }),
  findOne
);

// Create a new typeAppointmentStatus
typeAppointmentStatusRouter.post(
  '/create',
  create,
  authMiddleware,
  validateInput({ location: 'body', schema: typeAppointmentStatusSchema }),
  create
);

// Update a typeAppointmentStatus by id
typeAppointmentStatusRouter.post(
  '/update/:id',
  update,
  authMiddleware,
  validateInput({ location: 'body', schema: typeAppointmentStatusSchema }),
  update
);

// Remove a typeAppointmentStatus by id
typeAppointmentStatusRouter.delete(
  '/remove/:id',
  remove,
  authMiddleware,
  validateInput({ location: 'body', schema: typeAppointmentStatusSchema }),
  remove
);
