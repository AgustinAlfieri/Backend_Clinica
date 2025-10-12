import { orm } from '../shared/database/orm.js';
import { Request, Response } from 'express';
import { TypeAppointmentStatusService } from './typeAppointmentStatus.service.js';
import { StatusCodes } from 'http-status-codes';
import { ResponseManager } from '../shared/helpers/responseHelper.js';
import { logger } from '../shared/logger/logger.js';
import { resolveMessage } from '../shared/errorManagment/appError.js';

const em = orm.em.fork();

async function findAll(req: Request, res: Response) {
  try {
    const typeAppointmentStatusService = new TypeAppointmentStatusService(em);
    const typeAppointmentStatus = await typeAppointmentStatusService.findAll();

    if (!typeAppointmentStatus) {
      ResponseManager.notFound(res, 'No se encontraron Tipos de estado de turnos');
      return;
    }

    ResponseManager.success(res, typeAppointmentStatus, 'Tipos de estado de turnos encontrados', StatusCodes.ACCEPTED);
  } catch (error) {
    logger.error('Error en busqueda de typeAppointmentStatus');

    const errorMessage = resolveMessage(error);
    ResponseManager.error(
      res,
      'Error en busqueda de tipo de estado de turno',
      errorMessage,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;

    const typeAppointmentStatusService = new TypeAppointmentStatusService(em);
    const typeAppointmentStatus = await typeAppointmentStatusService.findOne(id);

    if (!typeAppointmentStatus) {
      ResponseManager.notFound(res, 'Tipo de estado de turno no encontrado');
      return;
    }

    ResponseManager.success(res, typeAppointmentStatus, 'Tipo de estado de turno encontrado', StatusCodes.ACCEPTED);
  } catch (error) {
    logger.error('Error en busqueda de typeAppointmentStatus');

    const errorMessage = resolveMessage(error);
    ResponseManager.error(
      res,
      'Error en busqueda de tipo de estado de turno',
      errorMessage,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function create(req: Request, res: Response) {
  try {
    const typeAppointmentStatusService = new TypeAppointmentStatusService(em);
    const newTypeAppointmentStatus = await typeAppointmentStatusService.create(req.body);

    if (!newTypeAppointmentStatus) {
      ResponseManager.badRequest(res, 'No se pudo crear el Tipo de estado de turno');
      return;
    }

    ResponseManager.success(res, newTypeAppointmentStatus, 'Tipo de estado de turno creado', StatusCodes.CREATED);
  } catch (error) {
    logger.error('Error creando typeAppointmentStatus');

    const errorMessage = resolveMessage(error);
    ResponseManager.error(
      res,
      'Error creando tipo de estado de turno',
      errorMessage,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function update(req: Request, res: Response) {
  try {
    const id: string = req.params.id;

    const typeAppointmentStatusService = new TypeAppointmentStatusService(em);
    await typeAppointmentStatusService.update(id, req.body);

    ResponseManager.success(res, null, 'Tipo de estado de turno actualizado', StatusCodes.OK);
  } catch (error) {
    logger.error('Error actualizando typeAppointmentStatus');

    const errorMessage = resolveMessage(error);
    ResponseManager.error(
      res,
      'Error actualizando tipo de estado de turno',
      errorMessage,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id: string = req.params.id;

    const typeAppointmentStatusService = new TypeAppointmentStatusService(em);
    const result = await typeAppointmentStatusService.remove(id);

    if (!result) {
      ResponseManager.badRequest(res, 'No se pudo eliminar el Tipo de estado de turno');
      return;
    }

    ResponseManager.success(res, null, 'Tipo de estado de turno eliminado', StatusCodes.OK);
  } catch (error) {
    logger.error('Error eliminando typeAppointmentStatus');

    const errorMessage = resolveMessage(error);
    ResponseManager.error(
      res,
      'Error eliminando tipo de estado de turno',
      errorMessage,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

export { findAll, findOne, create, update, remove };
