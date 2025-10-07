import { orm } from "../shared/database/orm.js";
import { Request, Response} from "express";
import { TypeAppointmentStatus } from "./typeAppointmentStatus.entity.js";
import { TypeAppointmentStatusService } from "./typeAppointmentStatus.service.js";
import { StatusCodes } from "http-status-codes";

const em = orm.em.fork();

async function findAll(req: Request, res: Response) {
    try {
        const typeAppointmentStatusService =  new TypeAppointmentStatusService(em);

        const typeAppointmentStatus = await typeAppointmentStatusService.findAll();
        res.status(200).send(typeAppointmentStatus);
    } catch (error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: 'Error finding typeAppointmentStatus',
            error: error instanceof Error ? error.message : error
        })
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = req.params.id; // Get the id from the request params
        const typeAppointmentStatusService =  new TypeAppointmentStatusService(em);
        const typeAppointmentStatus = await typeAppointmentStatusService.findOne(id);
        
        if (!typeAppointmentStatus){
            res.status(StatusCodes.NOT_FOUND).send({message: 'typeAppointmentStatus not found'});
            return;
        }
        
        res.status(StatusCodes.ACCEPTED).send(typeAppointmentStatus);
    }catch (error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({message : 'Error en busqueda de typeAppointmentStatus',
            error: error instanceof Error ? error.message : error
        })
    }
}

async function create(req: Request, res: Response){
    try{
        const typeAppointmentStatusService =  new TypeAppointmentStatusService(em);
        const newTypeAppointmentStatus = await typeAppointmentStatusService.create(req.body);

        if (newTypeAppointmentStatus) {
            res.status(StatusCodes.CREATED).send(newTypeAppointmentStatus);
        } else {
            res.status(StatusCodes.BAD_REQUEST).send({message: 'Error creating typeAppointmentStatus'});
        }

    }catch (error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({message : 'Error creating typeAppointmentStatus',
            error: error instanceof Error ? error.message : error
        })
    }
}

async function update(req: Request, res: Response){
    try{
        const id : string = req.params.id;
        const typeAppointmentStatusService =  new TypeAppointmentStatusService(em);
        const updatedTypeAppointmentStatus = await typeAppointmentStatusService.update(id, req.body);

        if (updatedTypeAppointmentStatus) {
            res.status(200).send({message: 'typeAppointmentStatus updated', data: updatedTypeAppointmentStatus})
        }else{
            res.status(404).send({message: 'typeAppointmentStatus not found'})
        }
    }catch (error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({message : 'Error updating typeAppointmentStatus',
            error: process.env.NODE_ENV === 'development' ? error : undefined //this line shows error only in development mode (useful for debugging)
        })
    }
}

async function remove(req: Request, res: Response){
    try{
        const id : string = req.params.id; // Get the id from the request params
        const typeAppointmentStatusService =  new TypeAppointmentStatusService(em);
        const result = await typeAppointmentStatusService.remove(id);

        if (result) {
            res.status(StatusCodes.OK).send({message: 'typeAppointmentStatus removed'});
            return;
        } else {
            res.status(StatusCodes.NOT_FOUND).send({message: 'typeAppointmentStatus not found'});
            return;
        }

    }catch (error){
       res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
            message : 'Error removing typeAppointmentStatus',
            error: error instanceof Error ? error.message : error
        })
    }
}

export {findAll, findOne, create, update, remove }
// export {findAll, findOne, create, update, remove} from "./typeAppointmentStatus.controller.js";