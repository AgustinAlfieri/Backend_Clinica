import { Entity, ManyToOne, PrimaryKey, Rel, OneToMany, Cascade, Collection, Property } from '@mikro-orm/core';
import { MedicalInsurance } from '../../../medicalInsurance/medicalinsurance.entity.js';
import { Appointment } from '../../../appointment/appointment.entity.js';
import { User } from '../../user.entity.js';

@Entity()
export class Patient extends User {
  @Property()
  public insuranceNumber?: string;

  @ManyToOne(() => MedicalInsurance)
  public medicalInsurance?: Rel<MedicalInsurance>;

  @OneToMany(() => Appointment, (appointment) => appointment.patient, { cascade: [Cascade.ALL] })
  public appointments? = new Collection<Appointment>(this);

  constructor(
    insuranceNumber?: string,
    medicalInsurance?: Rel<MedicalInsurance>,
    appointments?: Collection<Appointment>
  ) {
    super();
    this.insuranceNumber = insuranceNumber;
    this.medicalInsurance = medicalInsurance;
    this.appointments = appointments;
  }
}
