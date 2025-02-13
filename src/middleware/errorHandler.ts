import { Request, Response, NextFunction } from "express"

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err)
  res.status(500).json({ message: "Ocorreu um erro interno." })
}

export default errorHandler
