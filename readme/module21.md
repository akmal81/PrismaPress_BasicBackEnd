
<!-- Video 1 -->
# Alternative way of creating user and profile In a create query 

/user
|--user.service.ts

```ts
const registerUserIntoDb = async (payload:RegisterUserPayload) => {

............
.......
    const createdUser = await prisma.user.create(
        {
            data: {
                name,
                email,
                password: hashedPassword,
                profile:{
                    create:{
                        profilePhoto
                    }
                }

            }
        }
    );
/*  */
    // await prisma.profile.create(
    //     {
    //         data: {
    //             userId: createdUser.id,
    //             profilePhoto
    //         }
    //     }
    // )

.................
.....
```
🛠️ ⚖️ 🤝 📄 📚

## 🚀 CatchAsync 
-- For DRY code we need to use CatchAsync function


/utils
    |--catchAsync.ts

    ```ts
    import { NextFunction, Request, RequestHandler, Response } from "express"
import httpStatus from "http-status"

export const catchAsync = (fn: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next)
        } catch (error:any) {
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
}
```
### 🛠️ Use of catchAsync function
🛠️ ⚖️ 🤝 📄 📚
/modules
|--user.controller.ts
```ts
import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status"
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";


const registerUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await userService.registerUserIntoDb(req.body)
        res.status(httpStatus.CREATED).json(
            {
                success: true,
                statusCode: httpStatus.CREATED,
                message: "User Created Successfully",
                data: { result }
            }
        )
    }
)

export const userController = {
    registerUser
}
```

🛠️ ⚖️ 🤝 📄 📚
<!-- Video 2 -->

### 🛠️ Send Respons Function
/utils
    |--catchAsync.ts
    |--sendResponse.ts
🛠️ ⚖️ 🤝 📄 📚

```ts
import { Response } from "express";

type TMeta={
page:number;
limit:number;
total:number;
}

type TResponseData<T>={
    success:boolean;
    statusCode:number;
    message:string;
    data:T;
    meta?:TMeta
}

export const sendResponse = <T>(res:Response, data:TResponseData<T>) =>{
    res.status(data.statusCode).json(
        {
            success:data.success,
            statusCode: data.statusCode,
            message:data.message,
            data:data.data,
            meta:data.meta
        }
    )
}
```

### sendRespose function Calling From controller

/modules
|--user.controller.ts
```ts
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

           =>  insted of this call send Response function
         ) */

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User registered successfully",
            data: { user }
        })
    }
)

```

<!-- video 3 -->
🛠️ ⚖️ 🤝 📄 📚
### Basic login user

🛠️ app.ts 
```ts
app.use("/api/auth", authRoutes)
```
🛠️ auth.router.ts
```ts
import { Router } from "express";
import { authController } from "./auth.controller";

const router =Router();

router.post('/login', authController.loginUser)

export const authRoutes= router;
```

⚖️ auth.controller.ts
```ts
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import  httpStatus  from "http-status";

const loginUser = catchAsync(
    async (req:Request, res:Response, next:NextFunction) => {
        const payload = req.body;
        const loginResult = await authService.loginUser(payload);

        sendResponse(res,{
            success:true,
            statusCode:httpStatus.OK,
            message:"User logged in successfully!",
            data:loginResult
        })
    }
)

export const authController ={
    loginUser
}
```

 🤝 auth.service.ts

 ```ts
 import bcrypt from "bcryptjs"
import { prisma } from "../../lib/prisma"
import { IloginUser } from "./auth.interface"

const loginUser = async(payload: IloginUser) => {
    const {email, password} = payload
const user = await prisma.user.findUniqueOrThrow(
    {
        where:{email}
    }
)

const isPasswordMatched = await bcrypt.compare(password, user.password)

if (!isPasswordMatched) {
    throw new Error("Password is not matched")
}

return user
}


export const authService = {
    loginUser
}
 ```
 <!-- video 4 5 -->

 ### 📄  JWT Access token and Refresh Token
 
 
 📚Create a jwt.ts for jwt utils

 /utils
 |--jwt.ts

 ```ts
import { JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";

const createToken = (payload: JwtPayload, secret: string, expiresIn: SignOptions) => {
    const token = jwt.sign(
        payload,
        secret,
        { expiresIn } as SignOptions
    );
    return token
}

export const jwtUtils = {
    createToken
}
 ```

### change auth.service.ts loginuser function


```ts 
const loginUser = async (payload: IloginUser) => {
    const { email, password } = payload
    const user = await prisma.user.findUniqueOrThrow(
        {
            where: { email }
        }
    )

    const isPasswordMatched = await bcrypt.compare(password, user.password)

    if (!isPasswordMatched) {
        throw new Error("Password is not matched")
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }


    /* const accessToken = jwt.sign(
        jwtPayload,
        config.jwt_access_secret,
        {expiresIn: config.jwt_access_expires_in} as SignOptions
    ) ; */

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    )

    
 /*    const refreshToken = jwt.sign(
        jwtPayload,
        config.jwt_refresh_secret,
        { expiresIn: config.jwt_refresh_expires_in } as SignOptions
    ); */

const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
     config.jwt_refresh_expires_in as SignOptions
)


```

