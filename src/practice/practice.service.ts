import { EntityManager } from '@mikro-orm/core';
import { Practice } from './practice.entity.js';
import { MedicalSpecialty } from '../medicalSpecialty/medicalSpecialty.entity.js';
import { MedicalInsurance } from '../medicalInsurance/medicalInsurance.entity.js';
import { Appointment } from '../appointment/appointment.entity.js';
import { Collection } from '@mikro-orm/core';
import { logger } from '../shared/logger/logger.js';

interface PracticeDTO {
  name: string;
  description: string;
  medicalSpecialty: string;
  medicalInsurances: Collection<MedicalInsurance>;
  appointments: Collection<Appointment>;
}

export class PracticeService {
  constructor(private em: EntityManager) {}

  async findAll() {
    const _em = this.em.fork();
    return await _em.find(Practice, {}, { populate: ['medicalSpecialty', 'medicalInsurances', 'appointments'] });
  }

  async findOne(id: string) {
    const _em = this.em.fork();
    return await _em.findOne(Practice, id, { populate: ['medicalSpecialty', 'medicalInsurances', 'appointments'] });
  }

  async create(practice: PracticeDTO): Promise<Practice> {
    try {
      //Validaciones basicas
      if (!practice.name) throw new Error('Debe ingresar el nombre de la práctica');

      const _em = this.em.fork();
      //Creo el paciente
      const newPractice = await _em.create(Practice, {
        name: practice.name,
        description: practice.description,
        medicalSpecialty: practice.medicalSpecialty
      });

      //Si viene con obras sociales, las buscos y asigno
      if (practice.medicalInsurances) {
        const medicalInsurances = new Collection<MedicalInsurance>(newPractice);
        for (const medicalInsuranceId of practice.medicalInsurances) {
          const medicalInsurance = await _em.findOne(MedicalInsurance, medicalInsuranceId);

          if (!medicalInsurance) throw new Error(`La obra social con id ${medicalInsuranceId} no existe`);
          else medicalInsurances.add(medicalInsurance);
        }
        newPractice.medicalInsurances = medicalInsurances;
      }

      //Si viene con turnos, los busco y asigno
      if (practice.appointments) {
        const appointments = new Collection<Appointment>(newPractice);
        for (const appointmentId of practice.appointments) {
          const appointment = await _em.findOne(Appointment, appointmentId);

          if (!appointment) throw new Error(`El turno con id ${appointmentId} no existe`);
          else appointments.add(appointment);
        }
        newPractice.appointments = appointments;
      }

      _em.persistAndFlush(newPractice);
      return newPractice;
    } catch (error: any) {
      logger.error('Error al crear el paciente', error);

      throw `Fallo al crear el paciente: ${error.message || error.toString()}`;
    }
  }

  async update(id: string, practiceUpdate: Partial<Practice>): Promise<void> {
    try {
      const _em = this.em.fork();

      const result = await _em.nativeUpdate(Practice, { id }, practiceUpdate);
    } catch (error: any) {
      logger.error('Error al actualizar la practica', error);

      throw `Fallo al actualizar la practica: ${error.message || error.toString()}`;
    }
  }

  async delete(id: string) {
    const _em = this.em.fork();
    const practice = await _em.findOneOrFail(Practice, id);

    if (!practice) {
      throw new Error('No se encontró la práctica');
    }

    await _em.removeAndFlush(practice);
    return practice;
  }
}
