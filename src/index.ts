import express from "express"
import dotenv from "dotenv"
import routes from "./routes"
import cors from "cors"
import errorHandler from "./middleware/errorHandler"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(errorHandler)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(routes)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
