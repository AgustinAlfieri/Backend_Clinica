import { PrimaryKey } from '@mikro-orm/core';
import { nanoid } from 'nanoid';

export abstract class BaseEntity {
  @PrimaryKey()
  id?: string = Date.now() + nanoid(14);
}
