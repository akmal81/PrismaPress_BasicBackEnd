import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors"
import config from "./config";
import httpStatus from "http-status";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { userRoutes } from "./modules/user/user.route";
import { authRoutes } from "./modules/auth/auth.route";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(cors(
    {
        origin: config.app_url,
        credentials: true
    }
))



app.get("/", (req: Request, res: Response) => {
    res.send("Prisma Press")
})


app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)

export default app;