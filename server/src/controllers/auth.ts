import  {  Request, Response } from "express";
import  { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import prisma from "../db";

export const signup = async (req: Request, res: Response) => {
    const {email, password, username} = req.body;

    let user = await prisma.user.findFirst({ where: { email } });

    if(user){
        throw Error('User already exists')
    }
    user = await prisma.user.create({
        data: {email, password: hashSync(password, 10), username}
    });
    res.json(user);
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    let user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
        throw new Error("User not found");
    }
    if (!compareSync(password, user.password)) {
        throw new Error("Invalid password");
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET)
    res.json({ user, token })
}
