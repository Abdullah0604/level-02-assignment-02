import { Request, Response } from "express";
import { userDataValidation } from "../../helpers/userDataValidation";
import { authServices } from "./auth.services";
import sendError from "../../helpers/sendError";
import sendSuccess from "../../helpers/sendSuccess";

const signupUser = async (req: Request, res: Response) => {
  const validatedMessage = userDataValidation(req.body);
  if (validatedMessage) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: validatedMessage,
    });
  }

  try {
    const result = await authServices.signupUserDB(req.body);

    // console.log("create user:  ", result);
    if (result.rows.length) {
      return sendSuccess(
        res,
        201,
        "User registered successfully",
        result.rows[0]
      );
    }
  } catch (error: any) {
    // console.log(error);
    if (error.code === "23505") {
      return sendError(
        res,
        400,
        "Duplicate value",
        "Duplicate email is not acceptable. Email must be unique. Please provide a unique email."
      );
    }

    return sendError(res, 500, "Internal server error", error.message);
  }
};

const signinUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.signinUserDB(req.body);

    console.log(result);
    if (!result) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        errors:
          result === null
            ? "Your email is invalid, Please provide the correct email."
            : "Your password is incorrect. Please provide your correct password",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token: result.token,
        user: result.user,
      },
    });
  } catch (error: any) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to Login",
      errors: error.message,
    });
  }
};

export const authControllers = {
  signinUser,
  signupUser,
};
