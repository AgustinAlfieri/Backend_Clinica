import { orm } from '../shared/database/orm.js';
import { Request, Response } from 'express';
import { AppError } from '../shared/errorManagment/appError.js';
import { StatusCodes } from 'http-status-codes';
import { PracticeService } from './practice.service.js';

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const practiceService = new PracticeService(em);
    const practices = await practiceService.findAll();

    if (!practices || practices.length === 0) {
      res.status(StatusCodes.NOT_FOUND).send({ message: 'No se encontraron practicas' });
      return;
    }

    res.status(StatusCodes.OK).send(practices);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          error: error instanceof Error ? error.message : 'Error interno del servidor'
        });
  }
}

async function findOne(req: Request, res: Response) {
  try{
    const id = req.params.id;
    const practiceService = new PracticeService(em);
    const practice = await practiceService.findOne(id);

    if (!practice) {
      res.status(StatusCodes.NOT_FOUND).send({ message: 'No se encontró la practica' });
      return;
    } 

    res.status(StatusCodes.OK).send(practice);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          error: error instanceof Error ? error.message : 'Error interno del servidor'
        });
  }
}

async function update(req: Request, res: Response) {
  try{
    const id = req.params.id;
    const practiceService = new PracticeService(em);
    const existingPractice = await practiceService.findOne(id);

    if (!existingPractice) {
      throw new AppError('No se encontró la practica', StatusCodes.NOT_FOUND);
    }

    const updatedPractice = await practiceService.update(id, req.body.sanitizedInput);

    if (!updatedPractice) {
      throw new AppError('Error al actualizar la practica', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res.status(StatusCodes.OK).send(updatedPractice);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          error: error instanceof Error ? error.message : 'Error interno del servidor'
        });
  }
}

async function create(req: Request, res: Response) {
  try {
    const practiceService = new PracticeService(em);
    const newPractice = await practiceService.create(req.body);

    if (!newPractice) {
      throw new AppError('Error al crear la practica', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res.status(StatusCodes.CREATED).send(newPractice);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          error: error instanceof Error ? error.message : 'Error interno del servidor'
        });
  }
}

async function remove(req: Request, res: Response) {
  try{
    const id = req.params.id;
    const practiceService = new PracticeService(em);
    const existingPractice = await practiceService.findOne(id);

    if (!existingPractice) {
      throw new AppError('No se encontró la practica', StatusCodes.NOT_FOUND);
    }

    const deletedPractice = await practiceService.delete(id);

    if (!deletedPractice) {
      throw new AppError('Error al eliminar la practica', StatusCodes.INTERNAL_SERVER_ERROR);
    }
    res.status(StatusCodes.OK).send(deletedPractice);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          error: error instanceof Error ? error.message : 'Error interno del servidor'
        });
  }
}

export { findAll, findOne, update, create, remove };
