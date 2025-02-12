// controllers/documentController.ts
import { NextFunction, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import multer from "multer"

const prisma = new PrismaClient()
const upload = multer({ dest: "uploads/" })
export const uploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.single("pdfFile")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message })
    }
    next()
  })
}

export const createDocument = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { type, title, description, departmentId } = req.body
  const pdfFile = req.file
  if (!pdfFile) {
    res.status(400).json({ error: "Arquivo PDF é obrigatório." })
  }

  try {
    const newDocument = await prisma.document.create({
      data: {
        type,
        title,
        description,
        file: pdfFile?.filename as string,
        createdAt: new Date(),
        departmentId: departmentId ? parseInt(departmentId, 10) : null,
      },
    })
    res.status(201).json(newDocument)
  } catch (error) {
    res.status(500).json({ error: "Erro ao cadastrar documento" + error })
  }
}

export const listDocuments = async (req: Request, res: Response) => {
  try {
    const documents = await prisma.document.findMany()
    res.status(200).json(documents)
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar documentos" })
  }
}
