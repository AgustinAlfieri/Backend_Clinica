import { EntityManager, Collection } from '@mikro-orm/mysql';
import { Appointment } from './appointment.entity.js';
import { Practice } from '../practice/practice.entity.js';
import { Patient } from '../user/userTypes/patient/patient.entity.js';
import { Medic } from '../user/userTypes/medic/medic.entity.js';
import { Administrative } from '../user/userTypes/administrative/administrative.entity.js';
import { AppointmentStatus } from '../appointmentStatus/appointmentStatus.entity.js';

export interface AppointmentData {
  appointmentDate?: Date;
  patientId?: string;
  medicId?: string;
  administrativeIds?: string[];
  practiceIds?: string[];
}

export class AppointmentService {
  constructor(private em: EntityManager) {}

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
    const _em = this.em.fork();

    if (!data.patientId || !data.medicId) {
      throw new Error('Paciente y médico son obligatorios'); //Si son obligatorios,porque llevan ?
    }

    // Buscar el paciente
    const patient = await _em.findOne(Patient, data.patientId);
    if (!patient) throw new Error('No se encontró el paciente');

    // Buscar el médico
    const medic = await _em.findOne(Medic, data.medicId);
    if (!medic) throw new Error('No se encontró el médico');

    console.log("Hasta acá llego");

    const newAppointment = await _em.create(Appointment,{
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



    // Crear el appointment con el constructor

    await _em.persistAndFlush(newAppointment);
    // Llamada a appointmentStatus
    return newAppointment;
  }

  async update(id: string, data: AppointmentData): Promise<Appointment> {
    const _em = this.em.fork();
    const existingAppointment = await _em.findOne(Appointment, id, {
      populate: ['patient', 'medic', 'practices', 'administratives', 'appointmentsStatus']
    });

    if (!existingAppointment) {
      throw new Error('No se encontró el turno');
    }

    // Actualizar fecha si se proporciona
    if (data.appointmentDate) {
      existingAppointment.appointmentDate = data.appointmentDate;
    }

    // Actualizar paciente si se proporciona
    if (data.patientId) {
      const patient = await _em.findOne(Patient, data.patientId);
      if (!patient) throw new Error('No se encontró el paciente');
      existingAppointment.patient = patient;
    }

    // Actualizar médico si se proporciona
    if (data.medicId) {
      const medic = await _em.findOne(Medic, data.medicId);
      if (!medic) throw new Error('No se encontró el médico');
      existingAppointment.medic = medic;
    }

    // Actualizar prácticas si se proporcionan
    if (data.practiceIds) {
      existingAppointment.practices.removeAll();
      for (const practiceId of data.practiceIds) {
        const practice = await _em.findOne(Practice, practiceId);
        if (!practice) throw new Error(`No se encontró la práctica con id ${practiceId}`);
        existingAppointment.practices.add(practice);
      }
    }

    // Actualizar administrativos si se proporcionan
    if (data.administrativeIds) {
      existingAppointment.administratives.removeAll();
      for (const adminId of data.administrativeIds) {
        const admin = await _em.findOne(Administrative, adminId);
        if (!admin) throw new Error(`No se encontró el administrativo con id ${adminId}`);
        existingAppointment.administratives.add(admin);
      }
    }

    await _em.flush();
    return existingAppointment;
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
