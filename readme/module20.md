<!-- Module 20 -->
<!-- video 1 and 2 -->
# Road map A Project From Begining to Compelete

1. Requirement Analisys

2. Brain stroming

3. NoteDown Important Topic, Feature, Roles, API

4. Note Down The Flow of the project, Feature of the project, connect with user

5. ERD Design 

6. Project Setup, Required Tech Stack

7. Prisma Schema Models Define

8. Prisma Migration & Generate

9. Project Business Logics implementation

10. Check for update

<!-- video 3 -->
# ERD Design
https://drawsql.app/teams/team8819/diagrams/prismapress

<!-- video 4 -->

# Project Setup

### Initialize a TypeScript project:

```bash
npm init
npm install typescript tsx @types/node --save-dev
npx tsc --init
```


### Install Required Dependencies

```bash
npm install prisma @types/pg --save-dev
npm install @prisma/client @prisma/adapter-pg pg dotenv

```

### Update tsconfig.json for ESM compatibility

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2023",
    "types": ["node"],
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "noUncheckedIndexedAccess": true,
    "strict": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true
  },
  // "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```
### Initialize Prisma ORM

```bash
npx prisma 
```

### Setup Prisma ORM project 
```bash
npx prisma init --output ../generated/prisma
```

### Create Database 

1. create a database in prisma postgres or localhost or other service like neon db 
2. get connection string
3. replace the DATABASE_URL value

<!-- video 5 -->
### Install Other Tech Stack Packages

1. Express
```bash
npm install express
npm i @types/express --save-dev
```

2. Bcrypt js
```bash
npm i bcryptjs
```

3. Cors

```bash
npm i cors
npm i @types/cors --save-dev
```

4. Jsonwebtoken
```bash
npm i jsonwebtoken
npm i @types/jsonwebtoken --save-dev
```

5. CookieParser
```bash
npm i cookie-parser
npm i @types/cookie-parser --save-dev
```
6. Http-status 
```bash
npm i http-status
```

### Setup Server (minimum Server setup)

/src
|--app.ts
|--server.ts

1. app.ts

```ts
import express, { Application, Request, Response } from "express";

const app:Application = express();

app.get("/",(req:Request, res:Response)=>{
    res.send("Prisma Press")
})

export default app
```

2. server.ts

```ts
import app from "./app"

const PORT = process.env.PORT || 5000

async function main() {
    try {

        app.listen(PORT, ()=>{
            console.log(`Server is running on port  ${PORT}`);
        })
        
    } catch (error) {
        console.error("Error string the server: ", error);
        process.exit(1)
    }
}



main()
```

### Write script package.json
```json
 "scripts": {
    "dev":"tsx watch src/server.ts",
    "build":"tsc",
    "start": "node dist/server.js"
  },
```


### Configur Prisma Client
```bash
npx prisma migrate dev --name init
npx prisma generate
```

/src
|--lib
    |--prisma.ts

```ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
```


### Update Server.ts to connect with prisma

```ts
 try {
    // add this lines 

        await prisma.$connect()
        console.log("Connected to the database successfull.");
        ...
  
    } catch (error) {
        
        await prisma.$disconnect()
        ...
        
    }

```

<!-- video 6 -->
### Environment variable setup

```ts
import dotenv from "dotenv";
import path from "path";

dotenv.config(
    {
        path: path.join(process.cwd(), ".env")
    }
)

export default {
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    app_url: process.env.APP_URL,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,

}
```

### Updating app.ts

1. adding mandetory middlewate 
    a. express.json()
    b. express.urlencoded
    c. cookieParser
    d. cors

```ts

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
app.use(cors(
    {
        origin: config.app_url,
        credentials:true
    }
))

```


<!-- video 7 -->

### Multifile Prisma schema writting

prisma/
|--migrations
|--schema  ** (*this folder name canbe any thing*)
    |--user.prisma
    |--profile.prisma
    |--post.prisma
    |--comment.prisma
    |--schema.prisma *Keep the schema.prisma file in the schema folder (the schema folder canbe named anything)*
    |--enums.prisma

1. change the prisma.config.ts

```ts
 schema: "prisma/schema.prisma",
        /* wtite only the folder name who consist of all schema files insted of schema.prisma (the folder name must be matched with prisma/folderName)*/
 schema: "prisma/schema",

```

2. Write all prisma models and enums

    a. /user.prisma
    ```prisma
    model User {
    id           String       @id @default(ulid())
    name         String       @db.VarChar(255)
    email        String       @unique
    password     String       @db.VarChar(255)
    activeStatus ActiveStatus @default(ACTIVE)
    role         Role         @default(USER)
    createdAt    DateTime     @default(now())
    updatedAt    DateTime     @default(now())

    profile Profile?

    @@map("users")
}
    ```

    b. /profile.prisma

    ```prisma
    model Profile {
    id           String  @id @default(uuid())
    profilePhoto String?
    bio          String?

    userId String @unique
    user   User   @relation(fields: [userId], references: [id])

    createdAt DateTime @default(now())
    updatedAt DateTime @default(now())

    @@map("profiles")
    }
```

    c. /post.prisma

    ```prisma
    model Post {
    id         String   @id @default(uuid())
    title      String   @db.VarChar(255)
    content    String
    thumbnail  String?
    isFeatured Boolean  @default(false)
    tags       String[]
    views      Int
    authorId   String
    user       User     @relation(fields: [authorId], references: [id])
    createdAt  DateTime
    updatedAt  DateTime
}
    ```

    d. /comment.prisma

    ```prisma
    model Comments {
    id       String @id @default(uuid())
    content  String
    authorId String
    user     User   @relation(fields: [authorId], references: [id], onDelete: Cascade)

    postId String
    post   Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
}

    ```

<!-- 8  and 9  -->

src/
|--modules
    |--user
        |--user.route.ts
        |--user.controller.ts
        |--user.service.ts
        |--user.interface.ts


1. app.ts

add this line
```ts
app.use("/api/users", userRoutes)
```

3. user.route.ts
```ts
import { Router } from "express";
import { userController } from "./user.controller";


const router = Router();


router.post("/register", userController.registerUser)

export const userRoutes = router;
```

4. user.controller.ts

```ts
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

```

5. user.service.ts

```ts
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import config from "../../config";
import { RegisterUserPayload } from "./user.interface";



const registerUserIntoDb = async (payload:RegisterUserPayload) => {

 const { name, email, password, profilePhoto } = payload

     const isUserExist = await prisma.user.findUnique(
        {
            where: {
                email
            }
        }
    )

    if (isUserExist) {
        throw new Error("User with this email already exists");

    }

    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))

    const createdUser = await prisma.user.create(
        {
            data: {
                name,
                email,
                password: hashedPassword

            }
        }
    );

    await prisma.profile.create(
        {
            data: {
                userId: createdUser.id,
                profilePhoto
            }
        }
    )

    const user = await prisma.user.findUnique(
        {
            where:{
                id:createdUser.id,
                email:createdUser.email
            },
            omit:{
                password:true
            },
            include:{
                profile:true
            }
        }
    )

    return user;

}

export const userService = {
    registerUserIntoDb
}
```

6. user.interface.ts

```ts
export interface RegisterUserPayload{
    name: string;
    email:string;
    password:string;
    profilePhoto?: string
}

```




