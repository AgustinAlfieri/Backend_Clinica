import { Entity, ManyToOne, PrimaryKey, Rel, OneToMany, Cascade, Collection } from '@mikro-orm/core'
import { MedicalInsurance } from '../../../medicalInsurance/medicalinsurance.entity.js';
import { Appointment } from '../../../appointment/appointment.entity.js';
import { User } from '../../user.entity.js';

@Entity()
export class Patient extends User {
  @PrimaryKey()
  public id = crypto.randomUUID();

  @ManyToOne(() => MedicalInsurance)
  public medicalInsurance: Rel<MedicalInsurance>;

  @OneToMany(() => Appointment, (appointment) => appointment.patient, { cascade: [Cascade.ALL] })
  appointments = new Collection<Appointment>(this);

  constructor(medicalInsurance: Rel<MedicalInsurance>, appointments: Collection<Appointment>) {
    super();
    this.medicalInsurance = medicalInsurance;
    this.appointments = appointments;
  }
}
