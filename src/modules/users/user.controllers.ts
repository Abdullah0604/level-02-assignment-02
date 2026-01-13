import { Request, Response } from "express";
import { userServices } from "./user.services";
import sendSuccess from "../../helpers/sendSuccess";
import sendError from "../../helpers/sendError";

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUsersDB();

    // console.log("all users ", result);
    if (!result.rows.length) {
      return sendSuccess(res, 200, "No users found", []);
    }
    return sendSuccess(res, 200, "Users retrieved successfully", result.rows);
  } catch (error: any) {
    sendError(res, 500, "Failed to retrieve users!", error.message);
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { role } = req.body;
  const roles = ["admin", "customer"];

  try {
    if (role && !roles.includes(role)) {
      return sendError(
        res,
        400,
        "Failed to update user",
        "Role must be either admin or customer"
      );
    }
    const result: any = await userServices.updateUserDB({
      ...req.body,
      userId: req.params.userId,
      user: {
        role: req.user!.role,
        id: req.user!.id,
      },
    });

    console.log("updated user: ", result);
    return sendSuccess(res, 200, "User updated successfully", result.rows[0]);
  } catch (error: any) {
    sendError(
      res,
      error.status || 500,
      "Failed to update user!",
      error.message || "Internal server error"
    );
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.deleteUserDB(req.params.userId!);

    // console.log("deleted user: ", result);

    return res.status(200).json({
      success: true,
      message: "user deleted successfully",
    });
  } catch (error: any) {
    console.log(error);
    sendError(
      res,
      error.status || 500,
      "Failed to delete user!",
      error.message || "Internal server error"
    );
  }
};

export const userControllers = {
  getUsers,
  updateUser,
  deleteUser,
};
