<!-- video 1 -->

### 🚀 Refresh Token 
#### When access token is expires a Refrsh token helps to create to new access token
 
🚀 Create route for refresh token

    ```
    modules/
    |--auth
     |--auth.route.ts
     |--auth.controller.ts
     |--auth.service.ts
    ```

🚀 auth.route.ts
 ```ts
router.post('/refresh-token', authContorller.refreshToken)
 ```
🚀 auth.controller.ts
1. get the refreshtoken from req.cookies
2. send it to auth.service.ts authService.refreshToken
3. get the return accessToken
3. set accessToken to req.cookies
4. send response
 ```ts
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
 ```
 🚀 auth.service.ts
1. get the refreshtoken as a parameter from authController.refresh
2. verify token using jwtUtils.verifyToken()
3. Check the success verity token or throw error
3. destructure id from refreshtoken
4. get user from database using prisma.user.findUniqueOrThrowError
5. Check the user activeStatus block if block throw error
6. create a new jwtPayload
7. craate a new accesToken using jwtUtils.crateToken()
8. Returen {accessToken}

```ts
const refreshToken = async(refreshToken:string)=>{
    const verifiedRefreshToken = jwtUtils.verifiedToken(refreshToken, config.jwt_refresh_secret);

    if(!verifiedRefreshToken.success){
        throw new Error(verifiedRefreshToken.error)
    }

    const {id}= verifiedRefreshToken.data as JwtPayload
    
    
    const user = await prisma.user.findUniqueOrThrow({
        where:{
            id
        }
    })

    if(user.activeStatus==="BLOCK"){
        throw new Error("User is blocked!");
        
    }

    const jwtPayload = {
        id,
        name:user.name,
        email:user.email,
        role:user.role
    }

    const accessToken = jwtUtils.createToken(
        jwtPayload, config.jwt_access_secret, config.jwt_access_expires_in as SignOptions
    )

    return {accessToken}
}

```


<!-- video 2 -->

### 🚀 Create Post and Comment Models

🚀post.schema
```prisma
model Post {
    id         String     @id @default(uuid())
    title      String     @db.VarChar(255)
    content    String     @db.Text
    thumbnail  String?
    isFeatured Boolean    @default(false)
    status     PostStatus @default(PUBLISHED)
    tags       String[]
    views      Int        @default(0)

    authorId String
    user     User   @relation(fields: [authorId], references: [id], onDelete: Cascade)

    comments Comment[]

    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt

    @@index([authorId])
    @@map("posts")
}
```
commnet.prisma

```prisma
model Comment {
    id      String @id @default(uuid())
    content String @db.Text

    authorId String
    user     User   @relation(fields: [authorId], references: [id], onDelete: Cascade)

    postId String
    post   Post   @relation(fields: [postId], references: [id], onDelete: Cascade)

    status CommentStatus @default(APPROVED)

    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt

    @@index([postId])
    @@index([authorId])
    @@map("comments")
}

```
<!-- video 3 -->
### 🚀 crate a new post 
cratea module Post
/post
|--post.routes.ts
|--post.controller.ts
|--post.service.ts
|--post.interface.ts


#### 🚀 Create interface of createPostPayload post.interface.ts

```ts

```
### 🚀 Create post Service in post.service.ts 


### 🚀 Post.controller


### 🚀  post.routes

### 🚀 Get All post Service in post.service.ts 

<!-- video 4  -->

### 🚀 Get post by postId post Service 

### 🚀 Get post by userId (getMyPost) post Service 
get the authorID as userId from req.user.

<!-- video 5 -->

### 🚀 update post 
1. is the post author is authenticated
2. is the updated post woner is the user, user cannot update others post
3. is the updater is Admin

### 🚀 delete post 
1. is the post author is authenticated
2. is the updated post woner is the user, user cannot delete others post
3. is the updater is Admin

<!-- todo -->
stat

<!-- video 6 -->

### 🚀 Understanding The Scenario For Transaction And Rollback

<!--video 7 -->
### Explain  Transaction And Rollback in details

ACID
Atomic - All steps happen or none od
Consistent - tMoney is never created or los
Isolated - Transactions don't interfere with each other
Durable - Once Saved, its saved of good

<!-- video 8 -->

### implement transaction and rollback

<!-- video 9 Stats -->

<!-- video 10 promis.all -->






