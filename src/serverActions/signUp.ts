"use server";

import { userModel } from "@/db/models/user";
import { randomUUID } from "crypto";
import { z } from "zod";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { dbConfig } from "@/db/dbconfig";
import mongoose from "mongoose";
import { signupFormSchema } from "../validator";

const formSchema = signupFormSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  },
);

export async function signUp(formData: z.infer<typeof formSchema>) {
  //validate form data

  const validatedForm = formSchema.safeParse(formData);

  if (!validatedForm.success) {
    throw new Error("Something wrong with signUp request");
  }

  mongoose.connect(dbConfig.uri);

  //check if email is already in use
  if (
    await userModel
      .findOne({
        email: validatedForm.data.email,
      })
      .exec()
  ) {
    throw new Error("Email already in use");
  }

  await userModel.create({
    ...validatedForm.data,
    password: await bcrypt.hash(validatedForm.data.password, 10),
  });

  redirect("/login");
}
