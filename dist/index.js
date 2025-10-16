import express from "express";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
const app = express();
app.use(express.json());
const client = new PrismaClient();
const signupSchema = z.object({
    username: z.string(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string(),
});
const createtodoSchema = z.object({
    title: z.string(),
    description: z.string(),
    userId: z.number(),
});
const getTodoUserSchema = z.object({
    userId: z.number(),
});
const getTodoSchema = z.object({
    id: z.number(),
});
app.post("/signup", async (req, res) => {
    console.log("body", req.body);
    const { success, data, error } = signupSchema.safeParse(req.body);
    if (!success) {
        console.error(error);
        return res.status(411).json({ msg: "send proper data" });
    }
    const { username, password, firstName, lastName } = data;
    try {
        await client.user.create({
            data: {
                username,
                password,
                firstName,
                lastName,
            },
        });
    }
    catch (err) {
        console.error("error while sending to db");
        return res.status(500).json({ msg: "databse error" });
    }
    res.status(200).json({
        msg: "sucessfully created account",
    });
});
app.post("/todos", async (req, res) => {
    console.log(req.body);
    const { success, data, error } = createtodoSchema.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            msg: "send proper data",
        });
    }
    const { title, description, userId } = data;
    try {
        await client.todo.create({
            data: {
                title,
                description,
                userId,
            },
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            msg: "Error in database",
        });
    }
    return res.status(200).json({
        msg: "Todo addedd successfully",
    });
});
app.get("/todos", async (req, res) => {
    const { success, data, error } = getTodoUserSchema.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            msg: "send proper data",
        });
    }
    const { userId } = data;
    const todos = await client.todo.findMany({
        where: {
            userId,
        },
    });
    console.log(todos);
    return res.status(200).json({
        todos,
    });
});
app.get("/todo/:id", async (req, res) => {
    console.log(req.params.id);
    const id = parseInt(req.params.id);
    try {
        const todo = await client.todo.findUnique({
            where: { id },
        });
        res.status(200).json({
            todo,
        });
    }
    catch (err) {
        console.error("error in db", err);
        res.status(500).json({
            msg: "Internal server error",
        });
    }
});
app.listen(3000, () => {
    console.log("server running in port 3000");
});
