import { orm } from '../shared/database/orm.js';
import { NextFunction, Request, Response } from 'express';
import { AppointmentStatus } from './appointmentStatus.entity.js';
import { AppError } from '../shared/errorManagment/appError.js';
import { StatusCodes } from 'http-status-codes';
import { TypeAppointmentStatus } from '../typeAppointmentStatus/typeAppointmentStatus.entity.js';

const em = orm.em;

function sanitizeInputAS(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    date: new Date(),
    observations: req.body.observations,
    idTypeAppointmentStatus: req.body.idTypeAppointmentStatus,
    appointment: req.body.appointment
  };
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
} // / Middleware to sanitize input, removing undefined values

async function findAll(req: Request, res: Response) {
  const appointmentStatus = await em.find(
    AppointmentStatus,
    {},
    { populate: ['appointment', 'typeAppointmentStatus'] }
  );

  res.status(StatusCodes.OK).send(appointmentStatus); // Aunque sea []
}

async function findOne(req: Request, res: Response) {
  const id = req.params.id; // get the id from the request params
  const appointmentStatus = await em.findOne(
    AppointmentStatus,
    { id },
    { populate: ['appointment', 'typeAppointmentStatus'] }
  );
  if (!appointmentStatus) { res.status(StatusCodes.NOT_FOUND).send('Estado turno no encontrado'); return; } //not necessary return
  res.status(StatusCodes.OK).send(appointmentStatus); // Send the appointmentStatus
} // Find one appointmentStatus by id

async function create(req: Request, res: Response) {
  try {
    const idTypeAppointmentStatus = req.body.sanitizedInput.idTypeAppointmentStatus;
    const typeAppointmentStatus = await em.findOne(TypeAppointmentStatus, {
      id: idTypeAppointmentStatus
    });
    if (!typeAppointmentStatus) throw new AppError('Type appointment status does not exist', StatusCodes.BAD_REQUEST);
    const appointmentStatus = new AppointmentStatus(
      new Date(),
      req.body.sanitizedInput.idTypeAppointmentStatus,
      req.body.sanitizedInput.appointment, // can be null or incomplete during development
      req.body.sanitizedInput.observations
    );
    await em.persistAndFlush(appointmentStatus); // Persist the appointmentStatus
    res.status(StatusCodes.CREATED).send(appointmentStatus);
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Error creating appointment status', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  } // Create a new appointmentStatus
} // Create a new appointmentStatus
async function update(req: Request, res: Response) {
  const id = req.params.id; // get the id from the request params
  try {
    const appointmentStatus = await em.findOneOrFail(AppointmentStatus, { id });
    em.assign(appointmentStatus, req.body.sanitizedInput); // The official documentation of MikroOrm says "assign(entity, data) assigns the values of data to entity in-place. It returns the same entity, so you don’t need to reassign it.  "
    await em.flush();
    res.status(StatusCodes.OK).send(appointmentStatus);
  } catch (error) {
    throw new AppError('Appointment status not found or inactive', StatusCodes.NOT_FOUND);
  }
} // Update a appointmentStatus by id

async function remove(req: Request, res: Response) {
  const id = req.params.id; // get the id from the request params
  const appointmentStatus = await em.findOneOrFail(AppointmentStatus, {
    id
  });
  if (!appointmentStatus) throw new AppError('Estado turno no encontrado', StatusCodes.NOT_FOUND); //not necessary return
  await em.removeAndFlush(appointmentStatus); // remove the appointmentStatus
  res.status(StatusCodes.ACCEPTED).send('Appointment status removed'); // Send a message
} // Remove a appointmentStatus by id

export { findAll, findOne, create, update, remove, sanitizeInputAS };
// export {findAll, findOne, create, update, remove} from "./appointmentStatus.controller.js";
