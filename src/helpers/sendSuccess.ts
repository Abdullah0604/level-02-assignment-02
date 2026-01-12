import { Response } from "express";

const sendSuccess = (
  res: Response,
  statusCode: number,
  message: string,
  data: unknown
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data: data,
  });
};

export default sendSuccess;
