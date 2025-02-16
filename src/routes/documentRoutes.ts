import express from "express"
import {
  createDocument,
  listDocuments,
  getDocumentByNumber,
  sendDocument,
  receiveDocument,
  deleteDocument,
  getDocumentHistory,
  listAllDocumentsWithHistory,
} from "../controllers/documentController"
import { upload } from "../middleware/upload"
import { downloadDocument } from "../controllers/downloadingDocumentController"

const router = express.Router()

router.post("/", upload.single("pdfFile"), createDocument)

router.get("/history", async (req, res) => {
  await listAllDocumentsWithHistory(req, res)
})
router.get("/", listDocuments)
router.get("/:number", getDocumentByNumber)

router.post("/send", async (req, res) => {
  await sendDocument(req, res)
})
router.post("/receive", async (req, res) => {
  await receiveDocument(req, res)
})
router.delete("/:number", async (req, res) => {
  await deleteDocument(req, res)
})

router.get("/:documentId/history", async (req, res) => {
  await getDocumentHistory(req, res)
})

router.get("/download/:fileName", async (req, res) => {
  await downloadDocument(req, res)
})

export default router
