import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
const auth = (...roles: ("admin" | "customer")[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authToken = req.headers.authorization;
      if (!authToken) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
          errors: "You are not allowed!!",
        });
      }

      if (!authToken.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
          errors: "You are not allowed!!",
        });
      }

      const token = authToken.split(" ")[1];
      console.log(token);

      const decoded = jwt.verify(
        token as string,
        config.jwt_secret as string
      ) as JwtPayload;

      console.log("decoded", decoded);

      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden!",
          errors: "Sorry you are forbidden for this access",
        });
      }
      next();
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Authentication Failed!",
        errors: "Something went wrong",
      });
    }
  };
};

export default auth;
