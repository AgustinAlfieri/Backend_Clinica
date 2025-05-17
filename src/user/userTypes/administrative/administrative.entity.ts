import { Entity, ManyToMany, Collection } from '@mikro-orm/core';
import { User } from '../../user.entity.js';
import { Appointment } from '../../../appointment/appointment.entity.js';

@Entity()
export class Administrative extends User {
  @ManyToMany(() => Appointment, (appointment) => appointment.administratives)
  appointments = new Collection<Appointment>(this);

  constructor(appointments: Collection<Appointment>) {
    super();
    this.appointments = appointments;
  }
}
