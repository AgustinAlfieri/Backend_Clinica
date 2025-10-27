import { FilterQuery, FindOptions, EntityManager } from '@mikro-orm/mysql';
import { Appointment } from './appointment.entity.js';
import { Practice } from '../practice/practice.entity.js';
import { Patient } from '../user/userTypes/patient/patient.entity.js';
import { Medic } from '../user/userTypes/medic/medic.entity.js';
import { Administrative } from '../user/userTypes/administrative/administrative.entity.js';
import { logger } from '../shared/logger/logger.js';
import { resolveMessage } from '../shared/errorManagment/appError.js';

export interface AppointmentData {
  date: Date;
  patient: string;
  medic: string;
  administrativeIds?: string[];
  practiceIds?: string[];
}

export interface FilterParams {
  beforeDate?: Date;
  afterDate?: Date;
  typeAppointmentStatus?: string;
  patientDni?: string;
}

export class AppointmentService {
  constructor(private em: EntityManager) {}
  async findAppointmentByFilter(filter: FilterParams): Promise<Appointment[]> {
    try {
      const _em = this.em.fork();
      const { beforeDate, afterDate, patientDni, typeAppointmentStatus } = filter;

      //Inicializo el QueryBuilder
      const qb = _em.createQueryBuilder(Appointment, 'a');
      const knex = _em.getKnex();

      // Defino los datos que quiero (Quizas hay que traer menos)
      qb.select('a.*');
      qb.leftJoinAndSelect('a.patient', 'p');
      qb.leftJoinAndSelect('a.medic', 'm');

      qb.leftJoinAndSelect(
        'a.appointmentsStatus',
        'as',
        // Le decimos que SÓLO traiga el estado si cumple esta condición:
        // La fecha del estado es la máxima PARA ESE TURNO (a.id)
        { 'as.date': knex.raw('(SELECT MAX(as2.date) FROM appointment_status as2 WHERE as2.appointment_id = a.id)') }
      );
      // Hacemos join al tipo de estado DESDE el estado 'as' que ya filtramos
      qb.leftJoinAndSelect('as.typeAppointmentStatus', 'tas');

      //Filtro por fechas
      if (beforeDate) {
        qb.andWhere({ appointmentDate: { $lte: new Date(beforeDate) } });
      }
      if (afterDate) {
        qb.andWhere({ appointmentDate: { $gte: new Date(afterDate) } });
      }

      //Filtro por DNI del paciente (No hace falta el join porque ya lo hago en los select)
      if (patientDni) {
        qb.andWhere({ 'p.dni': patientDni });
      }

      if (typeAppointmentStatus) {
        // Busco por el nombre del tipo de estado (Ej: Solicitado)
        qb.andWhere({ 'tas.name': typeAppointmentStatus });
      }

      //Ejecuto la query y traigo los resultados
      return await qb.getResultList();
    } catch (error: any) {
      logger.error('Error al filtrar los turnos', error);
      throw `Error al filtrar los turnos: ${resolveMessage(error)}`;
    }
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

      // DEBUG: Log completo de lo que recibe el servicio
      console.log('=== APPOINTMENT SERVICE DEBUG ===');
      console.log('data completo:', JSON.stringify(data, null, 2));
      console.log('data.patientId:', data.patient);
      console.log('data.medicId:', data.medic);
      console.log('data.date:', data.date);
      console.log('typeof data:', typeof data);
      console.log('keys de data:', Object.keys(data));
      console.log('================================');

      if (!data.patient || !data.medic) {
        throw new Error('Paciente y médico son obligatorios');
      }

      //Utilizamos getReference para traer una referencia al objeto en lugar de todo el objeto.
      //Queda la duda si para los arreglos no habría que reemplazar los findOne por esto
      const patient = _em.getReference(Patient, data.patient);
      const medic = _em.getReference(Medic, data.medic);

      const newAppointment = _em.create(Appointment, {
        appointmentDate: data.date || new Date(),
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

      const updateData: any = {};
      if (data.date) updateData.appointmentDate = data.date;
      if (data.patient) updateData.patient = _em.getReference(Patient, data.patient);
      if (data.medic) updateData.medic = _em.getReference(Medic, data.medic);

      _em.nativeUpdate(Appointment, { id }, updateData);
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
