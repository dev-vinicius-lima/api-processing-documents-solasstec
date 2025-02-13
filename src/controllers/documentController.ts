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
  const { type, title, description } = req.body
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
      },
      select: {
        id: true,
        type: true,
        title: true,
        description: true,
        file: true,
        createdAt: true,
      },
    })
    res.status(201).json(newDocument)
  } catch (error) {
    res.status(500).json({ error: "Erro ao cadastrar documento" + error })
  }
}

export const getDocumentByNumber = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { number } = req.params

  const document = await prisma.document.findUnique({
    where: { id: Number(number) },
    include: {
      trackingHistory: {
        include: { sendingDeptRef: true, receivingDeptRef: true },
      },
    } as any,
  })

  if (!document) {
    res.status(404).json({ message: "Documento não encontrado" })
  }
  res.status(200).json(document)
}

export const listDocuments = async (req: Request, res: Response) => {
  try {
    const documents = await prisma.document.findMany({
      include: {
        trackingHistory: {
          include: {
            sendingDeptRef: true,
            receivingDeptRef: true,
          },
        },
      },
    })

    const transformedDocuments = documents.map((doc) => {
      const lastTracking = doc.trackingHistory[doc.trackingHistory.length - 1]
      return {
        id: doc.id,
        type: doc.type,
        title: doc.title,
        description: doc.description,
        file: doc.file,
        createdAt: doc.createdAt,
        departmentId: doc.departmentId,
        number: String(doc.id),
        sectorShipping: lastTracking
          ? lastTracking.sendingDeptRef?.description
          : "N/A",
        dateTimeSubmission: new Date(doc.createdAt).toLocaleString(),
        ReceivingSector: lastTracking
          ? lastTracking.receivingDeptRef?.description
          : "N/A",
        dateTimeReceived:
          lastTracking && lastTracking.receivingDept
            ? new Date(doc.updatedAt).toLocaleString()
            : "N/A",
      }
    })

    res.status(200).json(transformedDocuments)
  } catch (error) {
    res.status(500).json({ error: "Error listing documents" })
  }
}

export const sendDocument = async (req: Request, res: Response) => {
  const { documentId, receivingDepartmentId } = req.body

  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: { trackingHistory: true },
  })

  if (!document) {
    return res.status(404).json({ message: "Document not found" })
  }
  const sendingDepartmentId = document.departmentId
  if (sendingDepartmentId === receivingDepartmentId) {
    return res.status(400).json({
      message: "O setor de envio deve ser diferente do de recebimento",
    })
  }

  const department = await prisma.department.findUnique({
    where: { id: Number(document.departmentId) },
  })

  if (!department) {
    return res
      .status(400)
      .json({ message: "Sending department does not exist" })
  }

  const lastHistoryEntry =
    document.trackingHistory[document.trackingHistory.length - 1]
  if (lastHistoryEntry) {
    if (lastHistoryEntry.receivingDept) {
      return res.status(400).json({ message: "Documento já foi enviado." })
    }
  }

  const historyEntry = await prisma.historyTracking.create({
    data: {
      documentId: document.id,
      sendingDept: document.departmentId ?? 0,
      receivingDept: receivingDepartmentId,
      departmentId: document.departmentId ?? 0,
    },
  })

  res.status(201).json(historyEntry)
}

export const receiveDocument = async (req: Request, res: Response) => {
  const { documentId } = req.body

  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: { trackingHistory: true },
  })

  if (!document) {
    return res.status(404).json({ message: "Documento não encontrado" })
  }
  const lastHistoryEntry =
    document.trackingHistory[document.trackingHistory.length - 1]
  if (!lastHistoryEntry || !lastHistoryEntry.receivingDept) {
    return res
      .status(400)
      .json({ message: "Documento não foi enviado previamente." })
  }

  await prisma.historyTracking.update({
    where: { id: lastHistoryEntry.id },
    data: { receivingDept: lastHistoryEntry.receivingDept },
  })

  res.status(200).json({ message: "Documento recebido com sucesso." })
}

export const deleteDocument = async (req: Request, res: Response) => {
  const { number } = req.params

  const document = await prisma.document.findUnique({
    where: { id: Number(number) },
  })

  if (!document) {
    res.status(404).json({ message: "Documento nao encontrado" })
  }

  await prisma.document.delete({ where: { id: Number(number) } })
  res.status(200).json({ message: "Documento deletado com sucesso" })
}
