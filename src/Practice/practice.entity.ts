import { Collection, Entity, ManyToMany, ManyToOne, Cascade, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/base.entity.js';
import { MedicalSpecialty } from '../medicalSpecialty/medicalSpecialty.entity.js';
import { MedicalInsurance } from '../medicalInsurance/medicalinsurance.entity.js';

@Entity()
export class Practice extends BaseEntity {
  @Property()
  public name: string;

  @Property()
  public description: string;

  @ManyToOne(() => MedicalSpecialty)
  public medicalSpecialty: MedicalSpecialty;

  @ManyToMany(() => MedicalInsurance, (medical_i) => medical_i.coveredPractices, {
    cascade: [Cascade.ALL],
    owner: true
  })
  medicalInsurances = new Collection<MedicalInsurance>(this);

  constructor(name: string, description: string, medicalSpecialty: MedicalSpecialty) {
    super();
    this.name = name;
    this.description = description;
    this.medicalSpecialty = medicalSpecialty;
  }
}
