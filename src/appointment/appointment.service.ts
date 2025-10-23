import { FilterQuery, FindOptions, EntityManager } from '@mikro-orm/mysql';
import { Appointment } from './appointment.entity.js';
import { Practice } from '../practice/practice.entity.js';
import { Patient } from '../user/userTypes/patient/patient.entity.js';
import { Medic } from '../user/userTypes/medic/medic.entity.js';
import { Administrative } from '../user/userTypes/administrative/administrative.entity.js';
import { logger } from '../shared/logger/logger.js';
import { resolveMessage } from '../shared/errorManagment/appError.js';

export interface AppointmentData {
  appointmentDate: Date;
  patientId: string;
  medicId: string;
  administrativeIds?: string[];
  practiceIds?: string[];
}

export interface FilterParams {
  beforeDate?: Date;
  afterDate?: Date;
  appointmentStatus?: string;
  patientDni?: string;
}

export class AppointmentService {
  constructor(private em: EntityManager) {}

  findAppointmentByFilter(filter: FilterParams) {
    try {
      const _em = this.em.fork();
      //Llamo a la construccion del where usando los parámetros de la query
      const findOptions = this.buildAppointmentFilter(filter);
      //Find con where
      const appointments = _em.find(Appointment, findOptions.where);
      return appointments;
    } catch (error: any) {
      logger.error('Error al encontrar turnos filtrados por fecha', error);

      throw `Fallo al encontrar turnos filtrados por fecha: ${resolveMessage(error)}`;
    }
  }

  //Método del AppoinmentService para construir el where del find con filtro
  private buildAppointmentFilter(filter: FilterParams) {
    const { beforeDate, afterDate, patientDni } = filter;

    const filters: FilterParams = {
      //Se convierte la fecha de tipo string a  Date
      beforeDate: beforeDate ? new Date(beforeDate) : undefined,
      afterDate: afterDate ? new Date(afterDate) : undefined
    };
    const where: FilterQuery<Appointment> = {};

    //Filtro por rango de fechas
    if (beforeDate || afterDate) {
      where.appointmentDate = {};
      if (beforeDate) {
        where.appointmentDate.$lte = beforeDate;
      }
      if (afterDate) {
        where.appointmentDate.$gte = afterDate;
      }
    }

    //Filtro por DNI de paciente
    if (patientDni) {
      where.patient = { dni: patientDni };
    }

    return {
      where
    };
  }

  async findAll() {
    const _em = this.em.fork();
    return await _em.find(
      Appointment,
      {},
      {
        populate: ['patient', 'medic', 'practices', 'administratives', 'appointmentsStatus']
      }
    );
  }

  async findOne(id: string) {
    const _em = this.em.fork();
    return await _em.findOne(Appointment, id, {
      populate: ['patient', 'medic', 'practices', 'administratives', 'appointmentsStatus']
    });
  }

  async create(data: AppointmentData): Promise<Appointment> {
    try {
      const _em = this.em.fork();

      if (!data.patientId || !data.medicId) {
        throw new Error('Paciente y médico son obligatorios');
      }

      //Utilizamos getReference para traer una referencia al objeto en lugar de todo el objeto.
      //Queda la duda si para los arreglos no habría que reemplazar los findOne por esto
      const patient = _em.getReference(Patient, data.patientId);
      const medic = _em.getReference(Medic, data.medicId);

      const newAppointment = _em.create(Appointment, {
        appointmentDate: data.appointmentDate || new Date(),
        patient: patient,
        medic: medic
      });

      // Agregar prácticas si existen
      if (data.practiceIds && data.practiceIds.length > 0) {
        for (const practiceId of data.practiceIds) {
          const practice = await _em.findOne(Practice, practiceId);
          if (!practice) throw new Error(`No se encontró la práctica con id ${practiceId}`);
          newAppointment.practices.add(practice);
        }
      }

      // Agregar administrativos si existen
      if (data.administrativeIds && data.administrativeIds.length > 0) {
        for (const adminId of data.administrativeIds) {
          const admin = await _em.findOne(Administrative, adminId);
          if (!admin) throw new Error(`No se encontró el administrativo con id ${adminId}`);
          newAppointment.administratives.add(admin);
        }
      }
      await _em.persistAndFlush(newAppointment);
      return newAppointment;
    } catch (error: any) {
      logger.error('Error al crear el turno', error);

      throw `Fallo al crear el turno: ${resolveMessage(error)}`;
    }
  }

  async update(id: string, data: AppointmentData): Promise<void> {
    try {
      const _em = this.em.fork();

      _em.nativeUpdate(Appointment, { id }, data);
    } catch (error: any) {
      logger.error('Error al actualizar el turno', error);

      throw `Fallo al actualizar el turno: ${resolveMessage(error)}`;
    }
  }

  async remove(id: string): Promise<boolean> {
    const _em = this.em.fork();
    const appointment = await _em.findOne(Appointment, id);

    if (!appointment) {
      throw new Error('No se encontró el turno');
    }

    await _em.removeAndFlush(appointment);
    return true;
  }
}
