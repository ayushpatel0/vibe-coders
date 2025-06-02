"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import apiInstance from "@/utils/axios"
import Link from "next/link"

const FormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function RegisterPage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const router = useRouter();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      console.log(data);
      const response = await apiInstance.post("/register", {
        fullname: data.fullName,
        email: data.email,
        password: data.password,
      });
      if (response.data.success === true) {
        toast.success("Registration successful", {
          description: "You can now log in to your account.",
          action: {
            label: "close",
            onClick: () => toast.dismiss(),
          }
        })
        router.push("/login")
      }
      else toast.error("Registration failed", {
            description: response.data.message,
            action: {
              label: "close", 
              onClick: () => toast.dismiss(),
            }
          })
    
    } catch (error) {
      console.error("Registration error:", error)
      toast.error("Registration failed", {
        description: "There was an error processing your registration.",
        action: {
          label: "close",
          onClick: () => toast.dismiss(),
        }
      })
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Card className="w-full max-w-md shadow-lg border border-purple-700/30 bg-slate-800/90 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-white">Create an account</CardTitle>
          <CardDescription className="text-center text-gray-300">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John Doe" 
                        {...field} 
                        className="bg-slate-700/60 border-purple-700/40 text-white placeholder:text-gray-400 focus-visible:ring-purple-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="example@example.com" 
                        {...field} 
                        className="bg-slate-700/60 border-purple-700/40 text-white placeholder:text-gray-400 focus-visible:ring-purple-500"
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
                  <FormItem>
                    <FormLabel className="text-gray-200">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                        className="bg-slate-700/60 border-purple-700/40 text-white placeholder:text-gray-400 focus-visible:ring-purple-500"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-400">
                      Must be at least 8 characters with uppercase, lowercase, and number
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Confirm Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                        className="bg-slate-700/60 border-purple-700/40 text-white placeholder:text-gray-400 focus-visible:ring-purple-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full mt-6 bg-primary hover:bg-primary/90">
                Create account
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-300">
            Already have an account?{" "}
            <Link href="/login" className="text-white hover:text-primary/90 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}