import { Cascade, Collection, Entity, ManyToMany, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/base.entity.js';
import { Practice } from '../practice/practice.entity.js';
import { Patient } from '../user/userTypes/patient/patient.entity.js';

@Entity()
export class MedicalInsurance extends BaseEntity {
  @Property({ unique: true })
  name!: string;

  @ManyToMany(() => Practice, (practice) => practice.medicalInsurances)
  coveredPractices = new Collection<Practice>(this);

  @OneToMany(() => Patient, (patient) => patient.medicalInsurance, { cascade: [Cascade.ALL] })
  clients = new Collection<Patient>(this);

  constructor(name: string, coveredPractices: Collection<Practice>, clients: Collection<Patient>) {
    super();
    this.name = name;
    this.coveredPractices = coveredPractices;
    this.clients = clients;
  }
}
