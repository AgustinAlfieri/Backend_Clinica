import { Collection, Entity, ManyToMany, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/base.entity.js";
import { Practice } from "../practice/practice.entity.js";
import { Patient } from "../user/user_types/patient/patient.entity.js";

@Entity()
export class MedicalInsurance extends BaseEntity {
    @Property()
    private name: string;

    @Property()
    @ManyToMany( () => Practice, practice => practice.medical_insurances )
    covered_practices = new Collection<Practice>(this)

    @Property()
    @OneToMany( () => Patient, patient => patient.medical_insurance )
    clients = new Collection<Patient>(this)

    constructor(name: string){
        super();
        this.name = name;
    }
}