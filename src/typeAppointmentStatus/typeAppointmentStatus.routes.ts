import { Router } from 'express';
import { findAll, findOne, create, update, remove } from './typeAppointmentStatus.controller.js';
import { authMiddleware } from '../shared/middlewares/auth.middleware.js';
import { validateInput } from '../shared/middlewares/validateInput.js';
import { typeAppointmentStatusSchema } from '../shared/schemas/appointmentRelatedSchemas.js';

export const typeAppointmentStatusRouter = Router();
typeAppointmentStatusRouter.get(
  '/findAll',
  authMiddleware('TypeAppointmentStatus', 'view'),
  validateInput({ location: 'body', schema: typeAppointmentStatusSchema }),
  findAll
);
typeAppointmentStatusRouter.get(
  '/findOne/:id',
  authMiddleware('TypeAppointmentStatus', 'view'),
  validateInput({ location: 'body', schema: typeAppointmentStatusSchema }),
  findOne
);
typeAppointmentStatusRouter.post(
  '/create',
  authMiddleware('TypeAppointmentStatus', 'create'),
  validateInput({ location: 'body', schema: typeAppointmentStatusSchema }),
  create
);
typeAppointmentStatusRouter.post(
  '/update/:id',
  authMiddleware('TypeAppointmentStatus', 'update'),
  validateInput({ location: 'body', schema: typeAppointmentStatusSchema }),
  update
);
typeAppointmentStatusRouter.delete(
  '/remove/:id',
  authMiddleware('TypeAppointmentStatus', 'delete'),
  validateInput({ location: 'body', schema: typeAppointmentStatusSchema }),
  remove
);
