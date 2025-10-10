import { Collection, EntityManager } from '@mikro-orm/mysql';
import { Patient } from './patient.entity.js';
import { comparePassword, DataNewUser, hashPassword } from '../../../shared/auth/auth.service.js';
import { MedicalInsurance } from '../../../medicalInsurance/medicalInsurance.entity.js';
import { Role } from '../../../shared/enums/role.enum.js';
import { logger } from '../../../shared/logger/logger.js';
import { Appointment } from '../../../appointment/appointment.entity.js';

export class PatientService {
  constructor(private em: EntityManager) {}

  async findAll() {
    const _em = this.em.fork();
    return await _em.find(Patient, {}, { populate: ['medicalInsurance', 'appointments'] });
  }

  async findOne(id: string) {
    const _em = this.em.fork();
    return await _em.findOne(Patient, id, { populate: ['medicalInsurance', 'appointments'] });
  }

  async create(patient: DataNewUser): Promise<Patient> {
    try {
      //Validaciones basicas
      if (!patient.dni || !patient.email) throw new Error('Debe ingresar dni o email');

      if (!patient.name || !patient.password) throw new Error('Faltan datos obligatorios');

      const _em = this.em.fork();
      //Creo el paciente
      const newPatient = await _em.create(Patient, {
        dni: patient.dni,
        name: patient.name,
        email: patient.email,
        password: await hashPassword(patient.password),
        telephone: patient.telephone,
        insuranceNumber: patient.insuranceNumber,
        role: Role.PATIENT
      });

      //Si viene con obra social, la busco y asigno
      if (patient.medicalInsurance) {
        //Por si eligió una obra social pero no ingresó numero de afiliado
        if (!newPatient.insuranceNumber) throw new Error('Debe ingresar numero de afiliado de la obra social');

        const medicalInsurance = await _em.findOne(MedicalInsurance, patient.medicalInsurance);

        if (!medicalInsurance) throw new Error('La obra social no existe');

        newPatient.medicalInsurance = medicalInsurance;
      }

      // TODO: Revisar si tiene sentido validar los appointments en el create, siendo que para crear turnos el usuario debe existir
      //Si viene con turnos, los busco y asigno
      if (patient.appointments) {
        const appointments = new Collection<Appointment>(newPatient);
        for (const appointmentId of patient.appointments) {
          const appointment = await _em.findOne(Appointment, appointmentId);

          if (!appointment) throw new Error(`El turno con id ${appointmentId} no existe`);
          else appointments.add(appointment);
        }
        newPatient.appointments = appointments;
      }

      _em.persistAndFlush(newPatient);
      return newPatient;
    } catch (error: any) {
      logger.error('Error al crear el paciente', error);

      throw `Fallo al crear el paciente: ${error.message || error.toString()}`;
    }
  }

  async update(id: string, patientUpdate: Partial<DataNewUser>): Promise<void> {
    try {
      const _em = this.em.fork();

      //Si quiere actualizar la password, la hasheo
      if (patientUpdate.password) patientUpdate.password = await hashPassword(patientUpdate.password);

      const result = await _em.nativeUpdate(Patient, { id }, patientUpdate);
    } catch (error: any) {
      logger.error('Error al actualizar paciente', error);

      throw `Fallo al actualizar paciente: ${error.message || error.toString()}`;
    }
  }

  async remove(id: string) {
    try {
      const _em = this.em.fork();
      const patient = await _em.findOneOrFail(Patient, id);

      await _em.removeAndFlush(patient);
      return true;
    } catch (error) {
      logger.error('Error al eliminar paciente', error);
      return false;
    }
  }
}
