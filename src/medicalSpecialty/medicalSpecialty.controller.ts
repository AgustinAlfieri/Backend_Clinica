import { orm } from '../shared/database/orm.js';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MedicalSpecialtyService } from './medicalSpecialty.service.js';
import { ResponseManager } from '../shared/helpers/responseHelper.js';
import { logger } from '../shared/logger/logger.js';
import { resolveMessage } from '../shared/errorManagment/appError.js';

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try{
    const medicalSpecialtyService =  new MedicalSpecialtyService(em);
    const specialties = await medicalSpecialtyService.findAll();

    if(!specialties){
      ResponseManager.notFound(res, 'No se encontraron especialidades médicas');
      return;
    }

    ResponseManager.success(res, specialties, 'Especialidades médicas obtenidas', StatusCodes.OK);
  } catch (error) {
    logger.error('Error al obtener las especialidades médicas', { error });

    ResponseManager.error(res, resolveMessage(error), 'Error al obtener las especialidades médicas', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function findOne(req: Request, res: Response) {
  try{
    const id = req.params.id;

    const medicalSpecialtyService =  new MedicalSpecialtyService(em);
    const specialty = await medicalSpecialtyService.findOne(id);

    if(!specialty){
      ResponseManager.notFound(res, 'Especialidad médica no encontrada');
      return;
    }

    ResponseManager.success(res, specialty, 'Especialidad médica obtenida', StatusCodes.OK);
  } catch (error) {
    logger.error('Error al obtener la especialidad médica', { error });

    ResponseManager.error(res, resolveMessage(error), 'Error al obtener la especialidad médica', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function update(req: Request, res: Response) {
  try {
    const medicalSpecialtyService =  new MedicalSpecialtyService(em);
    const updatedSpecialty = await medicalSpecialtyService.update(req.body);

    if(!updatedSpecialty){
      ResponseManager.badRequest(res, 'Error al actualizar la especialidad médica');
      return;
    } 

    ResponseManager.success(res, updatedSpecialty, 'Especialidad médica actualizada', StatusCodes.OK);
  } catch (error) {
    logger.error('Error al actualizar la especialidad médica', { error });

    ResponseManager.error(res, resolveMessage(error), 'Error al actualizar la especialidad médica', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function create(req: Request, res: Response) {
  try{
    const medicalSpecialtyService =  new MedicalSpecialtyService(em);
    const newSpecialty = await medicalSpecialtyService.create(req.body);

    if(!newSpecialty){
      ResponseManager.badRequest(res, 'Error al crear la especialidad médica');
      return;
    }

    ResponseManager.success(res, newSpecialty, 'Especialidad médica creada', StatusCodes.CREATED);
  } catch (error) {
    logger.error('Error al crear la especialidad médica', { error });

    ResponseManager.error(res, resolveMessage(error), 'Error al crear la especialidad médica', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
async function remove(req: Request, res: Response) {
  try{
    const id = req.params.id;

    const medicalSpecialtyService =  new MedicalSpecialtyService(em);
    await medicalSpecialtyService.remove(id);

    ResponseManager.success(res, null, 'Especialidad médica eliminada correctamente', StatusCodes.OK);
  } catch (error) {
    logger.error('Error al eliminar la especialidad médica', error);

    ResponseManager.error(res, resolveMessage(error), 'Error al eliminar la especialidad médica', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export { findAll, findOne, update, create, remove };
