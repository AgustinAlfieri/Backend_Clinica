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
    const _em = this.em.fork();
    const newMedic = new Medic();

    const existMedicByDni = await _em.findOne(Medic, { dni: medic.dni });
    if (existMedicByDni) throw new Error('Ya existe un médico con ese DNI');

    const existMedicByLicense = await _em.findOne(Medic, { license: medic.license });
    if (existMedicByLicense) throw new Error('Ya existe un médico con esa licencia');

    if (!medic.password || !medic.email || !medic.dni || !medic.name || !medic.license)
      throw new Error('Todos los campos son obligatorios');

    //No plain text password
    newMedic.password = await hashPassword(medic.password);

    //Assign fields
    newMedic.dni = medic.dni;
    newMedic.name = medic.name;
    newMedic.email = medic.email;
    newMedic.license = medic.license;

    medic.telephone ? (newMedic.telephone = medic.telephone) : (newMedic.telephone = undefined);

    newMedic.medicalSpecialty = new Collection<MedicalSpecialty>(newMedic);

    if (!(medic.medicalSpecialty === null)) {
      for (const id of medic.medicalSpecialty) {
        const specialty = await _em.findOne(MedicalSpecialty, id || '-1');

        if (!specialty) throw new Error('No se encontró la especialidad médica');

        newMedic.medicalSpecialty.add(specialty);
      }
    }

    newMedic.role = Role.MEDIC;

    _em.persistAndFlush(newMedic);
    return newMedic;
  }

  async update(id: string, medicUpdate: Partial<DataNewUser>): Promise<Medic | null> {
    try {
      const _em = this.em.fork();
      const medic = await _em.findOneOrFail(Medic, id, { populate: ['medicalSpecialty', 'appointments'] });
      const newMedicData = new Medic();

      newMedicData.id = id;

      if (!medic) {
        throw new Error('No se encontró el médico');
      }

      //validate if password has changed
      if(!medicUpdate.password){
          newMedicData.password = medic.password;
      }
      else {
          const noChangePassword : boolean = await comparePassword(medicUpdate.password, medic.password);

            if(noChangePassword)
                newMedicData.password = medic.password;
            else
                newMedicData.password = await hashPassword(medicUpdate.password);
        }

      newMedicData.dni = medicUpdate.dni || medic.dni;
      newMedicData.name = medicUpdate.name || medic.name;
      newMedicData.email = medicUpdate.email || medic.email;
      newMedicData.telephone = medicUpdate.telephone || medic.telephone;

      //MedicalSpecialty
      if (!medicUpdate.medicalSpecialty) {
        newMedicData.medicalSpecialty = new Collection<MedicalSpecialty>(newMedicData);
        newMedicData.medicalSpecialty = medic.medicalSpecialty;
      } else {
        newMedicData.medicalSpecialty = new Collection<MedicalSpecialty>(newMedicData);
        for (const ms of medicUpdate.medicalSpecialty) {
          const specialty = await _em.findOne(MedicalSpecialty, ms);

          if (!specialty) throw new Error('No se encontró la especialidad médica');

          newMedicData.medicalSpecialty.add(specialty);
        }
      }

      newMedicData.license = medicUpdate.license || medic.license;
      newMedicData.role = Role.MEDIC;

      //Appointments
      if (!medicUpdate.appointments) {
        newMedicData.appointments = medic.appointments;
      } else {
        newMedicData.appointments = new Collection<Appointment>(newMedicData);
        for (const app of medicUpdate.appointments) {
          const appointment = await _em.findOne(Appointment, app);

          if (!appointment) throw new Error('No se encontró la cita médica');

          newMedicData.appointments.add(appointment);
        }
      }

      _em.assign(medic, newMedicData);
      await _em.flush();

      return newMedicData;
    } catch (error) {
      logger.error('Error al modificar médico:', error);
      throw new Error('Error al modificar médico');
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const _em = this.em.fork();
      const medic = await _em.findOneOrFail(Medic, id);
      _em.remove(medic);
      await _em.flush();
      return true;
    } catch (error) {
      logger.error('Error al eliminar médico:', error);
      return false;
    }
  }
}
