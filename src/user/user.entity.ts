import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/base.entity.js';

@Entity()
export class User extends BaseEntity {
  @Property({ nullable: false })
  dni!: string;

  @Property({ nullable: false })
  name!: string;

  @Property({ nullable: false })
  email!: string;

  @Property({ nullable: false })
  telephone?: string;
}
