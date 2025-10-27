import { Collection, EntityManager } from '@mikro-orm/mysql';
import { Medic } from './medic.entity.js';
import { DataNewUser, hashPassword } from '../../../shared/auth/auth.service.js';
import { Role } from '../../../shared/enums/role.enum.js';
import { MedicalSpecialty } from '../../../medicalSpecialty/medicalSpecialty.entity.js';
import { logger } from '../../../shared/logger/logger.js';
import { Appointment } from '../../../appointment/appointment.entity.js';
import { resolveMessage } from '../../../shared/errorManagment/appError.js';

interface TimeSlot {
  datetime: string; // ISO string
  available: boolean;
}

interface AvailableSchedule {
  date: string; // YYYY-MM-DD
  slots: TimeSlot[];
}

interface WorkingHours {
  day: number; // 0 = Domingo, 1 = Lunes, etc.
  startTime: string; // "09:00"
  endTime: string; // "17:00"
}

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
      // Validaciones básicas
      if (!medic.dni && !medic.email) throw new Error('Debe ingresar dni o email');

      if (!medic.name || !medic.password || !medic.license) throw new Error('Faltan datos obligatorios');

      const _em = this.em.fork();
      // Creo el médico
      const newMedic = _em.create(Medic, {
        dni: medic.dni,
        name: medic.name,
        email: medic.email,
        password: await hashPassword(medic.password),
        telephone: medic.telephone,
        license: medic.license,
        role: Role.MEDIC
      });

      // Si viene con especialidades, las busco y asigno
      if (medic.medicalSpecialty && medic.medicalSpecialty.length > 0) {
        for (const specialtyId of medic.medicalSpecialty) {
          const specialty = await _em.findOne(MedicalSpecialty, specialtyId);

          if (!specialty)
            throw new Error(`La especialidad con id ${specialtyId} no existe`);

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
      if (medicUpdate.password)
        medicUpdate.password = await hashPassword(medicUpdate.password);
      
      _em.nativeUpdate(Medic, { id }, medicUpdate);

    } catch (error: any) {
      logger.error('Error al actualizar medico', error);

      throw `Fallo al actualizar medico: ${resolveMessage(error)}`;
    }
  }

  async remove(id: string) {
    try {
      const _em = this.em.fork();
      const medic = await _em.findOneOrFail(Medic, id);

      await _em.removeAndFlush(medic);
    } catch (error: any) {
      logger.error('Error al eliminar médico', error);

      throw `Error al eliminar médico: ${resolveMessage(error)}`;
    }
  }

  async getMedicSchedule(id: string, slotDuratioon: number = 30): Promise <AvailableSchedule[]>  { 
    try {
      const _em = this.em.fork();

      const medic = await _em.findOne(Medic, id, {
        populate: ["appointments"],
      });

      if (!medic) throw new Error("No se encontro el medico");

      // Traigo la fecha de hoy y seteo la hora en 00:00:00
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Calculo la fecha dentro de dos semanas
      const twoWeeksLater = new Date(today);
      twoWeeksLater.setDate(today.getDate() + 14);

      // Busco los turnos del medico en las proximas dos semanas
      const bookedAppointments = await _em.find(Appointment, {
        medic: medic.id,
        appointmentDate: { $gte: today, $lte: twoWeeksLater },
      });

      // Creo un set con las fechas y horas ya ocupadas para facilitar la busqueda
      const bookedTimes = new Set(
        bookedAppointments.map((app) => {
          const appointmentDate = app.appointmentDate;
          return appointmentDate.toISOString();
        })
      );

      // Defino el horario laboral del medico (esto podria venir de la BD en un caso real)
      const schedule: AvailableSchedule[] = [];

      // Hardcodeo horario laboral de lunes a viernes de 9 a 17, podriamos modificar la entidad para que cada medico tenga su propio horario
      const workingHours: WorkingHours[] = [
        { day: 1, startTime: "09:00", endTime: "17:00" }, // Lunes
        { day: 2, startTime: "09:00", endTime: "17:00" }, // Martes
        { day: 3, startTime: "09:00", endTime: "17:00" }, // Miércoles
        { day: 4, startTime: "09:00", endTime: "17:00" }, // Jueves
        { day: 5, startTime: "09:00", endTime: "17:00" }, // Viernes
      ];

      for (let i = 0; i < 14; i++) {
        // Me traigo la fecha actual en el loop
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);

        const dayOfWeek = currentDate.getDay(); // 0 = Domingo, 1 = Lunes, etc

        const workingDay = workingHours.find((wh) => wh.day === dayOfWeek);

        if (!workingDay) continue; // Si no trabaja ese dia, paso al siguiente

        const dateSString = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD
        const slots: TimeSlot[] = [];

        // Genero los slots de 30 minutos entre el horario de inicio y fin
        const [startHour, startMinute] = workingDay.startTime
          .split(":")
          .map(Number);
        const [endHour, endMinute] = workingDay.endTime.split(":").map(Number);

        const currentSlot = new Date(currentDate);
        currentSlot.setHours(startHour, startMinute, 0, 0); // Me paro en la hora de inicio

        const endTime = new Date(currentDate);
        endTime.setHours(endHour, endMinute, 0, 0); // Hora de fin

        // Itero creando slots de 30 minutos hasta llegar a la hora de fin
        while (currentSlot < endTime) {
          //
          const slotISO = currentSlot.toISOString();

          // Verifico si el slot esta ocupado
          const isAvailable = !bookedTimes.has(slotISO);

          slots.push({
            datetime: slotISO,
            available: isAvailable,
          });

          // Avanzo al siguiente slot
          currentSlot.setMinutes(currentSlot.getMinutes() + slotDuratioon);
        }

        if (slots.length > 0) {
          schedule.push({
            date: dateSString,
            slots: slots,
          });
        }


      } 
      return schedule;
    } catch (error: any) {
      logger.error("Error al obtener el horario del medico", error);
      throw `Fallo al obtener el horario del medico: ${
        error.message || error.toString()
      }`;
    }
  } 
}
