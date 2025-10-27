import { orm } from '../shared/database/orm.js';
import { Request, Response } from 'express';
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
  try {
    const medicalInsuranceService = new MedicalInsuranceService(em);
    const medicalInsurance = await medicalInsuranceService.findAll();

    if (!medicalInsurance) {
      ResponseManager.notFound(res, 'No se encontraron obras sociales');
      return;
    }

    ResponseManager.success(res, medicalInsurance, 'Obras sociales obtenidas', StatusCodes.OK);
  } catch (error: any) {
    logger.error(error);
    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, errorMessage, 'Error al obtener obras sociales', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id: string = req.params.id;
    const medicalInsuranceService = new MedicalInsuranceService(em);
    const medicalInsurance = await medicalInsuranceService.findOne(id);

    if (!medicalInsurance) {
      ResponseManager.notFound(res, 'Obra social no encontrada');
      return;
    }

    ResponseManager.success(res, medicalInsurance, 'Obra social encontrada', StatusCodes.OK);
  } catch (error: any) {
    logger.error(error);
    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, errorMessage, 'Error al obtener Obra social', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function update(req: Request, res: Response) {
  try {
    const id: string = req.params.id;

    const medicalInsuranceService = new MedicalInsuranceService(em);
    const medicalInsurance = await medicalInsuranceService.update(id, req.body);

    ResponseManager.success(res, medicalInsurance, 'Obra social actualizada', StatusCodes.OK);
  } catch (error) {
    logger.error(error);

    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, errorMessage, 'Error al actualizar obra social', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function create(req: Request, res: Response) {
  try {
    const medicalInsuranceService = new MedicalInsuranceService(em);
    const medicalInsurance = await medicalInsuranceService.create(req.body);

    if (!medicalInsurance) {
      ResponseManager.badRequest(res, 'No se pudo crear la obra social', '', StatusCodes.BAD_REQUEST);
      return;
    }

    ResponseManager.success(res, medicalInsurance, 'Obra social creada', StatusCodes.CREATED);
  } catch (error) {
    logger.error(error);

    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, errorMessage, 'Error al crear obra social', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id: string = req.params.id;

    const medicalInsuranceService = new MedicalInsuranceService(em);
    const medicalInsurance = await medicalInsuranceService.remove(id);

    if (!medicalInsurance) {
      ResponseManager.notFound(res, 'No se pudo eliminar la obra social');
      return;
    }

    ResponseManager.success(res, null, 'Obra social eliminada', StatusCodes.OK);
  } catch (error) {
    logger.error(error);

    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, errorMessage, 'Error al eliminar la obra social', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export { findAllForRegister, findAll, findOne, update, create, remove };
