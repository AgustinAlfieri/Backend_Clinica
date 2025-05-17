import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/base.entity.js';

export class User extends BaseEntity {
  @Property()
  public dni!: string;

  @Property()
  public name!: string;

  @Property()
  public email!: string;

  @Property()
  public telephone?: string;
}
