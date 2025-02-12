import express from "express"
import dotenv from "dotenv"
import { routes } from "./routes"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api", routes)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
