import { Entity, OneToMany, ManyToMany, Property, Cascade, Collection } from '@mikro-orm/core';
import { BaseEntity } from '../shared/base.entity.js';

@Entity()
export class AppointmentStatus extends BaseEntity {
  @Property({ nullable: false })
  date!: string;

  @Property({ nullable: false })
  observations!: string;
}