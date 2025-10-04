import { Entity, ManyToOne, Rel, OneToMany, Cascade, Collection, Property } from '@mikro-orm/core';
import { Appointment } from '../../../appointment/appointment.entity.js';
import { User } from '../../user.entity.js';
import { MedicalInsurance } from '../../../medicalInsurance/medicalInsurance.entity.js';

@Entity()
export class Patient extends User {
  @Property()
  public insuranceNumber?: string | null;

  @ManyToOne(() => MedicalInsurance, { nullable: true })
  public medicalInsurance?: Rel<MedicalInsurance>;

  @OneToMany(() => Appointment, (appointment) => appointment.patient, { cascade: [Cascade.ALL] })
  public appointments? = new Collection<Appointment>(this);

}
