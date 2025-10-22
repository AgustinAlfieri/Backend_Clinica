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
      const findOptions = this.buildAppointmentFilter(filter);
      // Using the find method with the generated options
      const appointments = _em.find(Appointment, findOptions.where);
      return appointments;
    } catch (error: any) {
      logger.error('Error al encontrar turnos filtrados por fecha', error);

      throw `Fallo al encontrar turnos filtrados por fecha: ${resolveMessage(error)}`;
    }
  }

  //Método del AppoinmentService para construir la Query con filtros
  private buildAppointmentFilter(filter: FilterParams) {
    const { beforeDate, afterDate } = filter;

    const filters: FilterParams = {
      // ⚠️ Importante: Convertir la cadena (string) a objeto Date
      beforeDate: beforeDate ? new Date(beforeDate) : undefined,
      afterDate: afterDate ? new Date(afterDate) : undefined
    };

    // Initialize the base where clause
    const where: FilterQuery<Appointment> = {};

    // 1. Date Range Filtering
    if (beforeDate || afterDate) {
      where.appointmentDate = {};
      if (beforeDate) {
        // Less than or equal to beforeDate
        where.appointmentDate.$lte = beforeDate;
      }
      if (afterDate) {
        // Greater than or equal to afterDate
        where.appointmentDate.$gte = afterDate;
      }
    }

    // 2. Patient DNI Filtering
    //if (patientDni) {
    // Nested filtering for the related 'patient' entity's 'dni' property
    // Assumes the Patient entity has a 'dni' property
    //where.patient = { dni: patientDni };
    //}

    // 3. Appointment Status Filtering
    //if (appointmentStatus) {
    // Nested filtering for the related 'appointmentsStatus' collection.
    // This finds appointments that have *at least one* associated AppointmentStatus
    // entity whose 'statusName' property matches the filter.
    // Assumes the AppointmentStatus entity has a 'statusName' property
    //where.appointmentsStatus = { appointmentsStatus: appointmentStatus };
    //}

    // Define necessary population for the query
    //const populate: FindOptions<Appointment>['populate'] = [
    // Populate patient if dni filter is used, or if you generally want it
    //  'patient'
    // Populate appointmentsStatus if status filter is used, or if you generally want it
    //'appointmentsStatus'
    //];

    // Note on MySQL joins: MikroORM automatically uses joins for nested 'where' clauses.
    // The 'populate' array mainly ensures these fields are fetched if needed, but the 'where'
    // clause structure (e.g., `where.patient = { ... }`) is what tells MikroORM to perform the join for filtering.

    return {
      where
      // Add populate if you want the related entities to be returned in the results
      // You might remove this if you only need the filtering to happen.
      //populate: populate as any
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
