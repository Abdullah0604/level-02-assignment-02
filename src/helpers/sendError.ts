import { Response } from "express";

const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  errorDetails: string
) => {
  res.status(statusCode).json({
    success: false,
    message,
    errors: errorDetails,
  });
};

export default sendError;
