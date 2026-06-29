import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { userService } from "../user/user.service"
import { commentService } from "./comment.service"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status";

const createComments = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

        const authorId = req.user?.id as string

        const result = await commentService.createComments(authorId, req.body);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Comment Created successfully",
            data: result
        })
    }
)
const getCommentsByAuthor = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { authorId } = req.params
        const result = await commentService.getCommentsByAuthor(authorId as string);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Comment retrive successfully",
            data: result
        })
    }
);


const getCommentByPostId = catchAsync(
       async(req:Request, res:Response, next:NextFunction)=>{
        const {postId}= req.params;
        console.log(postId);
        const result = await commentService.getCommentByPostId(postId as string)
        sendResponse(res, {
            success:true,
            statusCode: httpStatus.OK,
            message: "Comment retrive successfully",
            data: result

        })
       }
    
)
const updateComment = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

        const authorId= req.user?.id 
        const {commentId} = req.params
        const result  = await commentService.updateComment(
            commentId as string, 
            req.body,
            authorId as string
        )

        sendResponse(res, {
            success:true,
            statusCode: httpStatus.OK,
            message: "Comment Update successfully",
            data: result

        })


     }
)
const deleteComment = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => { }
)
const moderateComment = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => { }
)


export const commentController = {
    createComments,
    getCommentsByAuthor,
    getCommentByPostId,
    updateComment,
    deleteComment,
    moderateComment
}