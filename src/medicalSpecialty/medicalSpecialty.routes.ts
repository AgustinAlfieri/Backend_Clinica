import { Router } from 'express';
import {
  findAll,
  findOne,
  update,
  remove,
  create,
  sanitizeInputMedicalSpecialty
} from './medicalSpecialty.controller.js';

export const medicalSpecialtyRouter = Router();

medicalSpecialtyRouter.get('/findAll', findAll);
medicalSpecialtyRouter.get('/findOne/:id', findOne);
medicalSpecialtyRouter.post('/create', sanitizeInputMedicalSpecialty, create);
medicalSpecialtyRouter.post('/update/:id', sanitizeInputMedicalSpecialty, update);
medicalSpecialtyRouter.delete('/remove/:id', remove);
