import { Collection, Entity, ManyToMany, ManyToOne, Property } from '@mikro-orm/core';
import { User } from '../../user.entity.js';
import { MedicalSpecialty } from '../../../medicalSpecialty/medicalSpecialty.entity.js';

@Entity()
export class Medic extends User {
  @Property({ nullable: false })
  license!: string;

  @ManyToMany(() => MedicalSpecialty, (medicalSpecialty) => medicalSpecialty.medicalProfessionals)
  medicalSpecialty = new Collection<MedicalSpecialty>(this);

  /*
  constructor(medicalSpecialty: MedicalSpecialty, license: string) {
    super();
    this.medicalSpecialty = medicalSpecialty;
    this.license = license;
  }
    */
}
