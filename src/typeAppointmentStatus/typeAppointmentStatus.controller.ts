import { orm } from "../shared/database/orm.js";
import {NextFunction, Request, Response} from "express";
import { TypeAppointmentStatus } from "./typeAppointmentStatus.entity.js";

const em = orm.em;

function sanitizeInputAST(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedInput = {
        name: req.body.name,
        }
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    })
    next()
} // / Middleware to sanitize input, removing undefined values

async function findAll(req: Request, res: Response) {
    try {
        const typeAppointmentStatus = await em.find(TypeAppointmentStatus,{});
        res.status(200).send({message: 'typeAppointmentStatus found', data: typeAppointmentStatus})
    } catch (error){
        res.status(500)
        .send({message : 'Error finding typeStatus'})
    }
} // Find all typeAppointmentStatus

async function findOne(req: Request, res: Response) {
    try {
        const id = req.params.id; // Get the id from the request params
        const typeAppointmentStatus = await em.findOne(TypeAppointmentStatus, {id});
        if (typeAppointmentStatus) {
            res.status(200).send({message: 'typeAppointmentStatus found', data: typeAppointmentStatus})
        }else{
            res.status(404).send({message: 'typeAppointmentStatus not found'})
        }
    }catch (error){
        res.status(500)
        .send({message : 'Error finding typeAppointmentStatus'})
    }
    //not necessary return
} // Find one typeAppointmentStatus by id

async function create(req: Request, res: Response){
    try{
        const {name} = req.body.sanitizedInput;
        const typeAppointmentStatus = em.create(TypeAppointmentStatus,{name});
        await em.flush();
        res.status(201).send({message: 'typeAppointmentStatus created', data: typeAppointmentStatus});
    }catch (error){
        res.status(500)
        .send({message : 'Error creating typeAppointmentStatus'})
    }

} // Create a new typeAppointmentStatus
async function update(req: Request, res: Response){
    try{
        const id : string = req.params.id; // Get the id from the request params
        const {name} = req.body.sanitizedInput;
        const typeAppointmentStatus = await em.findOne(TypeAppointmentStatus, {id});
        if (typeAppointmentStatus) {
            typeAppointmentStatus.name = name;
            await em.flush();
            res.status(200).send({message: 'typeAppointmentStatus updated', data: typeAppointmentStatus})
        }else{
            res.status(404).send({message: 'typeAppointmentStatus not found'})
        }
    }catch (error){
        res.status(500)
        .send({message : 'Error updating typeAppointmentStatus',
            error: process.env.NODE_ENV === 'development' ? error : undefined //this line shows error only in development mode (useful for debugging)
        })
    }
} // Update a typeAppointmentStatus by id

async function remove(req: Request, res: Response){
    try{
        const id : string = req.params.id; // Get the id from the request params
        const typeAppointmentStatus = await em.findOne(TypeAppointmentStatus, {id});
        if (typeAppointmentStatus) {
            await em.removeAndFlush(typeAppointmentStatus);
            res.status(200).send({message: 'typeAppointmentStatus removed', data: typeAppointmentStatus})
        }else{
            res.status(404).send({message: 'typeAppointmentStatus not found'})
        }
    }catch (error){
        res.status(500)
        .send({message : 'Error removing typeAppointmentStatus'})
    }
} // Remove a typeAppointmentStatus by id

export {findAll, findOne, create, update, remove, sanitizeInputAST}
// export {findAll, findOne, create, update, remove} from "./typeAppointmentStatus.controller.js";