import { orm } from '../shared/database/orm.js';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MedicalSpecialtyService } from './medicalSpecialty.service.js';

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try{
    const medicalSpecialtyService =  new MedicalSpecialtyService(em);
    const specialties = await medicalSpecialtyService.findAll();

    if(!specialties){
      res.status(StatusCodes.NOT_FOUND).send('Especialidades médicas no encontradas');
      return;
    }

    res.status(StatusCodes.OK).send(specialties);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
}

async function findOne(req: Request, res: Response) {
  try{
    const id = req.params.id;
    const medicalSpecialtyService =  new MedicalSpecialtyService(em);
    const specialty = await medicalSpecialtyService.findOne(id);

    if(!specialty){
      res.status(StatusCodes.NOT_FOUND).send('Especialidad médica no encontrada');
      return;
    }

    res.status(StatusCodes.OK).send(specialty);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
}

async function update(req: Request, res: Response) {
  try{
    const id = req.params.id;
    const medicalSpecialtyService =  new MedicalSpecialtyService(em);
    const updatedSpecialty = await medicalSpecialtyService.update(id, req.body.sanitizedInput);

    if(!updatedSpecialty){
      res.status(StatusCodes.NOT_FOUND).send('Error al actualizar la especialidad médica');
      return;
    } 
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
}

async function create(req: Request, res: Response) {
  try{
    const medicalSpecialtyService =  new MedicalSpecialtyService(em);
    const newSpecialty = await medicalSpecialtyService.create(req.body);

    if(!newSpecialty){
      res.status(StatusCodes.BAD_REQUEST).send('Error al crear la especialidad médica');
      return;
    }

    res.status(StatusCodes.CREATED).send(newSpecialty);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
}
async function remove(req: Request, res: Response) {
  try{
    const id = req.params.id;
    const medicalSpecialtyService =  new MedicalSpecialtyService(em);
    await medicalSpecialtyService.remove(id);

    res.status(StatusCodes.OK).send({ message: 'Especialidad médica eliminada correctamente' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
}

export { findAll, findOne, update, create, remove };
