import { orm } from "../../../shared/database/orm.js";
import { NextFunction, Request, Response } from "express";
import { Medic } from "./medic.entity.js";
import { populate } from "dotenv";
import { MedicalSpecialty } from "../../../medicalSpecialty/medicalSpecialty.entity.js";

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
    try{
        const medics = await em.find(Medic, {}, { populate: ['medicalSpecialty','appointments'] });

        res.
            status(200)
            .send({message: 'Medicos encontrados: ', data: medics});
    } catch(error){
        //TODO: Logger
        console.log(error);

        res.
            status(500)
            .send({ message: 'Error al buscar medicos'});
    }
}


async function findOne(req: Request, res: Response){
    try{
        const id = req.params.id;
        const medic = await em.findOne(Medic, id, { populate: ['medicalSpecialty','appointments'] });

        if(medic instanceof Medic){
            res.
                status(200)
                .send({ message: 'Medico encontrado: ', data: medic });
        } else {
            res.
            status(404)
            .send({ message: 'Medico no encontrado' });    
        }

    } catch(error){
        //TODO: Logger
        console.log(error);

        res.
            status(500)
            .send({ message: 'Error al buscar medico'});
    }

}


async function create(req: Request, res: Response) {
    try{
        const { dni, name, email, telephone, license, m_specialty } = req.body.sanitizedInput;
        const specialty = await em.findOneOrFail(MedicalSpecialty, m_specialty);

        console.log(specialty);

        const medic = em.create(Medic, {
            dni,
            name,
            email,
            telephone,
            license,
            medicalSpecialty: specialty
        })

        await em.flush();

        res.
            status(200)
            .send({message: 'Medico creado correctamente', data: medic });
    } catch(error){
        //TODO: Logger
        console.log(error);

        res.
            status(500)
            .send({ message: 'Error al crear medico'});
    }
}


async function update(req: Request, res: Response) {
    try{   
        const id: string = req.params.id;
        const medic = await em.findOneOrFail(Medic, {id});

        em.assign(medic, req.body);

        await em.flush();

        res.
            status(200)
            .send({ message: 'Medico modificado correctamente', data: medic });

    } catch(error){
        //TODO: Logger
        console.log(error);

        res.
            status(500)
            .send({ message: 'Error al modificar medico'});
    }
}

async function remove(req: Request, res: Response) {
    try{
        const id = req.params.id;
        const medicRemove = em.getReference(Medic, id);

        await em.removeAndFlush(medicRemove);

        res.
            status(200)
            .send({ message: 'Medico eliminado correctamente' });

    } catch(error){
        //TODO: Logger
        console.log(error);

        res.
            status(500)
            .send({ message: 'Error al eliminar medico'});
    }

}


export { sanitizeInputMedic, findAll, findOne, update, create, remove }