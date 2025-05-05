import { publicDecrypt } from "crypto";
import { Repository } from "../Shared/repository.js";
import { Patient } from "./patient.js";

const patiens  = [
    new Patient(
        'Juan Pablo',
        'Paraguay 1426',
        20,
        'Avalian',
    )
]

export class patientRepository implements Repository<Patient> {
    public findAll(): Patient[] | undefined {
        return patiens
    }

    public findOne(_patient: { id: string; }): Patient | undefined {
        return patiens.find((p) => p.id === _patient.id)
    }

    public add(_patient: Patient): Patient | undefined {
        patiens.push(_patient)
        return
    }

    public update(_patient: Patient): Patient | undefined {
        const patienIndex = patiens.findIndex((p) => p.id === _patient.id)

        if(patienIndex != -1)
            patiens[patienIndex] = {...patiens[patienIndex], ..._patient}
        
        return patiens[patienIndex]
    }

    public delete(_patient: Patient): Patient | undefined{
        const patientIndex = patiens.findIndex((p) => p.id === _patient.id)

        if(patientIndex != -1){
            const deletepatien = patiens[patientIndex]
            patiens.splice(patientIndex,1)
            return deletepatien
        }
    }
}