import { Collection, Entity, ManyToMany, ManyToOne, Cascade, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/base.entity.js';
import { MedicalSpecialty } from '../medicalSpecialty/medicalSpecialty.entity.js';
import { MedicalInsurance } from '../medicalInsurance/medicalinsurance.entity.js';
import { Appointment } from '../appointment/appointment.entity.js';
import { Rel } from '@mikro-orm/core';

@Entity()
export class Practice extends BaseEntity {
  @Property()
  public name: string;

  @Property()
  public description: string;

  @ManyToOne(() => MedicalSpecialty)
  public medicalSpecialty: Rel<MedicalSpecialty>;

  @ManyToMany(() => MedicalInsurance, (medical_i) => medical_i.coveredPractices, {
    cascade: [Cascade.ALL],
    owner: true
  })
  medicalInsurances = new Collection<MedicalInsurance>(this);

  @ManyToMany(() => Appointment, (appointment) => appointment.practices)
  appointments = new Collection<Appointment>(this);

  constructor(
    name: string,
    description: string,
    medicalSpecialty: Rel<MedicalSpecialty>,
    medicalInsurances: Collection<MedicalInsurance>,
    appointments: Collection<Appointment>
  ) {
    super();
    this.name = name;
    this.description = description;
    this.medicalSpecialty = medicalSpecialty;
    this.medicalInsurances = medicalInsurances;
    this.appointments = appointments;
  }
}