### setting Access token and refresh token in cookies

auth.controller 

```ts
const loginUser = catchAsync(
    async (req:Request, res:Response, next:NextFunction) => {
        const payload = req.body;
        const loginResult = await authService.loginUser(payload);

        const {accessToken, refreshToken}=loginResult

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure:true,
            sameSite:"none",
            maxAge: 1000 * 60 *60 * 24     //24 hour or 1 day
        })
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure:true,
            sameSite:"none",
            maxAge: 1000 * 60 *60 * 24 * 7  //7 day
        })

        sendResponse(res,{
            success:true,
            statusCode:httpStatus.OK,
            message:"User logged in successfully!",
            data:loginResult
        })
    }
)
```

<!-- video 6 -->
### 🛠️ Me Routes with token verification

### ⚖️ create varifytoken utils

JwtUsils/ 

|--jwt.ts
```ts

const verifiedToken = (token : string, secret:string)=>{
    try {
        const verifiedToken = jwt.verify(token, secret)
        return {
            success:true,
            data:verifiedToken
        };
    } catch (error:any) {
        console.log("Token verification failed", error);
       return {
        success:false,
        error:error.message
       }
        
    }
}
```

### ⚖️  verify token in the user controller

modules/
|--users

 |--user.routes.ts
 |--user.controller.ts
 |--user.service.ts


### ⚖️ create getMyProfile route in userRoutes  user.routes.ts =>
```ts
router.get('/me', userController.getMyProfile)
```



### ⚖️ cteate getMyprofile function in user.controller.ts =>

### ⚖️ use verifyToken utility function in the controller 

```ts
const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies

    const verifiedToken = jwtUtils.verifiedToken(accessToken, config.jwt_access_secret);

    if (typeof verifiedToken === "string") {
        throw new Error(verifiedToken);

    }
    const profile = await userService.getMyProfileFromDb(verifiedToken.id)


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registered successfully",
        data: { profile }
    })
})
```

### ⚖️ create geyMyProfileFromDb user.service.ts

 ###  📚 
 ```ts
 const getMyProfileFromDb = async(userId:string)=>{
const user = await prisma.user.findUniqueOrThrow({
    where:{
        id:userId
    },
    omit:{
        password:true
    },
    include:{
        profile:true
    }

})

return user;

}
 ```


⚖️ 🤝 📄 📚


<!-- video 7, 8 -->

### ⚖️ Auth Middleware for role based Access control

middlewares/
|--auth.ts

```ts
import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

declare global {
    namespace Express{
        interface Request{
            user?:{
                email:string,
                name:string,
                id:string,
                role:Role
            }
        }
    }
}



export const auth = (...requiredRoles:Role[])=>{
    return catchAsync(async (req:Request, res:Response, next:NextFunction) => {



        const token = req.cookies.accessToken ?  
        req.cookies.accessToken 
        :
        req.headers.authorization?.startsWith("Bearer ")
        ?
        req.headers.authorization?.split(" ")[1]
        :
        req.headers.authorization;


        if (!token) {
            throw new Error("You are not logged in. please log in to access this resource.");
            
        }

        const verifiedToken = jwtUtils.verifiedToken(token, config.jwt_access_secret);

        if (!verifiedToken.success) {
            throw new Error(verifiedToken.error);  
        }

        const {email, name, id, role} = verifiedToken.data as JwtPayload;

        if(requiredRoles.length && !requiredRoles.includes(role)){
            throw new Error("Forbidden. You don't have permission to access this resource.");
            
        }

        const user = await prisma.user.findUnique({
            where:{
                id,
                email,
                name,
                role
            }
        })

        if(!user){
            throw new Error("User not found. Please log in again");
            
        }

        if(user.activeStatus === 'BLOCK'){
            throw new Error("Your account has been blocked. please contact support.");
            
        }

        req.user ={
            email,
            name,
            id,
            role
        }
        
        next()

    })
}
```

user of auth middleware
```ts
router.get('/me',
    auth(Role.USER),
    userController.getMyProfile)
```

<!-- video 9 -->

### creating updateMyProfile API

user.route.ts

```ts
router.put('/my-profile', auth(Role.ADMIN, Role.AUTHOR, Role.USER), userController.updatedMyProfile)

```

user.controller.ts
```ts
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
```

user.service.ts
```ts
const updateMyProfileInDb = async (userId:string, payload: any) => {

    const {name, email, profilePhoto, bio} = payload;

    const updatedUser = await prisma.user.update({
        where:{
            id:userId
        },
        data:{
            name, 
            email,
            profile:{
                update:{
                    profilePhoto,
                    bio
                }
            }
        },
        omit:{
            password:true
        },
        include:{
            profile:true
        }
    })
    return updatedUser;
}
```



