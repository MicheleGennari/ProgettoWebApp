"use client";

import * as React from "react";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ToastAction } from "@/components/ui/toast";
import { FaArrowRight, FaArrowLeft, FaCalendar } from "react-icons/fa6";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "../../serverActions/signUp";
import dayjs from "dayjs";
import { signupFormSchema } from "../../validator";

const formSchema = signupFormSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  },
);

export function SignupForm() {
  //const [inputName, setInputName] = useState("")
  //const [inputName, setInputName] = useLocalStorage("name", null)

  const { toast } = useToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("first");
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);

  const [formData, setFormData] = useState(() => {
    const formDataObj = {
      name: "",
      surname: "",
      location: "",
      username: "",
      email: "",
    };
    if (typeof window !== "undefined") {
      const storedData = sessionStorage.getItem("signup_form_data");
      return storedData ? JSON.parse(storedData) : formDataObj;
    }
    return formDataObj;
  });

  useEffect(() => {
    sessionStorage.setItem("signup_form_data", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "location") {
      fetchLocationSuggestions(value);
    }
  };

  const fetchLocationSuggestions = async (query: string) => {
    if (query.length < 3) {
      setLocationSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query,
        )}&type=city&limit=5`,
      );
      const data = await response.json();
      const suggestions = data.map((item: any) => item.display_name);
      setLocationSuggestions(suggestions);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };
  const handleSuggestionClick = (suggestion: string) => {
    setFormData((prevState: any) => ({
      ...prevState,
      location: suggestion,
    }));
    setLocationSuggestions([]);
  };
  const timeMachine = dayjs("2024-12-15"); //da sistemare con il merge della branchia timeMachine
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: formData.name,
      surname: formData.surname,
      location: formData.location,
      username: formData.username,
      email: formData.email,
      birthday: timeMachine.toDate(),
      photo: undefined,
      is_tech: false,
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Assuming an async registration function
      console.log(values);
      //sessionStorage.removeItem("signup_form_data");
      /*toast({
        title: "Toast window",
        description: values.username,
      });*/

      signUp(values);
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
      <div className="flex flex-col min-h-[50vh] h-full w-full items-center justify-center py-5">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="mx-auto max-w-md"
        >
          <TabsList>
            <TabsTrigger value="first">Account</TabsTrigger>
            <TabsTrigger value="second">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="first">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Register</CardTitle>
                <CardDescription>
                  Create a new account by following the registration process.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <div className="flex flex-col gap-4">
                      {/* Name Field */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="grid gap-2">
                            <FormLabel htmlFor="name">Name*</FormLabel>
                            <FormControl>
                              <Input
                                className="w-auto"
                                id="name"
                                placeholder="Mario"
                                type="text"
                                autoComplete="given-name"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleChange(e);
                                }}
                                value={formData.name}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Surname Field */}
                      <FormField
                        control={form.control}
                        name="surname"
                        render={({ field }) => (
                          <FormItem className="grid gap-2">
                            <FormLabel htmlFor="surname">Surname*</FormLabel>
                            <FormControl>
                              <Input
                                id="surname"
                                placeholder="Rossi"
                                type="text"
                                autoComplete="family-name"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleChange(e);
                                }}
                                value={formData.surname}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Location Field */}
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem className="grid gap-2">
                            <FormLabel htmlFor="location">Location</FormLabel>
                            <FormControl>
                              <Input
                                id="location"
                                placeholder="Rome"
                                type="text"
                                autoComplete="address-level2"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleChange(e);
                                }}
                                value={formData.location}
                              />
                            </FormControl>
                            <FormMessage />
                            {locationSuggestions.length > 0 && (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="outline" className="w-full">
                                    {formData.location || "Select Location"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64">
                                  <ul>
                                    {locationSuggestions.map(
                                      (suggestion, index) => (
                                        <li
                                          key={index}
                                          className="p-2 cursor-pointer hover:bg-gray-200"
                                          onClick={() =>
                                            handleSuggestionClick(suggestion)
                                          }
                                        >
                                          {suggestion}
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                </PopoverContent>
                              </Popover>
                            )}
                          </FormItem>
                        )}
                      />

                      {/* Birthday Field */}
                      <FormField
                        control={form.control}
                        name="birthday"
                        render={({ field }) => (
                          <FormItem className="grid gap-2">
                            <div className="mt-1">
                              <FormLabel htmlFor="birthday">
                                Birthday*
                              </FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      id="birthday"
                                      variant={"outline"}
                                      //className="w-fit pl-4 ml-4 text-center font-normal"
                                      className={cn(
                                        "w-fit pl-3 ml-4 text-center font-normal",
                                        !field.value && "text-muted-foreground",
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      {/*field.value.toDateString()*/}
                                      <FaCalendar />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date > timeMachine.toDate() ||
                                      date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      {/* Photo File Field */}
                      <FormField
                        control={form.control}
                        name="photo"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex mt-1">
                              <FormLabel htmlFor="photo" className="mt-3">
                                Photo
                              </FormLabel>
                              <FormControl>
                                <Input
                                  id="photo"
                                  type="file"
                                  accept="image/png, image/jpeg, image/jpg"
                                  //className="w-fit text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  className=" ml-10 pt-1.5 pl-1 text-center"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    field.onChange(file);
                                  }}
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Tec Field */}
                      <FormField
                        control={form.control}
                        name="is_tech"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex mt-1 mb-1">
                              <FormLabel
                                htmlFor="is_tech"
                                className="mt-1 mr-6"
                              >
                                Tecnico
                              </FormLabel>
                              <FormControl>
                                <Switch
                                  id="is_tech"
                                  name="is_tech"
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="button"
                        onClick={() => setActiveTab("second")}
                      >
                        Continue <FaArrowRight />
                      </Button>
                    </div>
                  </form>
                </Form>
                {
                  <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="./login" className="underline">
                      Login
                    </Link>
                  </div>
                }
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="second">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Register</CardTitle>
                <CardDescription>
                  Create a new account by following the registration process.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <div className="flex flex-col gap-4">
                      {/* username Field */}
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem className="grid gap-2">
                            <FormLabel htmlFor="username">Username*</FormLabel>
                            <FormControl>
                              <Input
                                id="username"
                                placeholder="JohnDoe1"
                                type="text"
                                autoComplete="username"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleChange(e);
                                }}
                                value={formData.username}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Email Field */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="grid gap-2">
                            <FormLabel htmlFor="email">Email*</FormLabel>
                            <FormControl>
                              <Input
                                id="email"
                                placeholder="johndoe@mail.com"
                                type="email"
                                autoComplete="email"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleChange(e);
                                }}
                                value={formData.email}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Password Field */}
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="grid gap-2">
                            <FormLabel htmlFor="password">Password*</FormLabel>
                            <FormControl>
                              <Input
                                id="password"
                                type="password"
                                placeholder="******"
                                autoComplete="new-password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Confirm Password Field */}
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem className="grid gap-2">
                            <FormLabel htmlFor="confirmPassword">
                              Confirm Password*
                            </FormLabel>
                            <FormControl>
                              <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="******"
                                autoComplete="new-password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="w-full flex gap-5 mt-2">
                        <Button
                          type="button"
                          className="w-1/2"
                          onClick={() => setActiveTab("first")}
                        >
                          <FaArrowLeft /> Back
                        </Button>
                        <Button type="submit" className="w-1/2">
                          Signup
                        </Button>
                      </div>
                    </div>
                  </form>
                </Form>
                {
                  <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="./login" className="underline">
                      Login
                    </Link>
                  </div>
                }
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
