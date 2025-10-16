import { orm } from '../shared/database/orm.js';
import { NextFunction, Request, Response } from 'express';
import { MedicalInsurance } from './medicalInsurance.entity.js';
import { AppError, resolveMessage } from '../shared/errorManagment/appError.js';
import { StatusCodes } from 'http-status-codes';
import { MedicalInsuranceService } from './medicalInsurance.service.js';
import { ResponseManager } from '../shared/helpers/responseHelper.js';
import { logger } from '../shared/logger/logger.js';

const em = orm.em.fork();

async function findAllForRegister(req: Request, res: Response) {
  try {
    //Solo trae id y name
    const medicalInsuranceService = new MedicalInsuranceService(em);
    const medicalInsurances = await medicalInsuranceService.findAllForRegister();
    if (!medicalInsurances) {
      ResponseManager.notFound(res, 'No se encontraron obras sociales');
      return;
    }

    ResponseManager.success(res, medicalInsurances, 'Obras Sociales obtenidas', StatusCodes.OK);
  } catch (error) {
    logger.error('Error al obtener las Obras Sociales', { error });

    ResponseManager.error(
      res,
      resolveMessage(error),
      'Error al obtener las Obras Sociales',
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function findAll(req: Request, res: Response) {
  const medicalInsurances = await em.find(MedicalInsurance, {}, { populate: ['practices', 'patients'] });

  if (!medicalInsurances) throw new AppError('Obras Sociales no encontradas', StatusCodes.NOT_FOUND);

  res.status(StatusCodes.OK).send(medicalInsurances);
}

async function findOne(req: Request, res: Response) {
  const id = req.params.id;
  const medicalInsurance = await em.findOne(MedicalInsurance, id, {
    populate: ['practices', 'patients']
  });

  if (!medicalInsurance) throw new AppError('Obra Social no encontrada', StatusCodes.NOT_FOUND);

  res.status(StatusCodes.OK).send(medicalInsurance);
}

async function update(req: Request, res: Response) {
  const id = req.params.id;
  const medicalInsurance = await em.findOneOrFail(MedicalInsurance, id, { populate: ['practices', 'patients'] });

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

export { findAllForRegister, findAll, findOne, update, create, remove };
