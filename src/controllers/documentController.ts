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

  const department = await prisma.department.findUnique({
    where: { id: Number(departmentId) },
  })

  if (!department) {
    res.status(404).json({ error: "Setor nao encontrado." })
  }

  try {
    const newDocument = await prisma.document.create({
      data: {
        type,
        title,
        description,
        file: pdfFile?.filename as string,
        createdAt: new Date(),
        departmentId: Number(departmentId),
        sectorShipping: department?.acronym,
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
  const documentId = parseInt(number)

  const document = await prisma.document.findUnique({
    where: { id: Number(number) },
    include: {
      trackingHistory: {
        include: { sendingDeptRef: true, receivingDeptRef: true },
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!document) {
    res.status(404).json({ message: "Documento não encontrado" })
  }
  const status = inferDocumentStatus(
    document?.trackingHistory!,
    document?.isReceived!
  )

  res.status(200).json({ ...document, status })
}

export const listDocuments = async (req: Request, res: Response) => {
  try {
    const documents = await prisma.document.findMany({
      include: {
        trackingHistory: {
          include: {
            sendingDeptRef: true,
            receivingDeptRef: true,
            department: true,
          },
        },
      },
    })

    const transformedDocuments = documents.map((doc) => {
      const lastTracking = doc.trackingHistory[doc.trackingHistory.length - 1]
      const isSend = lastTracking && lastTracking.receivingDept ? true : false

      const status = inferDocumentStatus(doc.trackingHistory, isSend)

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
          : doc.sectorShipping || "N/A",
        dateTimeSubmission: new Date(doc.createdAt).toLocaleString(),
        ReceivingSector: lastTracking
          ? lastTracking.receivingDeptRef?.description
          : "N/A",
        dateTimeReceived:
          lastTracking && lastTracking.receivingDept
            ? new Date(doc.updatedAt).toLocaleString()
            : "N/A",
        isSend,
        isReceived: doc.isReceived,
        status,
      }
    })

    res.status(200).json(transformedDocuments)
  } catch (error) {
    res.status(500).json({ error: "Error listing documents" })
  }
}

export const listAllDocumentsWithHistory = async (
  req: Request,
  res: Response
) => {
  try {
    const documents = await prisma.document.findMany({
      include: {
        trackingHistory: {
          include: {
            sendingDeptRef: true,
            receivingDeptRef: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    })

    const transformedDocuments = documents.map((doc) => {
      const history = doc.trackingHistory.map((entry) => ({
        id: entry.documentId,
        action: entry.receivingDept
          ? `Recebido pelo Setor ${entry.receivingDeptRef?.description}`
          : `Enviado para o Setor ${entry.sendingDeptRef?.description}`,
        date: entry.createdAt.toISOString(),
        sendingDepartment: entry.sendingDeptRef?.description,
        receivingDepartment: entry.receivingDeptRef?.description,
      }))

      return {
        id: doc.id,
        type: doc.type,
        title: doc.title,
        description: doc.description,
        file: doc.file,
        createdAt: doc.createdAt,
        isReceived: doc.isReceived,
        status: inferDocumentStatus(doc.trackingHistory, doc.isReceived),
        history,
      }
    })

    res.status(200).json(transformedDocuments)
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar documentos com histórico" })
  }
}

export const sendDocument = async (req: Request, res: Response) => {
  const { documentId, receivingDepartmentId } = req.body

  if (!documentId) {
    return res.status(400).json({ error: "Document ID is required." })
  }
  const document = await prisma.document.findUnique({
    where: { id: Number(documentId) },
    include: { trackingHistory: true },
  })

  if (!receivingDepartmentId) {
    return res
      .status(400)
      .json({ error: "Receiving department ID is required." })
  }

  if (!document) {
    return res.status(404).json({ message: "Document not found" })
  }

  const departmentId = Number(receivingDepartmentId)
  if (isNaN(departmentId)) {
    return res.status(400).json({ error: "Invalid receiving department ID." })
  }

  const sendingDepartmentId = document.departmentId
  if (sendingDepartmentId === receivingDepartmentId) {
    return res.status(400).json({
      message: "O setor de envio deve ser diferente do setor de recebimento",
    })
  }

  const department = await prisma.department.findUnique({
    where: { id: departmentId },
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

  res.status(200).json(historyEntry)
}

export const receiveDocument = async (req: Request, res: Response) => {
  const { documentId } = req.body

  const document = await prisma.document.findUnique({
    where: { id: Number(documentId) },
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

  await prisma.document.update({
    where: { id: Number(documentId) },
    data: {
      isReceived: true,
      dateTimeReceived: new Date().toISOString(),
    },
  })

  res.status(200).json({
    message: "Documento recebido com sucesso",
    historyEntry: lastHistoryEntry,
  })
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

const inferDocumentStatus = (trackingHistory: any[], isReceived: boolean) => {
  if (trackingHistory.length === 0) {
    return "Novo"
  }

  const lastEntry = trackingHistory[trackingHistory.length - 1]

  if (isReceived) {
    return "Recebido"
  } else if (lastEntry.receivingDept) {
    return "Enviado"
  } else {
    return "Novo"
  }
}

export const getDocumentHistory = async (req: Request, res: Response) => {
  const { documentId } = req.params
  try {
    const document = await prisma.document.findUnique({
      where: { id: Number(documentId) },
      include: {
        trackingHistory: {
          include: {
            sendingDeptRef: true,
            receivingDeptRef: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    })

    if (!document) {
      return res.status(404).json({ message: "Documento não encontrado" })
    }
    const history = document.trackingHistory.map((entry) => {
      return {
        id: entry.id,
        action: entry.receivingDept
          ? `Recebido pelo Setor ${entry.receivingDeptRef?.description}`
          : `Enviado para o Setor ${entry.sendingDeptRef?.description}`,
        date: entry.createdAt.toISOString(),
        sendingDepartment: entry.sendingDeptRef?.description,
        receivingDepartment: entry.receivingDeptRef?.description,
      }
    })
    const fullHistory = [
      {
        id: 0,
        action: "Documento criado com status 'Novo'",
        date: document.createdAt.toISOString(),
        sendingDepartment: null,
        receivingDepartment: null,
      },
      ...history,
    ]

    const status = inferDocumentStatus(
      document.trackingHistory,
      document.isReceived
    )

    res.status(200).json({
      status,
      history: fullHistory,
    })
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar histórico do documento" })
  }
}
