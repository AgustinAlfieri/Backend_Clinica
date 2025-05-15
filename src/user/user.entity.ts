import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/base.entity.js';

export class User extends BaseEntity {
  dni!: string;

  name!: string;

  email!: string;

  telephone?: string;
}
