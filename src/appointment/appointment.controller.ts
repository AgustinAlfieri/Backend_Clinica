import { orm } from '../shared/database/orm.js';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../shared/logger/logger.js';
import { AppointmentService } from './appointment.service.js';
import { ResponseManager } from '../shared/helpers/responseHelper.js';
import { resolveMessage } from '../shared/errorManagment/appError.js';

const em = orm.em.fork();

// Ejemplo Query
// GET http://localhost:3000/app/v1/appointment/findAppointmentByFilter?beforeDate=2026-01-16T09:30&afterDate=2026-01-12T09:30

//De momento solo filtra por beforeDate y afterDate
async function findAppointmentByFilter(req: Request, res: Response) {
  try {
    const appointmentService = new AppointmentService(em);
    const appointments = await appointmentService.findAppointmentByFilter(req.query);

    if (!appointments) {
      ResponseManager.notFound(res, 'No se encontraron turnos');
      return;
    }

    ResponseManager.success(res, appointments, 'Turnos obtenidos', StatusCodes.OK);
  } catch (error) {
    logger.error(error);

    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, errorMessage, 'Error al obtener los turnos', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function findAll(req: Request, res: Response) {
  try {
    const appointmentService = new AppointmentService(em);
    const appointments = await appointmentService.findAll();

    if (!appointments) {
      ResponseManager.notFound(res, 'No se encontraron turnos');
      return;
    }

    ResponseManager.success(res, appointments, 'Turnos obtenidos', StatusCodes.OK);
  } catch (error) {
    logger.error(error);

    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, errorMessage, 'Error al obtener los turnos', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id: string = req.params.id;
    const appointmentService = new AppointmentService(em);
    const appointment = await appointmentService.findOne(id);

    if (!appointment) {
      ResponseManager.notFound(res, 'Turno no encontrado');
      return;
    }

    ResponseManager.success(res, appointment, 'Turno encontrado', StatusCodes.OK);
  } catch (error) {
    logger.error(error);

    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, errorMessage, 'Error al obtener el turno', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function create(req: Request, res: Response) {
  // TODO
  // Ver si el primer estado de turno se tiene que crear desde el front o invocar acá
  try {
    const appointmentService = new AppointmentService(em);
    const appointment = await appointmentService.create(req.body);

    if (!appointment) {
      ResponseManager.badRequest(res, 'No se pudo crear el turno', '', StatusCodes.BAD_REQUEST);
      return;
    }

    ResponseManager.success(res, appointment, 'Turno creado', StatusCodes.CREATED);
  } catch (error) {
    logger.error(error);

    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, errorMessage, 'Error al crear el turno', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function update(req: Request, res: Response) {
  try {
    const id: string = req.params.id;

    const appointmentService = new AppointmentService(em);
    const appointment = await appointmentService.update(id, req.body);

    ResponseManager.success(res, appointment, 'Turno actualizado', StatusCodes.OK);
  } catch (error) {
    logger.error(error);

    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, errorMessage, 'Error al actualizar el turno', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id: string = req.params.id;

    const appointmentService = new AppointmentService(em);
    const removed = await appointmentService.remove(id);

    if (!removed) {
      ResponseManager.notFound(res, 'No se pudo eliminar el turno');
      return;
    }

    ResponseManager.success(res, null, 'Turno eliminado', StatusCodes.OK);
  } catch (error) {
    logger.error(error);

    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, errorMessage, 'Error al eliminar el turno', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export { findAppointmentByFilter, findAll, findOne, create, update, remove };
