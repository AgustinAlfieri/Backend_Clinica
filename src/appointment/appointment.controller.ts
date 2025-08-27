import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/database/orm.js";
import { Appointment } from "./appointment.entity.js";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../shared/errorManagment/appError.js";
import { Practice } from "../practice/practice.entity.js";
import { Collection } from "@mikro-orm/core";

const em = orm.em;

function sanitizeInputAppointment(req: Request, _: Response, next: NextFunction) {
  const { patient, medic, practicesIds } = req.body;

  em.find(Practice, {id : practicesIds}).then((practices) => {
    req.body.sanitizedInput = {
      appointmentDate: new Date(),
      patient,
      medic,
      practices: new Collection<Practice>(practices)
    };
    next();
  }).catch(() => {
    req.body.sanitizedInput = {
      patient,
      medic,
      practices: undefined
    };
    next();
  })
}

async function findAll(req: Request, res: Response){
    em.find(Appointment, {}).then((appointments) => {
        if(!appointments) { res.status(StatusCodes.NOT_FOUND).send("No se encontraron turnos"); return; }
        res.status(StatusCodes.OK).send(appointments);
    });
    return;
}

async function findOne(req: Request, res: Response){
    const id = req.params.id;
    em.findOne(Appointment, { id }).then((ap) => {
        if(!ap) { res.status(StatusCodes.NOT_FOUND).send("No se encontro el turno solicitado"); return; }
        res.status(StatusCodes.OK).send(ap);
    });
    return;
}


async function create(req: Request, res: Response) {
    
    const appointment = em.create(
        Appointment, req.body.sanitizedInput);

    await em.persistAndFlush(appointment);
    res.status(StatusCodes.CREATED).send(appointment);
}

async function update(req: Request, res: Response) {
    const id: string = req.params.id;
    const { sanitizedInput } = req.body;
    const appointment = await em.findOne(Appointment, { id });
    if (!appointment) {
        throw new AppError("No se encontro el turno solicitado", StatusCodes.NOT_FOUND);
    }
    em.assign(appointment, sanitizedInput);
    await em.persistAndFlush(appointment);
    res.status(StatusCodes.OK).send(appointment);
}

async function remove(req: Request, res: Response) {
    const id: string = req.params.id;
    const appointment = await em.findOne(Appointment, { id });
    if (!appointment) {
        throw new AppError("No se encontro el turno solicitado", StatusCodes.NOT_FOUND);
    }
    await em.removeAndFlush(appointment);
    res.status(StatusCodes.NO_CONTENT).send();
}

export { findAll, findOne, create, update, remove, sanitizeInputAppointment };
