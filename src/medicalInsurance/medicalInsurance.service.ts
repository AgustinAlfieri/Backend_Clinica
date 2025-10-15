import { EntityManager } from '@mikro-orm/core';
import { MedicalInsurance } from './medicalInsurance.entity.js';
import { Patient } from '../user/userTypes/patient/patient.entity.js';
import { Practice } from '../practice/practice.entity.js';

export interface MedicalInsuranceData {
  name: string;
  patientIds: string[];
  practiceIds: string[]; //Es Opcional?
}

export class MedicalInsuranceService {
  constructor(private em: EntityManager) {}

  async findAll() {
    const _em = this.em.fork(); //Crea una copia
        return await _em.find( //busca en la base de datos
          MedicalInsurance, //es la entidad que busca
          {}, //filtro
          {
            populate: ['patients','practices']
          } //relaciones de la entidad
        );
  }
  async findOne(id: string) {
    const _em = this.em.fork();
          return await _em.findOne(MedicalInsurance, id, {
            populate: ['patients','practices']
          });
  }

  async create(data: MedicalInsuranceData): Promise<MedicalInsurance> {
    const _em = this.em.fork();

    const newMedicalInsurance = await _em.create(MedicalInsurance,{
        name: data.name
        });
    
    if (data.practiceIds && data.practiceIds.length > 0) {
      for (const practiceId of data.practiceIds) {
        const practice = await _em.findOne(Practice, practiceId);
        if (!practice) throw new Error(`No se encontró la práctica con id ${practiceId}`);
        newMedicalInsurance.practices.add(practice);
      }
    }

    if (data.patientIds && data.patientIds.length > 0) {
      for (const patientId of data.patientIds) {
        const patient = await _em.findOne(Patient, patientId);
        if (!patient) throw new Error(`No se encontró el paciente con id ${patientId}`);
        newMedicalInsurance.patients.add(patient);
      }
    }

    await _em.persistAndFlush(newMedicalInsurance);
    return newMedicalInsurance;
  }

  async update(id: string, data: MedicalInsuranceData): Promise<MedicalInsurance> {
    const _em = this.em.fork();
    const existingMedicalInsurance = await _em.findOne(MedicalInsurance, id, {
      populate: ['patients','practices']
    });

    if (!existingMedicalInsurance) {
      throw new Error('No se encontró la Obra Soocial');
    }

    if (data.name) {
      existingMedicalInsurance.name = data.name;
    }

    if (data.practiceIds) {
      existingMedicalInsurance.practices.removeAll();
      for (const practiceId of data.practiceIds) {
        const practice = await _em.findOne(Practice, practiceId);
        if (!practice) throw new Error(`No se encontró la práctica con id ${practiceId}`);
        existingMedicalInsurance.practices.add(practice);
      }
    }

    if (data.patientIds) {
      existingMedicalInsurance.practices.removeAll();
      for (const patientId of data.patientIds) {
        const patient = await _em.findOne(Patient, patientId);
        if (!patient) throw new Error(`No se encontró el paciente con id ${patientId}`);
        existingMedicalInsurance.patients.add(patient);
      }
    }

    await _em.flush();
    return existingMedicalInsurance;
  }

  async remove(id: string): Promise<boolean>{
    const _em = this.em.fork();
        const medicalInsurance = await _em.findOne(MedicalInsurance, id);
    
        if (!medicalInsurance) {
          throw new Error('No se encontró la obra social');
        }
    
        await _em.removeAndFlush(medicalInsurance);
        return true;
  }
}