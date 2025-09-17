import { Router } from 'express';
import {findAll, findOne, create, update, remove } from "./typeAppointmentStatus.controller.js";


export const typeAppointmentStatusRouter = Router();
// Get all typeAppointmentStatus
typeAppointmentStatusRouter.get('/findAll', findAll);

// Get one typeAppointmentStatus by id
typeAppointmentStatusRouter.get('/findOne/:id', findOne); 

// Create a new typeAppointmentStatus
typeAppointmentStatusRouter.post('/create' ,create);

// Update a typeAppointmentStatus by id
typeAppointmentStatusRouter.put("/update/:id", update);

// Remove a typeAppointmentStatus by id
typeAppointmentStatusRouter.delete('/remove/:id', remove);
