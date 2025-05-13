import { Entity, OneToMany, ManyToMany, Property, Cascade, Collection } from '@mikro-orm/core';
import { BaseEntity } from '../shared/base.entity.js';

@Entity()
export class TypeAppointmentStatus extends BaseEntity {
  @Property({ nullable: false })
  name!: string;
}