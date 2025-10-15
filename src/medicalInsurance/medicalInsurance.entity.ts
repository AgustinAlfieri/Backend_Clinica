import { Cascade, Collection, Entity, ManyToMany, OneToMany, Property, PrimaryKey } from '@mikro-orm/core';
import { Practice } from '../practice/practice.entity.js';
import { Patient } from '../user/userTypes/patient/patient.entity.js';
import { nanoid } from 'nanoid';

@Entity()
export class MedicalInsurance {
  @PrimaryKey()
  id?: string = Date.now() + nanoid(14);

  @Property({ unique: true })
  name: string;

  @ManyToMany(() => Practice, (practice) => practice.medicalInsurances)
  practices = new Collection<Practice>(this);

  @OneToMany(() => Patient, (patient) => patient.medicalInsurance, { cascade: [Cascade.ALL] })
  patients = new Collection<Patient>(this);

  constructor(name: string, coveredPractices: Collection<Practice>, clients: Collection<Patient>) {
    this.name = name;
    this.practices = coveredPractices;
    this.patients = clients;
  }
}
