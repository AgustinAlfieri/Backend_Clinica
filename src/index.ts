import express from "express";

const app = express()
app.use(express.json()) 


//Ver como vamos a manejar las rutas

app.listen(3100, () => {console.log('Run on port 3100')})