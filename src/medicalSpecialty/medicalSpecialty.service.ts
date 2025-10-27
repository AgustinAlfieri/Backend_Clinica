import { Collection, EntityManager } from '@mikro-orm/mysql';
import { MedicalSpecialty } from './medicalSpecialty.entity.js';
import { Practice } from '../practice/practice.entity.js';
import { Medic } from '../user/userTypes/medic/medic.entity.js';
import { resolveMessage } from '../shared/errorManagment/appError.js';

interface MedicalSpecialtyInput {
  id?: string;
  name: string;
  practices?: Collection<Practice>;
  medics?: Collection<Medic>;
}

export class MedicalSpecialtyService {
  constructor(private em: EntityManager) {}

  async findAll() {
    const em = this.em.fork();
    return await em.find(MedicalSpecialty, {}, { populate: ['practices', 'medics'] });
  }

  async findOne(id: string) {
    const em = this.em.fork();
    return await em.findOne(MedicalSpecialty, id, {populate: ['practices', 'medics']});
  }

  async update(medicalSpecialtyData: Partial<MedicalSpecialtyInput>) {
    try {
      const em = this.em.fork();
      
      //Validacion basica
      if(!medicalSpecialtyData.name) 
        throw new Error('El nombre de la especialidad médica es un campo obligatorio');
      
      const medicalSpecialty = em.create(MedicalSpecialty, {
        name: medicalSpecialtyData.name,
      });

      em.nativeUpdate(MedicalSpecialty, { id: medicalSpecialtyData.id }, { name : medicalSpecialtyData.name });

      return medicalSpecialty;
    } catch (error) {
      console.error('Error al guardar la especialidad médica:', error);

      throw `Fallo al actualizar la especialidad médica: ${resolveMessage(error)}`;
    }
  }

  async create(medicalSpecialtyData: MedicalSpecialtyInput) {
    try {
    const em = this.em.fork();

      const newMedicalSpecialty = em.create(MedicalSpecialty, {
        name: medicalSpecialtyData.name,
      });

      em.persistAndFlush(newMedicalSpecialty);

      return newMedicalSpecialty;
    } catch (error) {
      console.error('Error al guardar la especialidad médica:', error);

      throw `Fallo al crear la especialidad médica: ${resolveMessage(error)}`;
    }
  }

  async remove(id: string) {
    try {
      const em = this.em.fork();

      const medicalSpeciality = await em.findOneOrFail(MedicalSpecialty, { id: id });

      if (!medicalSpeciality)
        throw new Error('Especialidad médica no encontrada');

      em.remove(medicalSpeciality);
      await em.flush();

      return medicalSpeciality;
    } catch (error) {
      console.error('Error al eliminar la especialidad médica:', error);

      throw `Fallo al eliminar la especialidad médica: ${resolveMessage(error)}`;
    }
  }
}
