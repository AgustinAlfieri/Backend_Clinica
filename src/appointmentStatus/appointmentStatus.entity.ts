import { Entity, Rel, Property, ManyToOne, DateTimeType } from '@mikro-orm/core';
import { BaseEntity } from '../shared/base.entity.js';
import { TypeAppointmentStatus } from '../typeAppointmentStatus/typeAppointmentStatus.entity.js';
import { Appointment } from '../appointment/appointment.entity.js';

@Entity()
export class AppointmentStatus extends BaseEntity {
  @Property({ nullable: false, type: "datetime" })
  date!: DateTimeType;

  @Property({ nullable: false })
  observations!: string;

  @ManyToOne(() => TypeAppointmentStatus)
  typeAppointmentStatus: Rel<TypeAppointmentStatus>;

  @ManyToOne(() => Appointment)
  appointment: Rel<Appointment>;

  @Property({nullable: false,default: true})
  isActive!: boolean;

  constructor(
    date: DateTimeType,
    observations: string,
    typeAppoitmentStatus: TypeAppointmentStatus,
    appointment: Rel<Appointment>
  ) {
    super();
    this.date = date;
    this.observations = observations;
    this.typeAppointmentStatus = typeAppoitmentStatus;
    this.appointment = appointment;
  }
}
