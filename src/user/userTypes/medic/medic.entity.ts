import { Collection, Entity, ManyToMany, Cascade, OneToMany, Property } from '@mikro-orm/core';
import { User } from '../../user.entity.js';
import { MedicalSpecialty } from '../../../medicalSpecialty/medicalSpecialty.entity.js';
import { Appointment } from '../../../appointment/appointment.entity.js';

@Entity()
export class Medic extends User {
  @Property({ nullable: false })
  license!: string;

  @ManyToMany(() => MedicalSpecialty, (medicalSpecialty) => medicalSpecialty.medicalProfessionals)
  medicalSpecialty = new Collection<MedicalSpecialty>(this);

  @OneToMany(() => Appointment, (appointment) => appointment.medic, { cascade: [Cascade.ALL] })
  appointments = new Collection<Appointment>(this);

  constructor(medicalSpecialty: Collection<MedicalSpecialty>, license: string, appointments: Collection<Appointment>) {
    super();
    this.medicalSpecialty = medicalSpecialty;
    this.license = license;
    this.appointments = appointments;
  }
}
