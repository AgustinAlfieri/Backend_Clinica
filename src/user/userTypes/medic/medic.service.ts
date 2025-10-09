import { Collection, EntityManager } from '@mikro-orm/mysql';
import { Medic } from './medic.entity.js';
import { DataNewUser, hashPassword } from '../../../shared/auth/auth.service.js';
import { Role } from '../../../shared/enums/role.enum.js';
import { MedicalSpecialty } from '../../../medicalSpecialty/medicalSpecialty.entity.js';
import { comparePassword } from '../../../shared/auth/auth.service.js';
import { logger } from '../../../shared/logger/logger.js';
import { Appointment } from '../../../appointment/appointment.entity.js';

export class MedicService {
  constructor(private em: EntityManager) {}

  async findAll() {
    const _em = this.em.fork();
    return await _em.find(Medic, {}, { populate: ['medicalSpecialty', 'appointments'] });
  }

  async findOne(id: string) {
    const _em = this.em.fork();
    return await _em.findOne(Medic, id, { populate: ['medicalSpecialty', 'appointments'] });
  }

  async create(medic: DataNewUser): Promise<Medic> {
    try {
      const _em = this.em.fork();
      // Creo el médico
      const newMedic = await _em.create(Medic, {
        dni: medic.dni,
        name: medic.name,
        email: medic.email,
        password: await hashPassword(medic.password),
        telephone: medic.telephone,
        license: medic.license,
        role: Role.MEDIC
      });

      // Validaciones básicas
      if (!newMedic.dni && !medic.email) throw new Error('Debe ingresar dni o email');

      if (!newMedic.name || !newMedic.password || !newMedic.license) throw new Error('Faltan datos obligatorios');

      // Si viene con especialidades, las busco y asigno
      if (medic.medicalSpecialty && medic.medicalSpecialty.length > 0) {
        for (const specialtyId of medic.medicalSpecialty) {
          const specialty = await _em.findOne(MedicalSpecialty, specialtyId);
          if (!specialty) {
            throw new Error(`La especialidad con id ${specialtyId} no existe`);
          }
          newMedic.medicalSpecialty.add(specialty);
        }
      }

      // Si viene con turnos, los busco y asigno
      if (medic.appointments) {
        for (const appointmentId of medic.appointments) {
          const appointment = await _em.findOne(Appointment, appointmentId);

          if (!appointment) throw new Error(`El turno con id ${appointmentId} no existe`);
          else newMedic.appointments.add(appointment);
        }
      }
      _em.persistAndFlush(newMedic);
      return newMedic;
    } catch (error: any) {
      logger.error('Error al crear el medico', error);

      throw `Fallo al crear el medico: ${error.message || error.toString()}`;
    }
  }

  async update(id: string, medicUpdate: Partial<DataNewUser>): Promise<void> {
    try {
      const _em = this.em.fork();

      // Si quiere actualizar la password, la hasheo
      if (medicUpdate.password) {
        medicUpdate.password = await hashPassword(medicUpdate.password);
      }
      const result = await _em.nativeUpdate(Medic, { id }, medicUpdate);

      //No encontro ningun paciente con ese id
    } catch (error: any) {
      logger.error('Error al actualizar medico', error);

      throw `Fallo al actualizar medico: ${error.message || error.toString()}`;
    }
  }

  async remove(id: string) {
    try {
      const _em = this.em.fork();
      const medic = await _em.findOneOrFail(Medic, id);

      await _em.removeAndFlush(medic);
    } catch (error: any) {
      logger.error('Error al eliminar médico', error);
      throw `Error al eliminar médico: ${error.message || error.toString()}`;
    }
  }
}
