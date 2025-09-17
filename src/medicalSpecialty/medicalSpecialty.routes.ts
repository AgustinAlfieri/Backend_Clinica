import { Router } from 'express';
import { findAll, findOne, update, remove, create } from './medicalSpecialty.controller.js';

export const medicalSpecialtyRouter = Router();

medicalSpecialtyRouter.get('/findAll', findAll);
medicalSpecialtyRouter.get('/findOne/:id', findOne);
medicalSpecialtyRouter.post('/create', create);
medicalSpecialtyRouter.post('/update/:id', update);
medicalSpecialtyRouter.delete('/remove/:id', remove);
