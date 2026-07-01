# 🚀 Search Filter Pagination Sorting Error Handling🚀

<!-- video 1 -->
## 🚀  comment module 

<!-- video 2 -->

## 🚀  Understanding How Search And Filtering Works And Implementing Filtering With Prisma

 -- Database try to find data - 2 types
    1. Partial Match (Serching)
    2. Exact Match (Filtering)

## 🚀 Filtering
## 🚀 And[] operator
## 🚀 has operator

<!-- video 3  -->
## 🚀 searching filtering

## contains 
## mode
## OR[]


<!-- video 4 -->

## 🚀 Understanding How Pagination And Sorting Works And Implementing With Prisma

<!-- video 5 -->
## 🚀 How To Make Dynamic Search, Filtering, Pagination, Sorting With API Request Query



  take = 
  skip = (page-1)*limit/take
  orderBy : {fieldName: asc/desc}

create a query interface

```ts
interface IPostQuery extends PostWhereInput{

}


const getAllPostFromDb = async (query: IPostQuery) => {

    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page-1)*limit;
    const sortBy  = query.sortBy ? query.sortBy : "createdAt";
    const sortOrder  = query.sortOrder ? query.sortOrder : "desc"

    const allPost = await prisma.post.findMany(
        {
            where: {
                AND: [
                    // query.searchTerm ? {} :{},
                    query.searchTerm ? {
                        OR: [
                            {
                                title: {
                                    contains: query.searchTerm,
                                    mode: "insensitive"
                                },
                            },
                            {
                                content: {
                                    contains: query.searchTerm,
                                    mode: "insensitive"
                                }
                            }
                        ]
                    } : {},

                    // title filtering
                    query.title ? { title: query.title } : {},
                    // title:" "
                    // content filtering
                    query.content ? { content: query.content } : {}
                ]
            },

            // paginition 

            take:limit,
            skip:skip,

            orderBy:{
                // sortBy : sortOrder
                // column : "asc/desc"
                [sortBy] : sortOrder
            },


            include: {
                author: {
                    omit: {
                        password: true
                    }
                },
                comments: true
            }
        }
    );
    return allPost
}

```


<!-- video 6 -->


## 🚀 Optimizing The Search, Filtering, Pagination, Sorting Logics

```ts

export interface IPostQuery extends PostWhereInput{
    // title?:string;
    // content?:string;

    searchTerm?:string;
    page?:string;
    limit?:string;
    sortBy?:string;
    sortOrder?:string
}
const getAllPostFromDb = async (query: IPostQuery) => {

    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page-1)*limit;
    const sortBy  = query.sortBy ? query.sortBy : "createdAt";
    const sortOrder  = query.sortOrder ? query.sortOrder : "desc";

    const tags = query.tags ? JSON.parse(query.tags as string) : null;
    const tagsArray = Array.isArray(tags)? tags:[]


    const andConditions : PostWhereInput[] = []

// partial query
    if(query.searchTerm){
        andConditions.push({
            OR:[
                {
                    title:{
                        contains:query.searchTerm,
                        mode:"insensitive"
                    }
                },
                {
                    content :{
                        contains:query.searchTerm,
                        mode:"insensitive"
                    }
                }
            ]
        })
    };

// exact query
    if(query.title){
        andConditions.push({
            title:query.title
        })
    }

    if(query.content){
        andConditions.push({
            title:query.content
        })
    }

    if(query.authorId){
        andConditions.push({
            authorId : query.authorId
        })
    }

    if(query.isFeatured) { 
        andConditions.push({
            isFeatured: Boolean(query.isFeatured)
        })
    }

    if(query.tags){
        andConditions.push({
            tags:{
                hasSome:tagsArray
            }
        })
    }

    if(query.status){
        andConditions.push({
            status:query.status
        })
    }

    // andConditions.push({
    //     isPremium : false
    // })



    const allPost = await prisma.post.findMany(
        {
            where: {
               
                AND:andConditions
            },

            // paginition 

            take:limit,
            skip:skip,

            orderBy:{
                // sortBy : sortOrder
                // column : "asc/desc"
                [sortBy] : sortOrder
            },


            include: {
                author: {
                    omit: {
                        password: true
                    }
                },
                comments: true
            }
        }
    );
    return allPost
}

```

<!-- Video 7 -->
## 🚀  Implementing Not Found Route And Global Error 


middleware\
|--notFound.ts

--create not fount middelware for route that not exists

```ts
export const notFound = (req:Request, res:Response)=>{
    res.status(404).json(
        {
            message:"Route Not Found!!",
            path:req.originalUrl,
            date:Date()
        }
    )
}
```

-- call notfound function in bellow of app.ts
```ts
app.use(notFound)
```

### Global Error Handler
-- when we use error parameter with req, and res, next express count this a error handler function
```ts
app.use((err:any,req:Request,res:Response, next:NextFunction)=>{})
```
*** err is mendatory to use as first parameter

```ts
export const globalErrorHandler = async (err:any,req:Request,res:Response, next:NextFunction)=>{
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
        {
            success: false,
            statuCode: httpStatus.INTERNAL_SERVER_ERROR,
            message:err.message,
            error: err.stack,
            
        }
    )
}
```


## 🚀 Handling Prisma Errors With Global Error Handler

```ts
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
```
