import { Request, Response } from "express";
import { userServices } from "./user.services";

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUsersDB();

    console.log("all users ", result);
    if (result.rows.length) {
      res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: result.rows,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "No users found",
        data: [],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users!",
      errors: error.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  if (Number.isNaN(userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      errors: "User ID must be a number",
    });
  }
  try {
    const result = await userServices.updateUserDB({
      ...req.body,
      userId: req.params.userId,
    });

    console.log("updated user: ", result);
    if (result.rows.length) {
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to update user!",
      errors: error.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  if (Number.isNaN(userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      errors: "Vehicle ID must be a number",
    });
  }
  try {
    const result = await userServices.deleteUserDB(req.params.userId!);

    console.log("deleted user: ", result);
    if (!result.rowCount) {
      return res.status(404).json({
        success: false,
        message: "user is not exist",
        errors: "No user exists with this id",
      });
    }
    return res.status(200).json({
      success: true,
      message: "user deleted successfully",
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user!",
      errors: error.message,
    });
  }
};

export const userControllers = {
  getUsers,
  updateUser,
  deleteUser,
};
