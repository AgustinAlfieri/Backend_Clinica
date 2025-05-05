import { publicDecrypt } from "crypto";
import { Repository } from "../Shared/repository.js";
import { tipo_Estado_Turno } from "./tipo_Estado_Turno.entity.js";

const  tipo_Estado_Turnos  = [
    new tipo_Estado_Turno('Pendiente')
]