import { Router } from 'express';
import { create, findAll, findOne, remove, update, sanitizeInputAS } from './appointmentStatus.controller.js';

export const appointmentStatusRouter = Router();
// Get all typeAppointmentStatus
appointmentStatusRouter.get('/findAll', findAll);

// Get one typeAppointmentStatus by id

appointmentStatusRouter.get('/findOne/:id', findOne); 

// Create a new typeAppointmentStatus
appointmentStatusRouter.post('/create', sanitizeInputAS ,create);

// Update a typeAppointmentStatus by id
appointmentStatusRouter.post("/update/:id", sanitizeInputAS, update);

// Remove a typeAppointmentStatus by id
appointmentStatusRouter.delete('/remove/:id', remove);