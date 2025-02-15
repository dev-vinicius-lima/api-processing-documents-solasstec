import { PrismaClient } from "@prisma/client"
import { Response, Request } from "express"

const prisma = new PrismaClient()

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

export const listDepartments = async (req: Request, res: Response) => {
  try {
    const departments = await prisma.department.findMany()
    res.status(200).json(departments)
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar setores" })
  }
}

export const deleteDepartment = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const deletedDepartment = await prisma.department.delete({
      where: { id: Number(id) },
    })
    res.status(200).json(deletedDepartment)
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar setor" })
  }
}

export const editDepartment = async (req: Request, res: Response) => {
  const { id } = req.params
  const { acronym, description } = req.body

  try {
    const updatedDepartment = await prisma.department.update({
      where: { id: Number(id) },
      data: { acronym, description },
    })
    res.status(200).json(updatedDepartment)
  } catch (error) {
    res.status(500).json({ error: "Erro ao editar setor" })
  }
}
