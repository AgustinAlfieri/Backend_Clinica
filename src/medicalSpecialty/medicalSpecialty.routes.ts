import { Router } from 'express';
import { findAll, findOne, update, remove, create } from './medicalSpecialty.controller.js';
import { authMiddleware } from '../shared/middlewares/auth.middleware.js';
import { validateInput } from '../shared/middlewares/validateInput.js';
import { medicalSpecialtySchema } from '../shared/schemas/appointmentRelatedSchemas.js'

export const medicalSpecialtyRouter = Router();

medicalSpecialtyRouter.get('/findAll',authMiddleware, validateInput({ location: 'body', schema: medicalSpecialtySchema }), findAll);
medicalSpecialtyRouter.get('/findOne/:id',authMiddleware, validateInput({ location: 'body', schema: medicalSpecialtySchema }), findOne);
medicalSpecialtyRouter.post('/create',authMiddleware, validateInput({ location: 'body', schema: medicalSpecialtySchema }), create);
medicalSpecialtyRouter.post('/update/:id',authMiddleware, validateInput({ location: 'body', schema: medicalSpecialtySchema }), update);
medicalSpecialtyRouter.delete('/remove/:id',authMiddleware, validateInput({ location: 'body', schema: medicalSpecialtySchema }), remove);
