import { Entity } from '@mikro-orm/core';
import { BaseEntity } from '../shared/base.entity.js';

@Entity()
export class User extends BaseEntity {}
