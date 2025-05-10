import { pool } from "../Shared/Database/connections.js";
export class PatientRepository {
    async findAll() {
        const [patiens] = await pool.query("select * from patiens");
        return patiens;
    }
    findOne(_patient) {
        throw new Error('No implemented yet');
    }
    add(_patient) {
        throw new Error('No implemented yet');
    }
    update(_patient) {
        throw new Error('No implemented yet');
    }
    remove(_patient) {
        throw new Error('No implemented yet');
    }
}
//# sourceMappingURL=patient.repository.js.map