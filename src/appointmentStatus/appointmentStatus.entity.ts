import { Entity, Rel, Property, ManyToOne, DateTimeType } from '@mikro-orm/core';
import { BaseEntity } from '../shared/base.entity.js';
import { TypeAppointmentStatus } from '../typeAppointmentStatus/typeAppointmentStatus.entity.js';
import { Appointment } from '../appointment/appointment.entity.js';

@Entity()
export class AppointmentStatus extends BaseEntity {
  @Property({ nullable: false, type: DateTimeType })
  date!: Date;

  @Property({ nullable: false })
  observations!: string;

  @ManyToOne(() => TypeAppointmentStatus)
  typeAppointmentStatus: Rel<TypeAppointmentStatus>;

  @ManyToOne(() => Appointment, { nullable: true })
  // The appointment can be null or incomplete during development
  appointment: Rel<Appointment> | null;

  @Property({ nullable: false, default: true })
  isActive!: boolean;

  constructor(
    date: Date,
    observations: string,
    typeAppoitmentStatus: TypeAppointmentStatus,
    appointment: Rel<Appointment> | null = null // The appointment can be null or incomplete during development
  ) {
    super();
    this.date = date;
    this.observations = observations;
    this.typeAppointmentStatus = typeAppoitmentStatus;
    this.appointment = appointment;
  }
}
