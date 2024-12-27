"use client";

import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import * as React from "react";
import { emailSchema, passwordSchema } from "../../validator";
import { useState, useEffect } from "react";

export const formSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export function LoginForm() {
  const { toast } = useToast();

  const [formData, setFormData] = useState(() => {
    const storedData = localStorage.getItem("login_form_data");
    return storedData ? JSON.parse(storedData) : { email: "" };
  });

  useEffect(() => {
    localStorage.setItem("login_form_data", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e: {
    target: {
      name: any;
      value: any;
    };
  }) => {
    const { name, value } = e.target;
    setFormData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Assuming an async login function
      console.log(values);
      localStorage.removeItem("login_form_data");
      toast({
        title: "Toast window",
        description: "Check se utile",
      });
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  }
  return (
    <>
      <div className="flex flex-col min-h-[50vh] h-full w-full items-center justify-center px-4 ">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email and password to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel htmlFor="email">Email*</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            placeholder="mario.rossi@mail.com"
                            type="email"
                            autoComplete="email"
                            value={formData.email}
                            name="email"
                            onChange={handleChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <div className="flex justify-between items-center">
                          <FormLabel htmlFor="password">Password*</FormLabel>
                          <Link
                            href="./forgot-password"
                            className="ml-auto inline-block text-sm underline"
                          >
                            Forgot your password?
                          </Link>
                        </div>
                        <FormControl>
                          <Input
                            id="password"
                            type="password"
                            placeholder="******"
                            autoComplete="current-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </div>
              </form>
            </Form>
            {
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="./signup" className="underline">
                  Sign up
                </Link>
              </div>
            }
          </CardContent>
        </Card>
      </div>
    </>
  );
}
