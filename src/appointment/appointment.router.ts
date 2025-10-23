import { Router } from 'express';
import { findAppointmentByFilter, findOne, findAll, remove, create, update } from './appointment.controller.js';
import { authMiddleware } from '../shared/middlewares/auth.middleware.js';
import { validateInput } from '../shared/middlewares/validateInput.js';
import { appointmentFilters, appointmentSchema } from '../shared/schemas/appointmentRelatedSchemas.js';

export const appointmentRouter = Router();

appointmentRouter.get(
  '/findAppointmentByFilter',
  //authMiddleware('Appointment', 'view'),
  validateInput({ location: 'body', schema: appointmentFilters }),
  findAppointmentByFilter
);

appointmentRouter.get(
  '/findAll',
  authMiddleware('Appointment', 'view'),
  validateInput({ location: 'body', schema: appointmentSchema }),
  findAll
);
appointmentRouter.get(
  '/findOne/:id',
  authMiddleware('Appointment', 'view'),
  validateInput({ location: 'body', schema: appointmentSchema }),
  findOne
);
appointmentRouter.post(
  '/create',
  authMiddleware('Appointment', 'create'),
  validateInput({ location: 'body', schema: appointmentSchema }),
  create
);
appointmentRouter.post(
  '/update/:id',
  authMiddleware('Appointment', 'update'),
  validateInput({ location: 'body', schema: appointmentSchema }),
  update
);
appointmentRouter.delete(
  '/remove/:id',
  authMiddleware('Appointment', 'delete'),
  validateInput({ location: 'body', schema: appointmentSchema }),
  remove
);

export default appointmentRouter;
