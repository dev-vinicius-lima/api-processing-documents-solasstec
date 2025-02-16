import multer from "multer"

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

export const upload = multer({
  storage,
  fileFilter(req, file, callback) {
    if (file.mimetype === "application/pdf") {
      callback(null, true)
    } else {
      callback(new Error("Arquivo PDF é obrigatório."))
    }
  },
})
