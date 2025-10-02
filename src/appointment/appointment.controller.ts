import { orm } from '../shared/database/orm.js';
import { Request, Response } from 'express';
import { Appointment } from './appointment.entity.js';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../shared/logger/logger.js';
import { AppointmentService } from './appointment.service.js';

const em = orm.em.fork();

async function findAll(req: Request, res: Response) {
  try {
    const appointmentService = new AppointmentService(em);
    const appointments = await appointmentService.findAll();

    if (!appointments || appointments.length === 0) {
      res.status(StatusCodes.NOT_FOUND).send({ message: 'No se encontraron turnos' });
      return;
    }

    res.status(StatusCodes.OK).send({ message: 'Turnos encontrados', data: appointments });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error instanceof Error ? error.message : 'Error al obtener los turnos'
    });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id: string = req.params.id;
    const appointmentService = new AppointmentService(em);
    const appointment = await appointmentService.findOne(id);

    if (!appointment) {
      res.status(StatusCodes.NOT_FOUND).send({ message: 'Turno no encontrado' });
      return;
    }

    res.status(StatusCodes.OK).send({ message: 'Turno encontrado', data: appointment });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error instanceof Error ? error.message : 'Error al obtener el turno'
    });
  }
}

async function create(req: Request, res: Response) {
  try {
    const appointmentService = new AppointmentService(em);
    const appointment = await appointmentService.create(req.body);

    if (!appointment) {
      res.status(StatusCodes.BAD_REQUEST).send({ message: 'No se pudo crear el turno' });
      return;
    }

    res.status(StatusCodes.CREATED).send({ message: 'Turno creado', data: appointment });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error instanceof Error ? error.message : 'Error al crear el turno'
    });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id: string = req.params.id;
    const appointmentService = new AppointmentService(em);
    const appointment = await appointmentService.update(id, req.body);

    if (!appointment) {
      res.status(StatusCodes.BAD_REQUEST).send({ message: 'No se pudo actualizar el turno' });
      return;
    }

    res.status(StatusCodes.OK).send({ message: 'Turno actualizado', data: appointment });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error instanceof Error ? error.message : 'Error al actualizar el turno'
    });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id: string = req.params.id;
    const appointmentService = new AppointmentService(em);
    const removed = await appointmentService.remove(id);

    if (!removed) {
      res.status(StatusCodes.NOT_FOUND).send({ message: 'No se pudo eliminar el turno' });
      return;
    }

    res.status(StatusCodes.OK).send({ message: 'Turno eliminado' });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error instanceof Error ? error.message : 'Error al eliminar el turno'
    });
  }
}

export { findAll, findOne, create, update, remove };
