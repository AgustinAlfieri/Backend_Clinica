import express from "express";
import { patientRouter } from "./Patient/patient.routes.js";

const app = express()
app.use(express.json())

app.use('api/v1/patient', patientRouter)

app.listen(3100, () => {console.log('Run on port 3100')})