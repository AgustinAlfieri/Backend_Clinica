import { EntityManager } from '@mikro-orm/core';
import { MedicalInsurance } from './medicalInsurance.entity.js';
import { Patient } from '../user/userTypes/patient/patient.entity.js';
import { Practice } from '../practice/practice.entity.js';
import { logger } from '../shared/logger/logger.js';
import { resolveMessage } from '../shared/errorManagment/appError.js';

export interface MedicalInsuranceData {
  name: string;
  patientIds: string[];
  practiceIds: string[]; //Es Opcional?
}

export class MedicalInsuranceService {
  constructor(private em: EntityManager) {}

  async findAllForRegister() {
    const _em = this.em.fork();
    return await _em.find(MedicalInsurance, {});
  }
  async findAll() {
    const _em = this.em.fork();
    return await _em.find(
      MedicalInsurance,
      {},
      {
        populate: ['patients', 'practices']
      }
    );
  }
  async findOne(id: string) {
    const _em = this.em.fork();
    return await _em.findOne(MedicalInsurance, id, {
      populate: ['patients', 'practices']
    });
  }

  async create(data: MedicalInsuranceData): Promise<MedicalInsurance> {
    try {
      const _em = this.em.fork();

      const newMedicalInsurance = _em.create(MedicalInsurance, {
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
    } catch (error: any) {
      logger.error('Error al crear la obra social', error);

      throw `Fallo al crear la obra social: ${resolveMessage(error)}`;
    }
  }

  async update(id: string, data: MedicalInsuranceData): Promise<void> {
    try {
      const _em = this.em.fork();

      _em.nativeUpdate(MedicalInsurance, { id }, data);
    } catch (error: any) {
      logger.error('Error al actualizar la obra social', error);

      throw `Fallo al actualizar la obra social: ${resolveMessage(error)}`;
    }
  }

  async remove(id: string): Promise<boolean> {
    const _em = this.em.fork();
    const medicalInsurance = await _em.findOne(MedicalInsurance, id);

    if (!medicalInsurance) {
      throw new Error('No se encontró la obra social');
    }

    await _em.removeAndFlush(medicalInsurance);
    return true;
  }
}
