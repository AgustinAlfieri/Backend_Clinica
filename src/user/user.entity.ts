import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/base.entity.js';

export class User extends BaseEntity {
  @Property({ unique: true })
  public dni!: string;

  @Property()
  public name!: string;

  @Property({ unique: true })
  public email!: string;

  @Property()
  public password!: string;

  @Property()
  public telephone?: string;
}
