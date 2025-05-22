import { Router } from 'express';
import { create, findAll, findOne, remove, update, sanitizeInputAS } from './appointmentStatus.controller.js';

export const AppointmentStatusRouter = Router();
// Get all typeAppointmentStatus
AppointmentStatusRouter.get('/findAll', findAll);

// Get one typeAppointmentStatus by id

AppointmentStatusRouter.get('/findOne/:id', findOne); 

// Create a new typeAppointmentStatus
AppointmentStatusRouter.post('/create', sanitizeInputAS ,create);

// Update a typeAppointmentStatus by id
AppointmentStatusRouter.put("/update/:id", sanitizeInputAS, update);

// Remove a typeAppointmentStatus by id
AppointmentStatusRouter.delete('/remove/:id', remove);