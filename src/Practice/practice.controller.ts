import { orm } from '../shared/database/orm.js';
import { NextFunction, Request, Response } from 'express';
import { Practice } from './practice.entity.js';
import { AppError } from '../shared/errorManagment/appError.js';
import { StatusCodes } from 'http-status-codes';

const em = orm.em;

function sanitizeInputPractice(req: Request, _: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    description: req.body.description,//? puede ser opcional???
    medicalInsurances: req.body.medicalinsurance,
    medicalSpeciality: req.body.medicalSpeciality,
    //appointment: req.body.appointment, //Aun no esta creado
  };
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

async function findAll(req: Request, res: Response) {
  const practices = await em.find(Practice, {}, { populate: ['medicalSpecialty', 'medicalInsurances'] }); //Se debe agregar 'appointment'

  if (!practices) throw new AppError('Practicas no encontradas', StatusCodes.NOT_FOUND);

  res.status(StatusCodes.OK).send(practices);
}

async function findOne(req: Request, res: Response) {
  const id = req.params.id;
  const practice = await em.findOne(Practice, id, { populate: ['medicalSpecialty', 'medicalInsurances'] });//Se debe agregar 'appointment'

  if (!practice) throw new AppError('Practica no encontrada', StatusCodes.NOT_FOUND);

  res.status(StatusCodes.OK).send(practice);
}

async function update(req: Request, res: Response) {
  const id = req.params.id;
  const practice = await em.findOneOrFail(Practice, id);

  const practiceUpdated = em.assign(practice, req.body.sanitizedInput); 

  if (!practiceUpdated)
    throw new AppError('Error al modificar la practica', StatusCodes.NOT_MODIFIED);

  await em.flush();

  res.status(StatusCodes.OK).send(practiceUpdated);
}

async function create(req: Request, res: Response) {
  const practice = em.create(Practice, req.body.sanitizedInput);
  await em.flush();
  if (!practice) throw new AppError('Error al crear la practica', StatusCodes.INTERNAL_SERVER_ERROR);
  res.status(StatusCodes.CREATED).send(practice);
}

async function remove(req: Request, res: Response) {
  const id = req.params.id;
  const deletePractice = em.getReference(Practice, id);

  await em.removeAndFlush(deletePractice);

  res.status(StatusCodes.ACCEPTED).send('Practica eliminada');
}

export { sanitizeInputPractice, findAll, findOne, update, create, remove };
