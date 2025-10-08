import { orm } from '../shared/database/orm.js';
import { NextFunction, Request, Response } from 'express';
import { MedicalInsurance } from './medicalInsurance.entity.js';
import { AppError } from '../shared/errorManagment/appError.js';
import { StatusCodes } from 'http-status-codes';

const em = orm.em.fork();

function sanitizeInputMedicalInsurance(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    coveredPractices: req.body.coveredPractices,
    clients: req.body.clients
  };
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

async function findAll(req: Request, res: Response) {
  const medicalInsurances = await em.find(MedicalInsurance, {}, { populate: ['coveredPractices', 'clients'] });

  if (!medicalInsurances) throw new AppError('Obras Sociales no encontradas', StatusCodes.NOT_FOUND);

  res.status(StatusCodes.OK).send(medicalInsurances);
}

async function findOne(req: Request, res: Response) {
  const id = req.params.id;
  const medicalInsurance = await em.findOne(MedicalInsurance, id, {
    populate: ['coveredPractices', 'clients']
  });

  if (!medicalInsurance) throw new AppError('Obra Social no encontrada', StatusCodes.NOT_FOUND);

  res.status(StatusCodes.OK).send(medicalInsurance);
}

async function update(req: Request, res: Response) {
  const id = req.params.id;
  const medicalInsurance = await em.findOneOrFail(MedicalInsurance, id, { populate: ['coveredPractices', 'clients'] });

  const medicalInsuranceUpdated = em.assign(medicalInsurance, req.body.sanitizedInput);

  if (!medicalInsuranceUpdated) throw new AppError('Error al modificar la obra social', StatusCodes.NOT_MODIFIED);

  await em.flush();

  res.status(StatusCodes.OK).send(medicalInsuranceUpdated);
}

async function create(req: Request, res: Response) {
  const medicalInsurance = em.create(MedicalInsurance, req.body.sanitizedInput);
  await em.flush();
  if (!medicalInsurance) throw new AppError('Error al crear la obra social', StatusCodes.INTERNAL_SERVER_ERROR);
  res.status(StatusCodes.CREATED).send(medicalInsurance);
}

async function remove(req: Request, res: Response) {
  const id = req.params.id;
  const deleteMedicalInsurance = em.getReference(MedicalInsurance, id);

  await em.removeAndFlush(deleteMedicalInsurance);

  res.status(StatusCodes.ACCEPTED).send('Especialidad médica eliminada');
}

export { sanitizeInputMedicalInsurance, findAll, findOne, update, create, remove };
