import { EntityManager } from "@mikro-orm/mysql";
import { Patient } from "./patient.entity.js";
import { hashPassword } from "../../../shared/auth/auth.service.js";
import { MedicalInsurance } from "../../../medicalInsurance/medicalInsurance.entity.js";
import { Role } from "../../../shared/enums/role.enum.js";
import { logger } from "../../../shared/logger/logger.js";
import { compare } from "bcrypt";

interface PatientDTO {
  dni: string;
  name: string;
  email: string;
  password: string;
  telephone: string;
  insuranceNumber: string;
  medicalInsurance: MedicalInsurance;
  role: string;
}

export class PatientService {
  constructor(private em: EntityManager) {}

  async findAll() {
    const _em = this.em.fork();
    return await _em.find(Patient, {}, { populate: ['medicalInsurance', 'appointments'] });
  }

  async findOne(id: string) {
    const _em = this.em.fork();
    return await _em.findOne(Patient, id, { populate: ['medicalInsurance', 'appointments'] });
  }

  async create(patient: PatientDTO) : Promise<Patient> {
    const _em = this.em.fork();
    const existPatient = await _em.findOne(Patient, { dni: patient.dni });
    const newPatient = new Patient();

    //important!!!
    if (existPatient) {
      throw new Error('Ya existe un paciente con ese DNI');
    }

    if(!patient.password || !patient.email || !patient.dni || !patient.name) {
        throw new Error('Todos los campos son obligatorios');
    }

    //No plain text password
    newPatient.password = await hashPassword(patient.password);

    //Assign fields
    newPatient.dni = patient.dni;
    newPatient.name = patient.name;
    newPatient.email = patient.email;

    (patient.telephone) ? 
        newPatient.telephone = patient.telephone : newPatient.telephone = undefined;

    (patient.insuranceNumber) ?
        newPatient.insuranceNumber = patient.insuranceNumber: newPatient.insuranceNumber = undefined;

    if (patient.medicalInsurance) {
        const medicalInsurance = await _em.findOne(MedicalInsurance, patient.medicalInsurance);

        if (!medicalInsurance) 
            throw new Error('La obra social no existe');

        newPatient.medicalInsurance = medicalInsurance;
    } else {
        newPatient.medicalInsurance = undefined;
    }

    newPatient.role = Role.PATIENT;

    _em.persistAndFlush(newPatient);
    return newPatient;
  }

  async update(id: string, patientUpdate: Partial<PatientDTO>) : Promise<Patient | null> {
    try {
        const _em = this.em.fork();
        const patient = await _em.findOneOrFail(Patient, id);
        const newPatientData = new Patient();

        //very important!!!!!!!"!"!"
        newPatientData.id = id;

        if(!patient){
            throw new Error('No se encontró el paciente');
        }

        //validate if password has changed
        if(!patientUpdate.password) patientUpdate.password = patient.password;

        const changePassword : boolean = await compare(patientUpdate.password || '', patient.password);
        
        if(changePassword)
            newPatientData.password = await hashPassword(patientUpdate.password);
        else
            newPatientData.password = patient.password;

        newPatientData.dni = patientUpdate.dni || patient.dni;
        newPatientData.name = patientUpdate.name || patient.name;
        newPatientData.email = patientUpdate.email || patient.email;
        newPatientData.telephone = patientUpdate.telephone || patient.telephone;
        newPatientData.insuranceNumber = patientUpdate.insuranceNumber || patient.insuranceNumber;

        if (patientUpdate.medicalInsurance) {
            const medicalInsurance = await _em.findOne(MedicalInsurance, patientUpdate.medicalInsurance);
            
            if (!medicalInsurance)
                throw new Error('La obra social no existe');

            newPatientData.medicalInsurance = medicalInsurance;
        } else {
            newPatientData.medicalInsurance = patient.medicalInsurance;
        }

        newPatientData.role = Role.PATIENT;

        _em.assign(patient, newPatientData);
        await _em.flush();

        return patient;
    } catch (error) {
        logger.error("Error al actualizar paciente", error);
        return null;
    }
  }

  async remove(id: string) {
    try{
        const _em = this.em.fork();
        const patient = await _em.findOneOrFail(Patient, id);
        await _em.removeAndFlush(patient);
    } catch (error) {
        logger.error("Error al eliminar paciente", error);  
        return false;
    }
  }

}