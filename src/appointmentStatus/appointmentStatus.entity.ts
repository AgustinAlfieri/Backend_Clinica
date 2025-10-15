import { Entity, Rel, Property, ManyToOne, DateTimeType, PrimaryKey } from '@mikro-orm/core';
import { TypeAppointmentStatus } from '../typeAppointmentStatus/typeAppointmentStatus.entity.js';
import { Appointment } from '../appointment/appointment.entity.js';
import { nanoid } from 'nanoid';

@Entity()
export class AppointmentStatus {
  @PrimaryKey()
  id?: string = Date.now() + nanoid(14);

  @Property({ type: DateTimeType })
  date!: Date;

  @Property()
  observation?: string;

  @ManyToOne(() => TypeAppointmentStatus)
  typeAppointmentStatus: Rel<TypeAppointmentStatus>;

  @ManyToOne(() => Appointment)
  appointment: Rel<Appointment>;

  constructor(date: Date, typeAppoitmentStatus: TypeAppointmentStatus, appointment: Rel<Appointment>, observations?: string)
  {
    this.date = date;
    this.observation = observations;
    this.typeAppointmentStatus = typeAppoitmentStatus;
    this.appointment = appointment;
  }
}
