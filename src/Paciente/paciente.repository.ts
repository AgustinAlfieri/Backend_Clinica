import { publicDecrypt } from "crypto";
import { Repository } from "../Shared/repository.js";
import { Paciente } from "./paciente.entity.js";

const pacientes  = [
    new Paciente(
        'Juan Pablo',
        'Paraguay 1426',
        20,
        'Avalian',
    )
]

//export class pacienteRepository implements Repository<Paciente> {
    //Implementar todos los metodos de la interface
//}