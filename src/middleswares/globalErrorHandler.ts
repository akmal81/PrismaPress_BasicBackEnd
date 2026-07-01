import httpStatus from "http-status"
import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";
export const globalErrorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {

    console.log("Error : ", err);


    let statusCode;
    let errorMessage = err.message || "Internal Server Error";
    let errorName = err.name || "Internal Server Error";
    // let errorDetails = err.stack

    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = httpStatus.BAD_REQUEST,
            errorMessage = "You have provided incorrect field type or missing fields"

    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            statusCode = httpStatus.BAD_REQUEST,
                errorMessage = "Duplicate Key Error"
        }
        else if (err.code === "P2003") {
            statusCode = httpStatus.BAD_REQUEST,
                errorMessage = "Foreign key constraint failed"
        }
        else if (err.code === "P2025") {
            statusCode = httpStatus.BAD_REQUEST,
                errorMessage = "An operation failed because it depends on one or more records that were required but not found"
        }
    } else if (err instanceof Prisma.PrismaClientInitializationError) {
        if(err.errorCode === "P1000"){
             statusCode = httpStatus.BAD_REQUEST,
                errorMessage = "Authentication Failed against Database Server"
        }
        else if (err.errorCode === "P1001") {
             statusCode = httpStatus.BAD_REQUEST,
                errorMessage = "Cannot reach database server"
        }
    }else if(err instanceof Prisma.PrismaClientUnknownRequestError){
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = "Error Occured During query execution!"
    }

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
        {
            success: false,
            statuCode: httpStatus.INTERNAL_SERVER_ERROR,
            name: err.name,
            message: errorMessage,
            error: err,

        }
    )
}