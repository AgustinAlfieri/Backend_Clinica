import { PrimaryKey, Property } from '@mikro-orm/core';
import { nanoid } from 'nanoid/non-secure';

export class User {
  @PrimaryKey()
  id: string = Date.now() + nanoid(14);

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

  @Property()
  public role!: string;
}
