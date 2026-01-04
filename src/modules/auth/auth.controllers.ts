import { Request, Response } from "express";
import { userDataValidation } from "../../helpers/userDataValidation";
import { authServices } from "./auth.services";

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

    console.log("create user:  ", result);
    if (result.rows[0]) {
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to register user!",
      errors:
        error.code == "23505"
          ? "email must be unique. Please provide a unique email."
          : error.message,
    });
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
    console.log(error);
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
