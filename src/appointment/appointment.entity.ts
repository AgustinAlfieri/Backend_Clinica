import {
  Entity,
  DateTimeType,
  OneToMany,
  ManyToMany,
  Property,
  Cascade,
  Collection,
  ManyToOne,
  Rel
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/base.entity.js';
import { AppointmentStatus } from '../appointmentStatus/appointmentStatus.entity.js';
import { Patient } from '../user/userTypes/patient/patient.entity.js';
import { Medic } from '../user/userTypes/medic/medic.entity.js';
import { Administrative } from '../user/userTypes/administrative/administrative.entity.js';
import { Practice } from '../practice/practice.entity.js';

@Entity()
export class Appointment extends BaseEntity {
  @Property({ nullable: false, type: 'datetime' })
  date!: DateTimeType;

  @OneToMany(() => AppointmentStatus, (status) => status.appointment, { cascade: [Cascade.ALL] })
  statusList = new Collection<AppointmentStatus>(this);

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
    date: DateTimeType,
    statusList: Collection<AppointmentStatus>,
    patient: Rel<Patient>,
    medic: Rel<Medic>,
    administratives: Collection<Administrative>,
    practices: Collection<Practice>
  ) {
    super();
    this.date = date;
    this.statusList = statusList;
    this.patient = patient;
    this.medic = medic;
    this.administratives = administratives;
    this.practices = practices;
  }
}
