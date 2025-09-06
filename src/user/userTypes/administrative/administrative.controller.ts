import { orm } from '../../../shared/database/orm.js';
import { NextFunction, Request, Response } from 'express';
import { Administrative } from './administrative.entity.js';
import { Appointment } from '../../../appointment/appointment.entity.js'; //No esta creado, va a dar error
import { AppError } from '../../../shared/errorManagment/appError.js';
import { StatusCodes } from 'http-status-codes';
import { Role } from '../../../shared/enums/role.enum.js';
import { logger } from '../../../shared/logger/logger.js';
import { AdministrativeService } from './administrative.service.js';

const em = orm.em.fork();

async function findAll(req: Request, res: Response) {
  try{
    const aService = new AdministrativeService(em);
    const administratives = await aService.findAll();

    if(!administratives || administratives.length === 0) {
      res.status(StatusCodes.NOT_FOUND).send({ message: 'No se encontraron administrativos' });
      return;
    }

    res.status(StatusCodes.ACCEPTED).send({ message: 'Administrativos encontrados: ', data: administratives });
  } catch(error){
    logger.error(error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ 
      error: error instanceof Error ? error.message : 'Error al obtener los administrativos'
    });
  }
}

async function findOne(req: Request, res: Response) {
  try{
    const id: string = req.params.id;
    const aService = new AdministrativeService(em);
    const administrative = await aService.findOne(id);

    if (!administrative) {
      res.status(StatusCodes.NOT_FOUND).send({ message: 'Administrativo no encontrado' });
      return;
    }

    res.status(StatusCodes.ACCEPTED).send({ message: 'Administrativo encontrado: ', data: administrative });
  } catch (error) {
    logger.error(error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error instanceof Error ? error.message : 'Error al obtener el administrativo'
    });
  }
}

async function create(req: Request, res: Response) {
  try{
    const aService = new AdministrativeService(em);
    const administrative = await aService.create(req.body);

    if(!administrative) {
      res.status(StatusCodes.BAD_REQUEST).send({ message: 'No se pudo crear el administrativo' });
      return;
    }

    res.status(StatusCodes.CREATED).send({ message: 'Administrativo creado: ', data: administrative });
  } catch (error) {
    logger.error(error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error instanceof Error ? error.message : 'Error al crear el administrativo'
    });
  }
}

async function update(req: Request, res: Response) {
  try{
    const id: string = req.params.id;
    const aService = new AdministrativeService(em);
    const administrative = await aService.update(id, req.body);

    if(!administrative) {
      res.status(StatusCodes.BAD_REQUEST).send({ message: 'No se pudo actualizar el administrativo' });
      return;
    }
    res.status(StatusCodes.ACCEPTED).send({ message: 'Administrativo actualizado: ', data: administrative });
  } catch (error) {
    logger.error(error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error instanceof Error ? error.message : 'Error al actualizar el administrativo'
    });
  }
}

async function remove(req: Request, res: Response) {
  try{
    const id: string = req.params.id;
    const aService = new AdministrativeService(em);
    const administrative = await aService.remove(id);

    if(!administrative) {
      res.status(StatusCodes.NOT_FOUND).send({ message: 'No se pudo eliminar el administrativo' });
      return;
    }

    res.status(StatusCodes.ACCEPTED).send({ message: 'Administrativo eliminado: ' });
  } catch (error) {
    logger.error(error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error instanceof Error ? error.message : 'Error al eliminar el administrativo'
    });
  }
}

export { findAll, findOne, create, update, remove };