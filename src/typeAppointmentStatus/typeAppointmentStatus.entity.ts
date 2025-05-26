import { Entity, OneToMany, ManyToMany, Property, Cascade, Collection } from '@mikro-orm/core';
import { BaseEntity } from '../shared/base.entity.js';
import { AppointmentStatus } from '../appointmentStatus/appointmentStatus.entity.js';

@Entity()
export class TypeAppointmentStatus extends BaseEntity {
  @Property({ unique: true })
  name!: string;

  @OneToMany(() => AppointmentStatus, (ap) => ap.typeAppointmentStatus)
  appointmentStatus? = new Collection<AppointmentStatus>(this);

  constructor(name: string, appointmentStatus?: Collection<AppointmentStatus>) {
    super();
    this.name = name;
    this.appointmentStatus = appointmentStatus;
  }
}
