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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import apiInstance from "@/utils/axios"
import Link from "next/link"
import userStore from "@/store/user.store"

const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password is required.",
  }),
});

export default function LoginPage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const router = useRouter();

  const setUser = userStore((state) => state.setUser);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      console.log(data);
      const response = await apiInstance.post("/login", {
        email: data.email,
        password: data.password,
      });
      if (response.data.success === true) {
        toast.success("Login successful", {
          description: "You are now logged in to your account.",
          action: {
            label: "close",
            onClick: () => toast.dismiss(),
          }
        })
        setUser(response.data.user);
        router.push("/welcome");
      }
      else toast.error("Login failed", {
            description: response.data.message,
            action: {
              label: "close", 
              onClick: () => toast.dismiss(),
            }
          })
    
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Login failed", {
        description: "There was an error processing your login.",
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
          <CardTitle className="text-2xl font-bold text-center text-white">Welcome back</CardTitle>
          <CardDescription className="text-center text-gray-300">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="remember" 
                    className="rounded border-purple-700/40 bg-slate-700/60 text-primary focus:ring-purple-500" 
                  />
                  <label htmlFor="remember" className="text-sm text-gray-300">Remember me</label>
                </div>
                <Link href="/forgot-password" className="text-sm text-white hover:text-primary/90 hover:underline">
                  Forgot password?
                </Link>
              </div>
              
              <Button type="submit" className="w-full mt-6 bg-primary hover:bg-primary/90">
                Sign in
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-300">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-white hover:text-primary/90 hover:underline">
              Create account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}