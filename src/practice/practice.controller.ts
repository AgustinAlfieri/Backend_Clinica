import { orm } from '../shared/database/orm.js';
import { Request, Response } from 'express';
import { AppError, resolveMessage } from '../shared/errorManagment/appError.js';
import { StatusCodes } from 'http-status-codes';
import { PracticeService } from './practice.service.js';
import { ResponseManager } from '../shared/helpers/responseHelper.js';
import { logger } from '../shared/logger/logger.js';

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const practiceService = new PracticeService(em);
    const practices = await practiceService.findAll();

    if (!practices) {
      ResponseManager.notFound(res, 'No se encontraron practicas');
      return;
    }

    ResponseManager.success(res, practices, 'Practicas encontradas', StatusCodes.OK);
  } catch (error) {
    logger.error('Error al obtener las practicas', { error });

    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, errorMessage, 'Error al obtener las practicas', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;

    const practiceService = new PracticeService(em);
    const practice = await practiceService.findOne(id);

    if (!practice) {
      ResponseManager.notFound(res, 'No se encontró la practica');
      return;
    }

    ResponseManager.success(res, practice, 'Practica encontrada', StatusCodes.OK);
  } catch (error) {
    logger.error('Error al obtener la practica', { error });

    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, errorMessage, 'Error al obtener la practica', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;

    const practiceService = new PracticeService(em);
    await practiceService.update(id, req.body);

    ResponseManager.success(res, null, 'Practica actualizada', StatusCodes.OK);
  } catch (error) {
    logger.error('Error al actualizar la practica', { error });

    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, errorMessage, 'Error al actualizar la practica', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function create(req: Request, res: Response) {
  try {
    const practiceService = new PracticeService(em);
    const newPractice = await practiceService.create(req.body);

    ResponseManager.success(res, newPractice, 'Practica creada', StatusCodes.CREATED);
  } catch (error) {
    logger.error('Error al crear la practica', { error });

    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, errorMessage, 'Error al crear la practica', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;

    const practiceService = new PracticeService(em);
    const deletedPractice = await practiceService.delete(id);

    ResponseManager.success(res, deletedPractice, 'Practica eliminada', StatusCodes.OK);
  } catch (error) {
    logger.error('Error al eliminar la practica', { error });

    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, errorMessage, 'Error al eliminar la practica', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export { findAll, findOne, update, create, remove };
