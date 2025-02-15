import { Router } from "express"
import {
  createDepartment,
  deleteDepartment,
  editDepartment,
  listDepartments,
} from "../controllers/DepartamentController"

const router = Router()

router.post("/", createDepartment)
router.get("/", listDepartments)
router.delete("/:id", async (req, res) => {
  await deleteDepartment(req, res)
})
router.put("/:id", async (req, res) => {
  await editDepartment(req, res)
})

export default router
