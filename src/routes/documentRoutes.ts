import express from "express"
import {
  createDocument,
  listDocuments,
} from "../controllers/documentController"
import { upload } from "../middleware/upload"

const router = express.Router()

router.post("/", upload.single("pdfFile"), createDocument)

router.get("/", listDocuments)

export default router
