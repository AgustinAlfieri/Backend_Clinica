import { Cascade, Collection, Entity, ManyToMany, OneToMany, Property, PrimaryKey } from '@mikro-orm/core';
import { Practice } from '../Practice/practice.entity.js';
import { Medic } from '../user/userTypes/medic/medic.entity.js';
import { nanoid } from 'nanoid';

@Entity()
export class MedicalSpecialty {
  @PrimaryKey()
  id?: string = Date.now() + nanoid(14);

  @Property({ unique: true })
  name!: string;

  @OneToMany(() => Practice, (practice) => practice.medicalSpecialty, { cascade: [Cascade.ALL] })
  practices = new Collection<Practice>(this);

  @ManyToMany(() => Medic, (medic) => medic.medicalSpecialty, { cascade: [Cascade.ALL], owner: true })
  medicalProfessionals = new Collection<Medic>(this);

  constructor(name: string) {
    this.name = name;
    this.practices = new Collection<Practice>(this);
    this.medicalProfessionals = new Collection<Medic>(this);
  }
}
