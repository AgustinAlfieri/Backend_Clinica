import { orm } from "../../../shared/database/orm.js";
import { NextFunction, Request, Response } from "express";
import { Medic } from "./medic.entity.js";
import { populate } from "dotenv";
import { MedicalSpecialty } from "../../../medicalSpecialty/medicalSpecialty.entity.js";
import { AppError } from "../../../shared/errorManagment/appError.js";
import { STATUS_CODES } from "http";
import { StatusCodes } from "http-status-codes";

//TODO: Improve function
function sanitizeInputMedic(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedInput = {
        dni: req.body.dni,
        name: req.body.name,
        email: req.body.email,
        telephone: req.body.telephone,
        license: req.body.license,
        m_specialty: req.body.m_specialty,
    }
    for (const param in req.body.sanitizedInput) {
        if (
            req.body.sanitizedInput[param] === undefined ||
            req.body.sanitizedInput[param] === null ||
            req.body.sanitizedInput[param] === ''
        ) { delete req.body.sanitizedInput[param]; }
  }
    next();
}

const em = orm.em;


async function findAll(req: Request, res: Response) {
        const medics = await em.find(Medic, {}, { populate: ['medicalSpecialty','appointments'] });

        if(!medics) 
            throw new AppError("Medico no encontrado", StatusCodes.NOT_FOUND); 

        res.status(StatusCodes.OK).send(medics);
}


async function findOne(req: Request, res: Response){
        const id = req.params.id;
        const medic = await em.findOne(Medic, id, { populate: ['medicalSpecialty','appointments'] });

        if(!medic)
            throw new AppError("Medico no encontrado", StatusCodes.NOT_FOUND);
            
        res.status(StatusCodes.OK).send(medic);
}


async function create(req: Request, res: Response) {
        const { dni, name, email, telephone, license, m_specialty } = req.body.sanitizedInput;
        const specialty = await em.findOneOrFail(MedicalSpecialty, m_specialty);

        const medic = em.create(Medic, {
            dni,
            name,
            email,
            telephone,
            license,
            medicalSpecialty: specialty
        })

        await em.flush();

        if(!medic)
            throw new AppError("Error al crear medico", StatusCodes.INTERNAL_SERVER_ERROR);

        res.
            status(StatusCodes.CREATED)
            .send(medic);
}


async function update(req: Request, res: Response) {
        const id: string = req.params.id;
        const medic = await em.findOneOrFail(Medic, {id});

        const medicUpdated = em.assign(medic, req.body);
        
        if(!medicUpdated) throw new AppError("Error al modificar medico", StatusCodes.NOT_MODIFIED);

        await em.flush();

        res.status(StatusCodes.OK).send(medic);
}

async function remove(req: Request, res: Response) {
        const id = req.params.id;
        const medicRemove = em.getReference(Medic, id);

        await em.removeAndFlush(medicRemove);

        res.status(StatusCodes.ACCEPTED).send();
}


export { sanitizeInputMedic, findAll, findOne, update, create, remove }