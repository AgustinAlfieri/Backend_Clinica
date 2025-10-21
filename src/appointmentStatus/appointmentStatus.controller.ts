import { orm } from '../shared/database/orm.js';
import { Request, Response } from 'express';
import { AppointmentStatus } from './appointmentStatus.entity.js';
import { AppError } from '../shared/errorManagment/appError.js';
import { StatusCodes } from 'http-status-codes';
import { TypeAppointmentStatus } from '../typeAppointmentStatus/typeAppointmentStatus.entity.js';
import { logger } from '../shared/logger/logger.js';
import { AppointmentStatusService } from './appointmentStatus.service.js';
import { ResponseManager } from '../shared/helpers/responseHelper.js';
import { resolveMessage } from '../shared/errorManagment/appError.js';
import { request } from 'http';

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const appointmentStatusService = new AppointmentStatusService(em);
    const appointmentsStatus = await appointmentStatusService.findAll();

    if (!appointmentsStatus) {
      ResponseManager.notFound(res, 'No se encontraron estados de turno');
      return;
    }

    ResponseManager.success(res, appointmentsStatus, 'Estados de turnos obtenidos', StatusCodes.OK);
  } catch (error: any) {
    logger.error(error);
    const errorMessage = resolveMessage(error);
    ResponseManager.error(
      res,
      errorMessage,
      'Error al obtener los estados de turno',
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id: string = req.params.id;
    const appointmentStatusService = new AppointmentStatusService(em);
    const appointmentStatus = await appointmentStatusService.findOne(id);

    if (!appointmentStatus) {
      ResponseManager.notFound(res, 'Estado de turno no encontrado');
      return;
    }

    ResponseManager.success(res, appointmentStatus, 'Estado de turno encontrado', StatusCodes.OK);
  } catch (error: any) {
    logger.error(error);
    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, errorMessage, 'Error al obtener el estado de turno', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function create(req: Request, res: Response) {
  try {
    const appointmentStatusService = new AppointmentStatusService(em);
    const appointmentStatus = await appointmentStatusService.create(req.body);

    if (!appointmentStatus) {
      ResponseManager.badRequest(res, 'No se pudo crear el estado de turno', '', StatusCodes.BAD_REQUEST);
      return;
    }

    ResponseManager.success(res, appointmentStatus, 'Estado de turno creado', StatusCodes.CREATED);
  } catch (error) {
    logger.error(error);

    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, errorMessage, 'Error al crear el estado de turno', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function update(req: Request, res: Response) {
  try {
    const id: string = req.params.id;

    const appointmentStatusService = new AppointmentStatusService(em);
    const appointmentStatus = await appointmentStatusService.update(id, req.body);

    ResponseManager.success(res, appointmentStatus, 'Estado de turno actualizado', StatusCodes.OK);
  } catch (error) {
    logger.error(error);

    const errorMessage = resolveMessage(error);
    ResponseManager.error(
      res,
      errorMessage,
      'Error al actualizar el estado de turno',
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id: string = req.params.id;

    const appointmentStatusService = new AppointmentStatusService(em);
    const appointmentStatus = await appointmentStatusService.remove(id);

    if (!appointmentStatus) {
      ResponseManager.notFound(res, 'No se pudo eliminar el estado de turno');
      return;
    }

    ResponseManager.success(res, null, 'Turno eliminado', StatusCodes.OK);
  } catch (error) {
    logger.error(error);

    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, errorMessage, 'Error al eliminar el estado de turno', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
export { findAll, findOne, create, update, remove };
