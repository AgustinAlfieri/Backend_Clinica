import { Entity, Rel, Property, ManyToOne, DateTimeType } from '@mikro-orm/core';
import { BaseEntity } from '../shared/base.entity.js';
import { TypeAppointmentStatus } from '../typeAppointmentStatus/typeAppointmentStatus.entity.js';
import { Appointment } from '../appointment/appointment.entity.js';

@Entity()
export class AppointmentStatus extends BaseEntity {
  @Property({ type: DateTimeType })
  date!: Date;

  @Property()
  observations?: string;

  @ManyToOne(() => TypeAppointmentStatus)
  typeAppointmentStatus: Rel<TypeAppointmentStatus>;

  @ManyToOne(() => Appointment)
  appointment: Rel<Appointment>;

  constructor(
    date: Date,
    typeAppoitmentStatus: TypeAppointmentStatus,
    appointment: Rel<Appointment>,
    observations?: string
  ) {
    super();
    this.date = date;
    this.observations = observations;
    this.typeAppointmentStatus = typeAppoitmentStatus;
    this.appointment = appointment;
  }
}
