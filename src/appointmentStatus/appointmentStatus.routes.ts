import { Router } from 'express';
import { create, findAll, findOne, remove, update } from './appointmentStatus.controller.js';
import { authMiddleware } from '../shared/middlewares/auth.middleware.js';
import { validateInput } from '../shared/middlewares/validateInput.js';
import { appointmentStatusSchema } from '../shared/schemas/appointmentRelatedSchemas.js'

export const appointmentStatusRouter = Router();
// Get all typeAppointmentStatus
appointmentStatusRouter.get('/findAll', authMiddleware, validateInput({ location: 'body', schema: appointmentStatusSchema }), findAll);

// Get one typeAppointmentStatus by id

appointmentStatusRouter.get('/findOne/:id', authMiddleware, validateInput({ location: 'body', schema: appointmentStatusSchema }), findOne); 

// Create a new typeAppointmentStatus
appointmentStatusRouter.post('/create', authMiddleware, validateInput({ location: 'body', schema: appointmentStatusSchema }) ,create);

// Update a typeAppointmentStatus by id
appointmentStatusRouter.post("/update/:id", authMiddleware, validateInput({ location: 'body', schema: appointmentStatusSchema }), update);

// Remove a typeAppointmentStatus by id
appointmentStatusRouter.delete('/remove/:id', authMiddleware, validateInput({ location: 'body', schema: appointmentStatusSchema }), remove);