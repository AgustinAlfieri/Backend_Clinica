import { Router } from 'express';
import { findAllForRegister, findAll, findOne, create, update, remove } from './medicalInsurance.controller.js';
import { authMiddleware } from '../shared/middlewares/auth.middleware.js';
import { validateInput } from '../shared/middlewares/validateInput.js';
import { medicalInsuranceSchema } from '../shared/schemas/appointmentRelatedSchemas.js';

export const medicalInsuranceRouter = Router();

// Ruta sin autenticación para el registro de los pacientes
// Solo devuelve id y name de las obras sociales.
medicalInsuranceRouter.get(
  '/findAllForRegister',
  validateInput({ location: 'body', schema: medicalInsuranceSchema }),
  findAllForRegister
);

medicalInsuranceRouter.get(
  '/findAll',
  authMiddleware('MedicalInsurance', 'view'),
  validateInput({ location: 'body', schema: medicalInsuranceSchema }),
  findAll
);
medicalInsuranceRouter.get(
  '/findOne/:id',
  authMiddleware('MedicalInsurance', 'view'),
  validateInput({ location: 'body', schema: medicalInsuranceSchema }),
  findOne
);
medicalInsuranceRouter.post(
  '/update/:id',
  authMiddleware('MedicalInsurance', 'update'),
  validateInput({ location: 'body', schema: medicalInsuranceSchema }),
  update
);
medicalInsuranceRouter.post(
  '/create',
  authMiddleware('MedicalInsurance', 'create'),
  validateInput({ location: 'body', schema: medicalInsuranceSchema }),
  create
);
medicalInsuranceRouter.delete(
  '/remove/:id',
  authMiddleware('MedicalInsurance', 'delete'),
  validateInput({ location: 'body', schema: medicalInsuranceSchema }),
  remove
);
