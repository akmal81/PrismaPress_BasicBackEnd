import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { userService } from "../user/user.service";

const loginUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const payload = req.body;
        const loginResult = await authService.loginUser(payload);

        const { accessToken, refreshToken } = loginResult

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24     //24 hour or 1 day
        })
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24 * 7  //7 day
        })

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User logged in successfully!",
            data: loginResult
        })
    }
)

const refreshToken = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const refreshToken = req.cookies.refreshToken

        const { accessToken } = await authService.refreshToken(refreshToken)

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24     //24 hour or 1 day
        })
        
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User logged in successfully!",
            data: { accessToken }
        })

    }
)


export const authController = {
    loginUser,
    refreshToken

}