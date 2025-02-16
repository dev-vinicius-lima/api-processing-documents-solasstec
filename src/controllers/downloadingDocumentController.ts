import { Request, Response } from "express"
import path from "path"
import fs from "fs"

export const downloadDocument = async (req: Request, res: Response) => {
  const { fileName } = req.params
  const filePath = path.join(__dirname, "../../uploads", fileName)

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Arquivo não encontrado" })
  }

  res.download(filePath, fileName, (err) => {
    if (err) {
      res.status(500).json({ error: "Erro ao baixar o arquivo" })
    }
  })
}
