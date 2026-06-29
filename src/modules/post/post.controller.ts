import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status'
import { userService } from "../user/user.service";



const createPost = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const id = req.user?.id
        const payload = req.body;
        const result = await postService.createPostIntoDb(payload, id as string)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Post Created Successfully!!",
            data: result
        })
    }
)




const getAllPost = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await postService.getAllPostFromDb()

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Post Retrive Successfully!!",
            data: result
        })
    }
)

// todo
const getPostStats = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await postService.getPostStatsFromDb();
         sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Stats Retrive Successfully!!",
            data: result
        })
    }
)


const getPostById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const postId = req.params.postId;

        if (!postId) {
            throw new Error("Post id is required!!")
        }

        const result = await postService.getPostByIdFromDb(postId as string)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Post Retrive Successfully!!",
            data: result
        })
    }
)


const getMyPosts = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const authorId = req.user?.id as string;
        const result = await postService.getMyPostsFromDb(authorId);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Posts Retrive Successfully!!",
            data: result
        })
    }
)





const updatePost = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const authorId = req.user?.id as string;
        const isAdmin = req.user?.role === "ADMIN";
        const postId = req.params.postId as string;
        const payload = req.body;

        const result = await postService.updatePostIntoDb(postId, payload, authorId, isAdmin)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Posts updated Successfully!!",
            data: result
        })
    }
)


const deletePost = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
 const authorId = req.user?.id as string;
        const isAdmin = req.user?.role === "ADMIN";
        const postId = req.params.postId as string;
        if(!postId){
            throw new Error("Please provide postId");
            
        }

        const result = await postService.deletePostFromdb(postId, authorId, isAdmin)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Posts Deleted Successfully!!",
            data: result
        })
    }
)


export const postController = {
    createPost,
    getAllPost,
    getPostStats,
    getMyPosts,
    getPostById,
    updatePost,
    deletePost
}