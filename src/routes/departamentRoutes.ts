import { Router } from "express"
import {
  createDepartment,
  listDepartments,
} from "../controllers/DepartamentController"

const router = Router()

router.post("/", createDepartment)
router.get("/", listDepartments)

export default router
