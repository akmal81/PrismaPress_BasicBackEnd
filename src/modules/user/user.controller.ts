import { Request, Response } from "express";

import httpStatus from "http-status"
import { prisma } from "../../lib/prisma";
import { userService } from "./user.service";

const registerUser = async (req: Request, res: Response) => {

    try {

        const result = await userService.registerUserIntoDb(req.body)

        res.status(httpStatus.CREATED).json(
            {
                success: true,
                statusCode: httpStatus.CREATED,
                message: "User Created Successfully",
                data: { result }
            }
        )

    } catch (error: any) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
            {
                success: false,
                statuCode: httpStatus.INTERNAL_SERVER_ERROR,
                message: "Failed to register user",
                error: error.message
            }
        )
    }

}


export const userController = {
    registerUser
}