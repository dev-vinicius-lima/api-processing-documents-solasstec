import { Request, Response, NextFunction } from "express"

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).json({ message: "Ocorreu um erro interno." })
}

export default errorHandler
