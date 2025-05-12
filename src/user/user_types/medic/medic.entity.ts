import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { User } from '../../user.entity.js';
import { Medical_Specialty } from '../../../medical_specialty/medical_specialty.entity.js';

@Entity()
export class Medic extends User {
  @Property({ nullable: false })
  license!: string;

  @Property() 
  @ManyToOne( () => Medical_Specialty )
  public medical_specialty: Medical_Specialty;

  constructor(medical_specialty: Medical_Specialty, license: string){
    super();
    this.medical_specialty = medical_specialty;
    this.license = license;
  }

}
