import { orm } from "../../../shared/database/orm.js";
import { NextFunction, Request, Response } from "express";
import { Medic } from "./medic.entity.js";
import { populate } from "dotenv";
import { MedicalSpecialty } from "../../../medicalSpecialty/medicalSpecialty.entity.js";
import { AppError } from "../../../shared/errorManagment/appError.js";
import { STATUS_CODES } from "http";
import { StatusCodes } from "http-status-codes";
import { logger } from "../../../shared/logger/logger.js";
import { MediumIntType } from "@mikro-orm/core";

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
            req.body.sanitizedInput[param] === undefined
        ) { delete req.body.sanitizedInput[param]; }
  }
    next();
}

const em = orm.em;


async function findAll(req: Request, res: Response) {
        em.find(Medic, {}, { populate: ['medicalSpecialty','appointments'] })
            .then( (medics) => {                
                if(!medics.length) throw new AppError("No se encontraron medicos", StatusCodes.NOT_FOUND);
                res.status(StatusCodes.ACCEPTED).send({message: "Medicos encontrados: ", data: medics});
            },() => {
                logger.error("Error findAll"); 
                throw new AppError("Error en busqueda", StatusCodes.INTERNAL_SERVER_ERROR);
            })
}


async function findOne(req: Request, res: Response){
        em.findOne(Medic, req.params.id, { populate: ['medicalSpecialty','appointments'] })
            .then(medic =>{
                if(!medic) throw new AppError("Medico no encontrado", StatusCodes.NOT_FOUND);
                res.status(StatusCodes.ACCEPTED).send({message: "Medico encontrado: " , data: medic});
            }).catch( () => { throw new AppError("Error en busqueda", StatusCodes.INTERNAL_SERVER_ERROR); })
}


async function create(req: Request, res: Response) {
        const { dni, name, email, telephone, license, m_specialty } = req.body.sanitizedInput;
        
        const specialty = await em.findOneOrFail(MedicalSpecialty, m_specialty)
            .then((__specialty) => { if(!__specialty) throw new AppError("Especialidad no encontrada", StatusCodes.NOT_FOUND); return __specialty; })

        const medic = em.create(Medic, {
            dni,
            name,
            email,
            telephone,
            license,
            medicalSpecialty: specialty
        });

        if(!medic)
            throw new AppError("Error al crear medico", StatusCodes.INTERNAL_SERVER_ERROR);

        await em.flush()
            .then( ()  => { res.status(StatusCodes.CREATED).send(medic);})
            .catch(() => { throw new AppError("Error en busqueda", StatusCodes.INTERNAL_SERVER_ERROR); });
}


async function update(req: Request, res: Response) {
        const id: string = req.params.id;
        const medic = await em.findOneOrFail(Medic, {id})
                        .then((med) => { return med; })
                        .catch(() => { throw new AppError("No existe el medico a modificar", StatusCodes.NOT_FOUND) });

        const medicUpdated = em.assign(medic, req.body);

        await em.flush().then( () => { res.status(StatusCodes.OK); })
                        .catch( () => { throw new AppError("Error al modificar medico", StatusCodes.INTERNAL_SERVER_ERROR) });
}

async function remove(req: Request, res: Response) {
        const id = req.params.id;
        const medicRemove = em.getReference(Medic, id);

        await em.removeAndFlush(medicRemove);

        res.status(StatusCodes.ACCEPTED).send();
}


export { sanitizeInputMedic, findAll, findOne, update, create, remove }