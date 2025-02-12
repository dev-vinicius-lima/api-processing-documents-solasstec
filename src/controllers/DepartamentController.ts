import { PrismaClient } from "@prisma/client"
import { Response, Request } from "express"

const prisma = new PrismaClient()

// Função para cadastrar um setor
export const createDepartment = async (req: Request, res: Response) => {
  const { acronym, description } = req.body

  try {
    const newDepartment = await prisma.department.create({
      data: {
        acronym,
        description,
      },
    })
    res.status(201).json(newDepartment)
  } catch (error) {
    res.status(500).json({ error: "Erro ao cadastrar setor" })
  }
}

// Função para listar setores
export const listDepartments = async (req: Request, res: Response) => {
  try {
    const departments = await prisma.department.findMany()
    res.status(200).json(departments)
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar setores" })
  }
}
