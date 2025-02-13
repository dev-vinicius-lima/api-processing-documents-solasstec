import express from "express"
import {
  createDocument,
  listDocuments,
  getDocumentByNumber,
  sendDocument,
  receiveDocument,
  deleteDocument,
} from "../controllers/documentController"
import { upload } from "../middleware/upload"

const router = express.Router()

router.post("/", upload.single("pdfFile"), createDocument)

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
export default router
