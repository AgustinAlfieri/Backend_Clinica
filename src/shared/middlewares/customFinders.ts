import { orm } from "../database/orm.js";
import { Patient } from "../../user/userTypes/patient/patient.entity.js";
import { Medic } from "../../user/userTypes/medic/medic.entity.js";
import { Administrative } from "../../user/userTypes/administrative/administrative.entity.js";
import { Role } from "../enums/role.enum.js";

const em = orm.em.fork();

const customFinder = async (params: { dni?: string; email?: string }) : Promise<string | undefined> => {
    //Necesito buscar en las tres entidades y devolver el rol
    let isDni = false;
    let findBy = '';
    if (params.dni) { findBy = params.dni; isDni = true; }
    else if (params.email) { findBy = params.email; isDni = false; }

    if(isDni){
        const userPatient = await em.findOne(Patient, { dni: findBy });
        if (userPatient) {
          return Role.PATIENT || "";
        }
    
        const userMedic = await em.findOne(Medic, { dni: findBy });
        if (userMedic) {
          return Role.MEDIC || "";
        }   
    
        const userAdministrative = await em.findOne(Administrative, { dni: findBy });
        if (userAdministrative) {
          return Role.ADMINISTRATIVE || "";
        }
    }
    else {
        const userPatient = await em.findOne(Patient, { email: findBy });
        if (userPatient) {
          return Role.PATIENT || "";
        }
    
        const userMedic = await em.findOne(Medic, { email: findBy });
        if (userMedic) {
          return Role.MEDIC || "";
        }
    
        const userAdministrative = await em.findOne(Administrative, { email: findBy });
        if (userAdministrative) {
          return Role.ADMINISTRATIVE || "";
        }
    }
};


export { customFinder };