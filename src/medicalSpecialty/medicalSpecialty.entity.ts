import { Cascade, Collection, Entity, ManyToMany, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/base.entity.js';
import { Practice } from '../Practice/practice.entity.js';
import { Medic } from '../user/userTypes/medic/medic.entity.js';

@Entity()
export class MedicalSpecialty extends BaseEntity {
  @Property()
  private name: string;

  @OneToMany(() => Practice, (practice) => practice.medicalSpecialty, { cascade: [Cascade.ALL] })
  practices = new Collection<Practice>(this);

  @ManyToMany(() => Medic, (medic) => medic.medicalSpecialty, { cascade: [Cascade.ALL], owner: true })
  medicalProfessionals = new Collection<Medic>(this);

  constructor(name: string, practices: Collection<Practice>, medicalProfessionals: Collection<Medic>) {
    super();
    this.name = name;
    this.practices = practices;
    this.medicalProfessionals = medicalProfessionals;
  }
}
