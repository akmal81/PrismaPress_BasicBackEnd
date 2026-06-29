import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status"
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";




const registerUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = await userService.registerUserIntoDb(req.body)
        /*  res.status(httpStatus.CREATED).json(
             {
                 success: true,
                 statusCode: httpStatus.CREATED,
                 message: "User Created Successfully",
                 data: { result }
             }
         ) */

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User registered successfully",
            data: { user }
        })
    }
)

const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  
    const profile = await userService.getMyProfileFromDb(req.user?.id as string)


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registered successfully",
        data: { profile }
    })
})

const updatedMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{
    const userId = req.user?.id as string;
    const payload = req.body;
    const updateProfile = await userService.updateMyProfileInDb(userId, payload)
    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"user profile updated successfully",
        data:{updateProfile}
    })
})
export const userController = {
    registerUser,
    getMyProfile,
    updatedMyProfile
}