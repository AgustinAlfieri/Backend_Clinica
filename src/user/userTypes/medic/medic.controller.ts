import { orm } from '../../../shared/database/orm.js';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../../../shared/logger/logger.js';
import { MedicService } from './medic.service.js';
import { ResponseManager } from '../../../shared/helpers/responseHelper.js';
import { resolveMessage } from '../../../shared/errorManagment/appError.js';

const em = orm.em.fork();

async function findAll(req: Request, res: Response) {
  try {
    const medicService = new MedicService(em);
    const medics = await medicService.findAll();

    if (!medics) {
      ResponseManager.notFound(res, 'No se encontraron medicos');
      return;
    }

    ResponseManager.success(res, medics, 'Medicos encontrados', StatusCodes.ACCEPTED);
  } catch (error) {
    logger.error('Error en busqueda de medicos:', error);

    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, 'Error al obtener los medicos', errorMessage, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id: string = req.params.id;

    const medicService = new MedicService(em);
    const medic = await medicService.findOne(id);

    if (!medic) {
      ResponseManager.notFound(res, 'Medico no encontrado');
      return;
    }

    ResponseManager.success(res, medic, 'Medico encontrado', StatusCodes.ACCEPTED);
  } catch (error) {
    logger.error('Error en busqueda de medico:', error);

    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, 'Error al obtener el medico', errorMessage, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function create(req: Request, res: Response) {
  try {
    const medicService = new MedicService(em);
    const medicCreated = await medicService.create(req.body);

    if (!medicCreated) {
      ResponseManager.badRequest(res, 'No se pudo crear el medico');
      return;
    }

    ResponseManager.success(res, medicCreated, 'Medico creado', StatusCodes.CREATED);
  } catch (error) {
    logger.error('Error al crear medico:', error);

    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, 'Error al crear el medico', errorMessage, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;

    const medicService = new MedicService(em);
    await medicService.update(id, req.body);

    ResponseManager.success(res, null, 'Medico modificado', StatusCodes.OK);
  } catch (error) {
    logger.error('Error al modificar medico:', error);

    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, 'Error al modificar el medico', errorMessage, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;

    const medicService = new MedicService(em);
    await medicService.remove(id);

    ResponseManager.success(res, null, 'Medico eliminado', StatusCodes.OK);
  } catch (error) {
    logger.error('Error al eliminar medico:', error);

    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, 'Error al eliminar el medico', errorMessage, StatusCodes.INTERNAL_SERVER_ERROR);
  }
  return;
}

export { findAll, findOne, update, create, remove };
