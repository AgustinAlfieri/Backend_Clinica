import { error } from "console";
import { pool } from "../Shared/Database/connections.js";
import { Repository } from "../Shared/repository.js";
import { Patient } from "./patient.js";

export class PatientRepository implements Repository<Patient> {
    public async findAll(): Promise<Patient[] | undefined> {
        const [patiens] =  await pool.query("select * from patiens")
        return patiens as Patient[]
    }

    public findOne(_patient: { id: string }): Patient | undefined {
        throw new Error('No implemented yet')
    }

    public add(_patient: Patient): Patient | undefined {
        throw new Error('No implemented yet')
    }

    public update(_patient: Patient): Patient | undefined {
        throw new Error('No implemented yet')
    }

    public remove(_patient: { id: string; }): Patient | undefined{
        throw new Error('No implemented yet')
    }
}