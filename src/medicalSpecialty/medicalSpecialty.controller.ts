import { orm } from '../shared/database/orm.js';
import { NextFunction, Request, Response } from 'express';
import { MedicalSpecialty } from './medicalSpecialty.entity.js';
import { AppError } from '../shared/errorManagment/appError.js';
import { StatusCodes } from 'http-status-codes';

const em = orm.em;

function sanitizeInputMedicalSpecialty(req: Request, _: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    practices: req.body.practices,
    medics: req.body.medics
  };
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}
async function findAll(req: Request, res: Response) {
  const specialties = await em.find(MedicalSpecialty, {}, { populate: ['practices', 'medicalProfessionals'] });

  if (!specialties) throw new AppError('Especialidades médicas no encontradas', StatusCodes.NOT_FOUND);

  res.status(StatusCodes.OK).send(specialties);
}

async function findOne(req: Request, res: Response) {
  throw new AppError('Not implemented', StatusCodes.BAD_GATEWAY);
}
async function update(req: Request, res: Response) {
  const id: string = req.params.id;
  const medicalSpecialty = await em.findOneOrFail(MedicalSpecialty, { id });

  const medicalSpecialtyUpdated = em.assign(medicalSpecialty, req.body.sanitizedInput);

  if (!medicalSpecialtyUpdated)
    throw new AppError('Error al modificar la especialidad médica', StatusCodes.NOT_MODIFIED);

  await em.flush();

  res.status(StatusCodes.OK).send(medicalSpecialtyUpdated);
}

async function create(req: Request, res: Response) {
  const medicalSpecialty = em.create(MedicalSpecialty, req.body.sanitizedInput);
  await em.flush();
  if (!medicalSpecialty) throw new AppError('Error al crear la especialidad médica', StatusCodes.INTERNAL_SERVER_ERROR);
  res.status(StatusCodes.CREATED).send(medicalSpecialty);
}
async function remove(req: Request, res: Response) {
  throw new AppError('Not implemented', StatusCodes.BAD_GATEWAY);
}

export { sanitizeInputMedicalSpecialty, findAll, findOne, update, create, remove };
