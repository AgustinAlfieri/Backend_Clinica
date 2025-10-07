import { EntityManager } from '@mikro-orm/core';
import { Practice } from './practice.entity.js';
import { MedicalSpecialty } from '../medicalSpecialty/medicalSpecialty.entity.js';
import { MedicalInsurance } from '../medicalInsurance/medicalInsurance.entity.js';
import { Appointment } from '../appointment/appointment.entity.js';
import { Collection } from '@mikro-orm/core';

interface PracticeDTO {
  name: string;
  description: string;
  medicalSpecialty: string;
  medicalInsurances: Collection<MedicalInsurance>;
  appointments: Collection<Appointment>;
}

export class PracticeService {
  constructor(private _em: EntityManager) {}

  async findAll() {
    const _em = this._em.fork();
    return await _em.find(Practice, {}, { populate: ['medicalSpecialty', 'medicalInsurances', 'appointments'] });
  }

  async findOne(id: string) {
    const _em = this._em.fork();
    return await _em.findOne(Practice, id, { populate: ['medicalSpecialty', 'medicalInsurances', 'appointments'] });
  }

  async create(practiceData: PracticeDTO) {
    const _em = this._em.fork();

    const medicalSpeciality = await _em.findOneOrFail(MedicalSpecialty, practiceData.medicalSpecialty);
    if (!medicalSpeciality) {
      throw new Error('No se encontró la especialidad médica');
    }

    //new instance of Practice
    const practice = new Practice(practiceData.name, medicalSpeciality, practiceData.description);

    practice.medicalInsurances = new Collection<MedicalInsurance>(practice);
    if (practiceData.medicalInsurances && practiceData.medicalInsurances.length > 0) {
      for (const mi of practiceData.medicalInsurances) {
        const id = mi.id;
        const insurance = await _em.findOne(MedicalInsurance, id || '-1');
        if (!insurance) {
          throw new Error(`No se encontró el seguro médico con ID ${id}`);
        }
        practice.medicalInsurances.add(insurance);
      }
    }

    practice.appointments = new Collection<Appointment>(practice);
    if (practiceData.appointments && practiceData.appointments.length > 0) {
      for (const app of practiceData.appointments) {
        const id = app.id;
        const appointment = await _em.findOne(Appointment, id || '-1');
        if (!appointment) {
          throw new Error(`No se encontró la cita con ID ${id}`);
        }
        practice.appointments.add(appointment);
      }
    }

    await _em.persistAndFlush(practice);
    return practice;
  }

  async update(id: string, practiceData: PracticeDTO) {
    const _em = this._em.fork();
    const practice = await _em.findOneOrFail(Practice, id);

    if (!practice) {
      throw new Error('No se encontró la práctica');
    }

    const medicalSpeciality = await _em.findOneOrFail(MedicalSpecialty, practiceData.medicalSpecialty);
    if (!medicalSpeciality) {
      throw new Error('No se encontró la especialidad médica');
    }

    practice.id = id;
    practice.name = practiceData.name || practice.name;
    practice.description = practiceData.description || practice.description;
    practice.medicalSpecialty = medicalSpeciality || practice.medicalSpecialty;

    if (practiceData.medicalInsurances) {
      if (practice.medicalInsurances) practice.medicalInsurances.removeAll();
      else practice.medicalInsurances = new Collection<MedicalInsurance>(practice);

      for (const mi of practiceData.medicalInsurances) {
        const id = mi.id;
        const insurance = await _em.findOne(MedicalInsurance, id || '-1');

        if (!insurance) {
          throw new Error(`No se encontró el seguro médico con ID ${id}`);
        }

        practice.medicalInsurances.add(insurance);
      }
    }

    if (practiceData.appointments) {
      //Check
      if (practice.appointments) practice.appointments.removeAll();
      else practice.appointments = new Collection<Appointment>(practice);

      for (const app of practiceData.appointments) {
        const id = app.id;
        const appointment = await _em.findOne(Appointment, id || '-1');

        if (!appointment) {
          throw new Error(`No se encontró la cita con ID ${id}`);
        }

        practice.appointments.add(appointment);
      }
    }

    await _em.persistAndFlush(practice);
    return practice;
  }

  async delete(id: string) {
    const _em = this._em.fork();
    const practice = await _em.findOneOrFail(Practice, id);

    if (!practice) {
      throw new Error('No se encontró la práctica');
    }

    await _em.removeAndFlush(practice);
    return practice;
  }
}
