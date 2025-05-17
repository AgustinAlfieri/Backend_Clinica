import { Router } from 'express';
import {findAll, findOne, create, update, remove, sanitizeInputAST} from "./typeAppointmentStatus.controller.js";


export const typeAppointmentStatusRouter = Router();
// Get all typeAppointmentStatus
typeAppointmentStatusRouter.get('/', findAll);

// Get one typeAppointmentStatus by id
typeAppointmentStatusRouter.get('/:id', findOne);

// Create a new typeAppointmentStatus
typeAppointmentStatusRouter.post('/', sanitizeInputAST ,create);

// Update a typeAppointmentStatus by id
typeAppointmentStatusRouter.put("/:id", sanitizeInputAST, update);

// Remove a typeAppointmentStatus by id
typeAppointmentStatusRouter.delete('/:id', remove);
