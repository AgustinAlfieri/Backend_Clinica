import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/base.entity.js';
import { Practice } from '../practice/practice.entity.js';
import { Medic } from '../user/user_types/medic/medic.entity.js';

@Entity()
export class Medical_Specialty extends BaseEntity {
  @Property()
  private name: string;

  @Property()
  @OneToMany(() => Practice, (practice) => practice.medical_specialty)
  practices = new Collection<Practice>(this);

  @Property()
  @OneToMany(() => Medic, (medic) => medic.medical_specialty)
  medical_professionals = new Collection<Medic>(this);

  constructor(name: string) {
    super();
    this.name = name;
  }
}
