import { Request, Response } from 'express';
import { PatientService } from './patient.service.js';
import { orm } from '../../../shared/database/orm.js';
import { logger } from '../../../shared/logger/logger.js';
import { StatusCodes } from 'http-status-codes';
import { ResponseManager } from '../../../shared/helpers/responseHelper.js';
import { resolveMessage } from '../../../shared/errorManagment/appError.js';

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const patientService = new PatientService(em);
    const patients = await patientService.findAll();

    if(!patients) {
        ResponseManager.notFound(res, 'No se encontraron pacientes');
        return;
    }

    ResponseManager.success(res, patients, 'Pacientes encontrados', StatusCodes.OK);
  } catch (error) {
    logger.error('Error al buscar pacientes:', error);

    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, errorMessage, 'Error al buscar pacientes', StatusCodes.INTERNAL_SERVER_ERROR);
  }
  return;
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    
    const patientService = new PatientService(em);
    const patient = await patientService.findOne(id);

    if (!patient) {
      ResponseManager.notFound(res, 'Paciente no encontrado');
      return;
    }
    
    ResponseManager.success(res, patient, 'Paciente encontrado', StatusCodes.OK);
  } catch (error) {
    logger.error('Error al buscar paciente:', error);

    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, errorMessage, 'Error al buscar paciente', StatusCodes.INTERNAL_SERVER_ERROR);
  }
  return;
}

async function update(req: Request, res: Response) {
  try {
    const id: string = req.params.id;

    const patientService = new PatientService(em);
    await patientService.update(id, req.body);

    ResponseManager.success(res, null, 'Paciente modificado correctamente', StatusCodes.OK);
  } catch (error) {
    logger.error('Error al modificar paciente:', error);

    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, errorMessage, 'Error al modificar paciente', StatusCodes.INTERNAL_SERVER_ERROR);
  }
  return;
}

async function create(req: Request, res: Response) {
  try {
    const patientService = new PatientService(em);
    const patient = await patientService.create(req.body);

    if(!patient) {
        ResponseManager.badRequest(res, 'No se pudo crear el paciente');
        return;
    }

    ResponseManager.success(res, patient, 'Paciente creado correctamente', StatusCodes.OK);
  } catch (error) {
    logger.error('Error al crear paciente:', error);

    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, errorMessage, 'Error al crear paciente', StatusCodes.INTERNAL_SERVER_ERROR);
  }
  return;
}

async function remove(req: Request, res: Response) {
  try {
    const id: string = req.params.id;
    const patientService = new PatientService(em);
    
    if(await patientService.remove(id)){
      ResponseManager.success(res, null, 'Paciente eliminado correctamente', StatusCodes.OK);
      return;
    }

    ResponseManager.badRequest(res, 'Paciente no encontrado');
  } catch (error) {
    logger.error("Error al eliminando paciente", error);

    const errorMessage = resolveMessage(error);
    ResponseManager.error(res, errorMessage, 'Error al eliminar paciente', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export { findAll, findOne, update, create, remove };
