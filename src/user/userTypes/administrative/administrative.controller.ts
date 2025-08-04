import { orm } from '../../../shared/database/orm.js';
import { NextFunction, Request, Response } from 'express';
import { Administrative } from './administrative.entity.js';
import { populate } from 'dotenv';
//import { Appointment } from '../../../appointment/appointment.entity.js'; //No esta creado, va a dar error
import { AppError } from '../../../shared/errorManagment/appError.js';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../../../shared/logger/logger.js';

const em = orm.em;

function sanitizeInputAdmin(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput= {
    dni: req.body.dni,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    telephone: req.body.telephone,
  };
  for (const param in req.body.sanitizedInput) {
    if (req.body.sanitizedInput[param] === undefined) {
      delete req.body.sanitizedInput[param];
    }
  }
  next();
}

async function findAll(req: Request, res: Response) {
    em.find(Administrative, {}, { populate: ['appointments'] })
      .then((administratives) => {
          if (!administratives.length) throw new AppError('No se encontraron administrativos', StatusCodes.NOT_FOUND);
          res.status(StatusCodes.ACCEPTED).send({ message: 'Administrativos encontrados: ', data: administratives });
        })
        .catch(() => {
          logger.error('Error findAll');
          throw new AppError('Error en busqueda', StatusCodes.INTERNAL_SERVER_ERROR);
        });
    }

async function findOne(req: Request, res: Response) {
  em.findOne(Administrative, req.params.id, { populate: ['appointments'] })
    .then((administrative) => {
      if (!administrative) throw new AppError('Medico no encontrado', StatusCodes.NOT_FOUND);
      res.status(StatusCodes.ACCEPTED).send({ message: 'Medico encontrado: ', data: administrative });
    })
    .catch(() => {
      throw new AppError('Error en busqueda', StatusCodes.INTERNAL_SERVER_ERROR);
    });
}

async function create(req: Request, res: Response) {
  const { dni, name, email, password, telephone } = req.body.sanitizedInput;

  const administrative = em.create(Administrative, {
    dni,
    name,
    email,
    password,
    telephone,
  });

  await em
    .flush()
    .then(() => {
      res.status(StatusCodes.CREATED).send(administrative);
    })
    .catch(() => {
      throw new AppError('Error en busqueda', StatusCodes.INTERNAL_SERVER_ERROR);
    });
  }

async function update(req: Request, res: Response) {
  const id: string = req.params.id; 
  const administrative = await em
    .findOneOrFail(Administrative, { id }) 
    .catch(() => {
      throw new AppError('No existe el medico a modificar', StatusCodes.NOT_FOUND);
    });

  const administrativeUpdated = em.assign(Administrative, req.body);

  await em
    .flush()
    .then(() => {
      res.status(StatusCodes.OK);
    })
    .catch(() => {
      throw new AppError('Error al modificar medico', StatusCodes.INTERNAL_SERVER_ERROR);
    });
}

async function remove(req: Request, res: Response) {
  const id = req.params.id;
  const administrativeRemove = em.getReference(Administrative, id);

  await em.removeAndFlush(administrativeRemove);

  res.status(StatusCodes.ACCEPTED).send();
}

export {sanitizeInputAdmin, findAll, findOne,create,update,remove};