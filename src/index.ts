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

type Signup = z.infer<typeof signupSchema>;

app.post("/signup", async (req, res) => {
  console.log("body", req.body);

  const { success, data, error } = signupSchema.safeParse(req.body);

  console.log(data);

  if (!success) {
    console.log(error);

    res.status(411).json({ msg: "send proper data" });
  }
  if (!data) return;

  const { username, password, firstName, lastName } = data;

  async function addUser() {}
  try {
    await client.user.create({
      data: {
        username,
        password,
        firstName,
        lastName,
      },
    });
  } catch (err) {
    console.error("error while sending to db");
    res.status(500).json({ msg: "databse error" });
  }
  addUser();

  res.status(200).json({
    msg: "sucessfully created account",
  });
});

app.listen(3000, () => {
  console.log("server running in port 3000");
});
