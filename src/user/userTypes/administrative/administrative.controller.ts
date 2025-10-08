import { orm } from '../../../shared/database/orm.js';
import { NextFunction, Request, Response } from 'express';
import { Administrative } from './administrative.entity.js';
import { Appointment } from '../../../appointment/appointment.entity.js'; //No esta creado, va a dar error
import { AppError, resolveMessage } from '../../../shared/errorManagment/appError.js';
import { StatusCodes } from 'http-status-codes';
import { Role } from '../../../shared/enums/role.enum.js';
import { logger } from '../../../shared/logger/logger.js';
import { AdministrativeService } from './administrative.service.js';
import { ResponseManager } from '../../../shared/helpers/responseHelper.js';

const em = orm.em.fork();

async function findAll(req: Request, res: Response) {
  try{
    const aService = new AdministrativeService(em);
    const administratives = await aService.findAll();

    if(!administratives) {
      ResponseManager.notFound(res, 'No se encontraron administrativos');
      return;
    }

    ResponseManager.success(res, administratives, 'Administrativos encontrados', StatusCodes.ACCEPTED);
  } catch(error){
    logger.error(error);

    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, 'Error al obtener los administrativos', errorMessage, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function findOne(req: Request, res: Response) {
  try{
    const id: string = req.params.id;

    const aService = new AdministrativeService(em);
    const administrative = await aService.findOne(id);

    if (!administrative) {
      ResponseManager.notFound(res, 'Administrativo no encontrado');
      return;
    }

    ResponseManager.success(res, administrative, 'Administrativo encontrado', StatusCodes.ACCEPTED);
  } catch (error) {
    logger.error(error);

    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, 'Error al obtener el administrativo', errorMessage, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function create(req: Request, res: Response) {
  try {
    const aService = new AdministrativeService(em);
    const administrative = await aService.create(req.body);

    if(!administrative) {
      ResponseManager.badRequest(res, 'No se pudo crear el administrativo');
      return;
    }

    ResponseManager.success(res, administrative, 'Administrativo creado', StatusCodes.CREATED);
  } catch (error) {
    logger.error(error);

    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, 'Error al crear el administrativo', errorMessage, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function update(req: Request, res: Response) {
  try {
    const id: string = req.params.id;

    const aService = new AdministrativeService(em);
    const administrative = await aService.update(id, req.body);

    if(!administrative) {
      ResponseManager.badRequest(res, 'No se pudo actualizar el administrativo');
      return;
    }

    ResponseManager.success(res, administrative, 'Administrativo actualizado', StatusCodes.ACCEPTED);
  } catch (error) {
    logger.error(error);

    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, 'Error al actualizar el administrativo', errorMessage, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id: string = req.params.id;

    const aService = new AdministrativeService(em);
    const administrative = await aService.remove(id);

    if(!administrative) {
      ResponseManager.badRequest(res, 'No se pudo eliminar el administrativo');
      return;
    }

    ResponseManager.success(res, null, 'Administrativo eliminado', StatusCodes.ACCEPTED);
  } catch (error) {
    logger.error(error);

    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, 'Error al eliminar el administrativo', errorMessage, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export { findAll, findOne, create, update, remove };