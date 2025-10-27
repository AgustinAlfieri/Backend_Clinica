import {
  Entity,
  DateTimeType,
  OneToMany,
  ManyToMany,
  Property,
  Cascade,
  Collection,
  ManyToOne,
  Rel,
  PrimaryKey
} from '@mikro-orm/core';
import { AppointmentStatus } from '../appointmentStatus/appointmentStatus.entity.js';
import { Patient } from '../user/userTypes/patient/patient.entity.js';
import { Medic } from '../user/userTypes/medic/medic.entity.js';
import { Administrative } from '../user/userTypes/administrative/administrative.entity.js';
import { Practice } from '../practice/practice.entity.js';
import { nanoid } from 'nanoid';

@Entity()
export class Appointment {
  @PrimaryKey()
  id?: string = Date.now() + nanoid(14);

  @Property({ nullable: false, type: 'datetime' })
  appointmentDate!: Date;

  @OneToMany(() => AppointmentStatus, (status) => status.appointment, { cascade: [Cascade.ALL] })
  appointmentsStatus = new Collection<AppointmentStatus>(this);

  @ManyToOne(() => Patient)
  patient: Rel<Patient>;

  @ManyToOne(() => Medic)
  medic: Rel<Medic>;

  @ManyToMany(() => Administrative, (administrative) => administrative.appointments, {
    cascade: [Cascade.ALL],
    owner: true
  })
  administratives = new Collection<Administrative>(this);

  @ManyToMany(() => Practice, (practice) => practice.appointments, {
    cascade: [Cascade.ALL],
    owner: true
  })
  practices = new Collection<Practice>(this);

  constructor(
    appointmentDate: Date,
    appointmentsStatus: Collection<AppointmentStatus>,
    patient: Rel<Patient>,
    medic: Rel<Medic>,
    administratives: Collection<Administrative>,
    practices: Collection<Practice>
  ) {
    this.appointmentDate = appointmentDate;
    this.appointmentsStatus = appointmentsStatus;
    this.patient = patient;
    this.medic = medic;
    this.administratives = administratives;
    this.practices = practices;
  }
}
