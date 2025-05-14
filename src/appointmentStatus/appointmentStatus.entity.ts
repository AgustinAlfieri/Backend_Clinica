import { Entity, OneToMany, ManyToMany, Property, Cascade, Collection, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from '../shared/base.entity.js';
import { TypeAppointmentStatus } from '../typeAppointmentStatus/typeAppointmentStatus.entity.js';

@Entity()
export class AppointmentStatus extends BaseEntity {
  @Property({ nullable: false })
  date!: string;

  @Property({ nullable: false })
  observations!: string;

  @ManyToOne( ()  => TypeAppointmentStatus)
  typeAppointmentStatus: TypeAppointmentStatus;

  constructor( date: string, observations: string, typeAppoitmentStatus: TypeAppointmentStatus){
    super();
    this.date = date;
    this.observations = observations;
    this.typeAppointmentStatus = typeAppoitmentStatus;
  }

}