import { Router } from 'express';
import { create, findAll, findOne, remove, update } from './appointmentStatus.controller.js';
import { authMiddleware } from '../shared/middlewares/auth.middleware.js';
import { validateInput } from '../shared/middlewares/validateInput.js';
import { appointmentStatusSchema } from '../shared/schemas/appointmentRelatedSchemas.js';

export const appointmentStatusRouter = Router();
appointmentStatusRouter.get(
  '/findAll',
  authMiddleware('AppointmentStatus', 'view'),
  validateInput({ location: 'body', schema: appointmentStatusSchema }),
  findAll
);
appointmentStatusRouter.get(
  '/findOne/:id',
  authMiddleware('AppointmentStatus', 'view'),
  validateInput({ location: 'body', schema: appointmentStatusSchema }),
  findOne
);
appointmentStatusRouter.post(
  '/create',
  authMiddleware('AppointmentStatus', 'create'),
  validateInput({ location: 'body', schema: appointmentStatusSchema }),
  create
);
appointmentStatusRouter.post(
  '/update/:id',
  authMiddleware('AppointmentStatus', 'update'),
  validateInput({ location: 'body', schema: appointmentStatusSchema }),
  update
);
appointmentStatusRouter.delete(
  '/remove/:id',
  authMiddleware('AppointmentStatus', 'delete'),
  validateInput({ location: 'body', schema: appointmentStatusSchema }),
  remove
);
