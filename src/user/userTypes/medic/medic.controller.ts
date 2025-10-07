import { orm } from '../../../shared/database/orm.js';
import { NextFunction, Request, Response } from 'express';
import { Medic } from './medic.entity.js';
import { MedicalSpecialty } from '../../../medicalSpecialty/medicalSpecialty.entity.js';
import { AppError } from '../../../shared/errorManagment/appError.js';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../../../shared/logger/logger.js';
import { Role } from '../../../shared/enums/role.enum.js';
import { MedicService } from './medic.service.js';

const em = orm.em.fork();

async function findAll(req: Request, res: Response) {
  try {
    const medicService = new MedicService(em);
    const medics = await medicService.findAll();

    if(!medics)
      throw new AppError('No se encontraron medicos', StatusCodes.NOT_FOUND);

    res.status(StatusCodes.ACCEPTED).send({ message: 'Medicos encontrados: ', data: medics });
  } catch(error) {
    logger.error('Error en busqueda de medicos:', error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error instanceof Error ? error.message : error 
    });
  }

}

async function findOne(req: Request, res: Response) {
  try{
    const id: string = req.params.id;
    const medicService = new MedicService(em);
    const medic = await medicService.findOne(id);

    if(!medic)
      throw new AppError('Medico no encontrado', StatusCodes.NOT_FOUND);

    res.status(StatusCodes.ACCEPTED).send({ message: 'Medico encontrado: ', data: medic });
  } catch (error) {
    logger.error('Error en busqueda de medico:', error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error instanceof Error ? error.message : error 
    });
  }
}

async function create(req: Request, res: Response) {
  try {
    const medicService = new MedicService(em);
    const medicCreated = await medicService.create(req.body);

    if(!medicCreated)
      throw new AppError('Error al crear medico', StatusCodes.INTERNAL_SERVER_ERROR);

    res.status(StatusCodes.CREATED).send({ message: 'Medico creado: ', data: medicCreated });
  } catch (error) {
    logger.error('Error al crear medico:', error);

    res.status(StatusCodes.BAD_REQUEST).send({
      error: error instanceof Error ? error.message : error
    });
  }
}

async function update(req: Request, res: Response) {
  try{
    const id = req.params.id;
    const medicService = new MedicService(em);
    const medicUpdated = await medicService.update(id, req.body);

    if(!medicUpdated)
      throw new AppError('Error al modificar medico', StatusCodes.INTERNAL_SERVER_ERROR);

    res.status(StatusCodes.OK).send({ message: 'Medico modificado: ', data: medicUpdated });
  } catch (error) {
    logger.error('Error al modificar medico:', error);

    res.status(StatusCodes.BAD_REQUEST).send({
      error: error instanceof Error ? error.message : error
    });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const medicService = new MedicService(em);
    const result = await medicService.remove(id);

    if(!result)
      throw new AppError('Error al eliminar medico', StatusCodes.INTERNAL_SERVER_ERROR);

    res.status(StatusCodes.OK).send({ message: 'Medico eliminado' });
  } catch (error) {
    logger.error('Error al eliminar medico:', error);

    res.status(StatusCodes.BAD_REQUEST).send({
      error: error instanceof Error ? error.message : error
    });
  }
}

export { findAll, findOne, update, create, remove };
