import express from "express"
import departmentRoutes from "./departamentRoutes"
import documentRoutes from "./documentRoutes"

const router = express.Router()

router.use("/departments", departmentRoutes)
router.use("/documents", documentRoutes)

export default router
