import { Collection, EntityManager } from '@mikro-orm/mysql';
import { MedicalSpecialty } from './medicalSpecialty.entity.js';
import { Practice } from '../practice/practice.entity.js';
import { Medic } from '../user/userTypes/medic/medic.entity.js';

interface MedicalSpecialtyDTO {
  name: string;
  practices: Collection<Practice>;
  medicalProfessionals?: Collection<Medic>;
}

export class MedicalSpecialtyService {
  constructor(private em: EntityManager) {}

  async findAll() {
    const em = this.em.fork();
    const specialties = await em.find(MedicalSpecialty, {}, { populate: ['practices', 'medicalProfessionals'] });

    if (!specialties) {
      throw new Error('Especialidades médicas no encontradas');
    }

    return specialties;
  }

  async findOne(id: string) {
    const em = this.em.fork();
    const medicalSpecialty = await em.findOne(MedicalSpecialty, id, {
      populate: ['practices', 'medicalProfessionals']
    });

    if (!medicalSpecialty) {
      throw new Error('Especialidad médica no encontrada');
    }

    return medicalSpecialty;
  }

  async update(id: string, medicalSpecialtyData: MedicalSpecialtyDTO) {
    const em = this.em.fork();
    const medicalSpecialty = await em.findOneOrFail(MedicalSpecialty, id);

    medicalSpecialty.id = id;
    medicalSpecialty.name = medicalSpecialtyData.name;

    if (medicalSpecialtyData.practices) {
      for (const p of medicalSpecialtyData.practices) {
        const id_p = p.id;
        const practice = await em.findOneOrFail(Practice, id_p);

        if (!practice) {
          throw new Error(`Práctica con id ${id_p} no encontrada`);
        }

        medicalSpecialty.practices.add(practice);
      }
    }

    if (medicalSpecialtyData.medicalProfessionals) {
      for (const m of medicalSpecialtyData.medicalProfessionals) {
        const id_m = m.id;
        const medicalProfessional = await em.findOneOrFail(Medic, id_m);

        if (!medicalProfessional) {
          throw new Error(`Profesional médico con id ${id_m} no encontrado`);
        }
        medicalSpecialty.medicalProfessionals.add(medicalProfessional);
      }
    }

    await em.persistAndFlush(medicalSpecialty);
    return medicalSpecialty;
  }

  async create(medicalSpecialtyData: MedicalSpecialtyDTO) {
    const em = this.em.fork();
    const newMedicalSpecialty = new MedicalSpecialty(medicalSpecialtyData.name);

    if (medicalSpecialtyData.practices) {
      for (const p of medicalSpecialtyData.practices) {
        const id_p = p.id;
        const practice = await em.findOneOrFail(Practice, id_p);

        if (!practice) {
          throw new Error(`Práctica con id ${id_p} no encontrada`);
        }

        newMedicalSpecialty.practices.add(practice);
      }
    }

    if (medicalSpecialtyData.medicalProfessionals) {
      for (const m of medicalSpecialtyData.medicalProfessionals) {
        const id_m = m.id;
        const medicalProfessional = await em.findOneOrFail(Medic, id_m);

        if (!medicalProfessional) {
          throw new Error(`Profesional médico con id ${id_m} no encontrado`);
        }

        newMedicalSpecialty.medicalProfessionals.add(medicalProfessional);
      }
    }

    await em.persistAndFlush(newMedicalSpecialty);
    return newMedicalSpecialty;
  }

  async remove(id: string) {
    const em = this.em.fork();
    const medicalSpeciality = em.findOne(MedicalSpecialty, id);

    if (!medicalSpeciality) {
      throw new Error('Especialidad médica no encontrada');
    }

    await em.removeAndFlush(medicalSpeciality);
    return;
  }
}
