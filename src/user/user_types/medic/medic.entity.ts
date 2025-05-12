import { Entity, Property } from '@mikro-orm/core';
import { User } from '../../user.entity.js';

@Entity()
export class Medic extends User {
  @Property({ nullable: false })
  license!: string;
}
