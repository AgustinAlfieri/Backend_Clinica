import { Entity, OneToMany, Property, Collection, PrimaryKey } from '@mikro-orm/core';
import { AppointmentStatus } from '../appointmentStatus/appointmentStatus.entity.js';
import { nanoid } from 'nanoid';

@Entity()
export class TypeAppointmentStatus {
  @PrimaryKey()
  id?: string = Date.now() + nanoid(14);

  @Property({ unique: true })
  name!: string;

  @OneToMany(() => AppointmentStatus, (ap) => ap.typeAppointmentStatus)
  appointmentStatus = new Collection<AppointmentStatus>(this);
}
