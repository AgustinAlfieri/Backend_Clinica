import { Collection, Entity, ManyToMany, ManyToOne, Cascade, Property, Rel, PrimaryKey } from '@mikro-orm/core';
import { MedicalSpecialty } from '../medicalSpecialty/medicalSpecialty.entity.js';
import { MedicalInsurance } from '../medicalInsurance/medicalInsurance.entity.js';
import { Appointment } from '../appointment/appointment.entity.js';
import { nanoid } from 'nanoid';

@Entity()
export class Practice{
  @PrimaryKey()
  id: string = Date.now() + nanoid(14);

  @Property({ unique: true })
  public name!: string;

  @Property()
  public description?: string | null;

  @ManyToOne(() => MedicalSpecialty)
  public medicalSpecialty: Rel<MedicalSpecialty>;

  @ManyToMany(() => MedicalInsurance, (medical_i) => medical_i.coveredPractices, {
    cascade: [Cascade.ALL],
    owner: true
  })
  medicalInsurances = new Collection<MedicalInsurance>(this);

  @ManyToMany(() => Appointment, (appointment) => appointment.practices)
  appointments = new Collection<Appointment>(this);

  constructor(name: string, medicalSpecialty: Rel<MedicalSpecialty>, medicalInsurances: Collection<MedicalInsurance>, 
              appointments: Collection<Appointment>, description: string) 
  {
    this.name = name;
    this.description = description;
    this.medicalSpecialty = medicalSpecialty;
    this.medicalInsurances = medicalInsurances;
    this.appointments = appointments;
  }
}
