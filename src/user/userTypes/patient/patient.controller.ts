import { Request, Response } from 'express';
import { Patient } from './patient.entity.js';
import { PatientService } from './patient.service.js';
import { orm } from '../../../shared/database/orm.js';
import { logger } from '../../../shared/logger/logger.js';
import { StatusCodes } from 'http-status-codes';

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const patientService = new PatientService(em);
    const patients = await patientService.findAll();

    if(!patients || patients.length === 0) {
        res.status(StatusCodes.NOT_FOUND).send({ message: 'No se encontraron pacientes' });
        return;
    }

    res.status(StatusCodes.OK).send({ message: 'Pacientes encontrados', data: patients });

  } catch (error) {
    logger.error('Error al buscar pacientes:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Error al buscar pacientes ' });
  }

  return;
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const patientService = new PatientService(em);
    const patient = await patientService.findOne(id);

    if (patient) {
      res.status(StatusCodes.OK).send({ message: 'Paciente encontrado', data: patient });
      return;
    }

    res.status(StatusCodes.NOT_FOUND).send({ message: 'Paciente no encontrado' });

  } catch (error) {
    logger.error('Error al buscar paciente:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Error al buscar paciente' });
  }

  return;
}

async function update(req: Request, res: Response) {
  try {
    const id: string = req.params.id;
    const patientService = new PatientService(em);
    const patient = await patientService.update(id, req.body);

    if (patient) {
      res.status(StatusCodes.OK).send({ message: 'Paciente modificado correctamente', data: patient });
      return;
    }

    res.status(StatusCodes.NOT_FOUND).send({ message: 'Paciente no encontrado' });

  } catch (error) {
    logger.error('Error al modificar paciente:', error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: 'Error al modificar al paciente',
      error: error instanceof Error ? error.message : error
    });
  }
  return;
}

async function create(req: Request, res: Response) {
  try {
    const patientService = new PatientService(em);
    const patient = await patientService.create(req.body);

    if(!patient) {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'No se pudo crear el paciente' });
        return;
    }

    res.status(StatusCodes.OK).send({ message: 'Paciente creado correctamente', patient });
  } catch (error) {
    logger.error('Error al crear paciente:', error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ 
      message: 'Error al crear paciente', 
      error: error instanceof Error ? error.message : error
    });

  }
  return;
}

async function remove(req: Request, res: Response) {
  try {
    const id: string = req.params.id;
    const patientService = new PatientService(em);

    if(await patientService.remove(id)) {
        res.status(StatusCodes.OK).send({ message: 'Paciente eliminado correctamente' });
        return;
    }

    res.status(StatusCodes.NOT_FOUND).send({ message: 'Paciente no encontrado' });
  } catch (error) {
    logger.error("Error al eliminando paciente", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ 
      message: 'Error al eliminar paciente',
      error: error instanceof Error ? error.message : error
    });
  }
}

export { findAll, findOne, update, create, remove };
