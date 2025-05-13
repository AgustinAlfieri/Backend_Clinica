import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/base.entity.js";
import { Medical_Specialty } from "../medical_specialty/medical_specialty.entity.js";
import { MedicalInsurance } from "../medical_insurance/medicalinsurance.entity.js";

@Entity()
export class Practice extends BaseEntity{
    @Property()
    public name: string;

    @Property()
    public description: string;

    @Property()
    @ManyToOne( () => Medical_Specialty )
    public medical_specialty: Medical_Specialty;

    @Property()
    @ManyToMany( () => MedicalInsurance, medical_i => medical_i.covered_practices )
    medical_insurances =  new Collection<MedicalInsurance>(this)

    constructor(name: string, description: string, medical_specialty: Medical_Specialty){
        super();
        this.name = name;
        this.description = description;
        this.medical_specialty = medical_specialty;
    }
}