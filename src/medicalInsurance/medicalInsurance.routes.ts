import { Router } from 'express';
import {
  findAll,
  findOne,
  create,
  update,
  remove
} from './medicalInsurance.controller.js';
import { authMiddleware } from '../shared/middlewares/auth.middleware.js';
import { validateInput } from '../shared/middlewares/validateInput.js';
import { medicalInsuranceSchema } from '../shared/schemas/appointmentRelatedSchemas.js'

export const medicalInsuranceRouter = Router();

medicalInsuranceRouter.get('/findAll', authMiddleware, validateInput({ location: 'body', schema: medicalInsuranceSchema }), findAll);
medicalInsuranceRouter.get('/findOne/:id', authMiddleware, validateInput({ location: 'body', schema: medicalInsuranceSchema }), findOne);
medicalInsuranceRouter.post('/update/:id', authMiddleware, validateInput({ location: 'body', schema: medicalInsuranceSchema }), update);
medicalInsuranceRouter.post('/create', authMiddleware, validateInput({ location: 'body', schema: medicalInsuranceSchema }), create);
medicalInsuranceRouter.delete('/remove/:id', authMiddleware, validateInput({ location: 'body', schema: medicalInsuranceSchema }), remove);
