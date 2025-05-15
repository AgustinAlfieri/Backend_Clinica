import { orm } from "../../../shared/database/orm.js";
import { NextFunction, Request, Response } from "express";
import { Patient } from "./patient.entity.js";

const em = orm.em;

function sanitizeInputPatient(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    dni: req.body.dni,
    name: req.body.name,
    email: req.body.email,
    medicalInsurance: req.body.medicalInsurance
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })

  next()
}


async function findAll(req: Request, res: Response) {
    await em.find(Patient, {});
    return
}

async function findOne(req: Request, res: Response) {
    const id = req.body.sanitizeInputPatient;
    const patient = await em.findOne(Patient, id, { populate: ['medicalInsurance', 'appointments'] })
    
    if(!patient){
        res.
            status(404).
            send({ message: 'Paciente no encontrado' })
    }
    return
}

async function update(req:Request, res:Response) {
    try{
        const id =  req.body.sanitizeInputPatient;
        const patient = await em.findOneOrFail(Patient, { id });
    
        em.assign(patient, req.body.sanitizeInputPatient);

        await em.flush();
        res.
            status(201).
            send({ message: 'Paciente modificado correctamente' });
    } catch(error){
        res.
            status(500).
            send({ message: 'Error al modificar al paciente' });
    }
    return
}

async function create(req: Request, res: Response) {
    try{
        const patient = em.create(Patient, req.body.sanitizeInputPatient);
        await em.flush();

        res.
            status(200).
            send({ message: 'Paciente creado correctamente' });
    } catch(error){
            res.
                status(500).
                send({ message: 'Error al crear paciente' });
    }
    return
}


async function remove(req: Request, res: Response) {
    try{
        const id = req.body.sanitizeInputPatient;
        const patientRemove = em.getReference(Patient, id);

        await em.removeAndFlush(patientRemove);

        res.
            status(200).
            send({ message: 'Paciente eliminado correctamente' });
    } catch(error){
        res.
            status(500).
            send({ message: 'Error al eliminar paciente' });
    }
}



export { sanitizeInputPatient, findAll, findOne, update, create, remove }