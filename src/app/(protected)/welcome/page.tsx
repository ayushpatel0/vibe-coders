"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import userStore from "@/store/user.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Code, Image as ImageIcon, LogOut, User } from "lucide-react";
import { toast } from "sonner";
import apiInstance from "@/utils/axios";

export default function WelcomePage() {
  const router = useRouter();
  const { user, setUser } = userStore();
  const [greeting, setGreeting] = useState("Welcome");

  useEffect(() => {
    if (!user.email) {
        getUserData();
    }
  }, [user, setUser, router]);

  const getUserData = async () => {
    try {
      const response = await apiInstance.get("/get-user");
      if (response.data.success) {
        setUser(response.data.user);
      }
      else {
        toast.error("Failed to fetch user data", {
          description: "Please log in again.",
          action: {
              label: "Close",
              onClick: () => toast.dismiss(),
          },
        });
        router.push("/login");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data", {
        description: "Please log in again.",
        action: {
            label: "Close",
            onClick: () => toast.dismiss(),
        },
      });
      router.push("/login");
    }
  }

  useEffect(() => {
    // Set appropriate greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const handleLogout = async () => {
    try {
      await apiInstance.get("/logout");
      setUser({_id: "", fullname: "", email: "", profile: ""}); // Clear user state
      toast.success("Logged out successfully", {
        description: "You have been logged out of your account.",
        action: {
            label: "Close",
            onClick: () => toast.dismiss(),
        },
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed", {
        description: "There was an error logging you out. Please try again.",
        action: {
            label: "Close",
            onClick: () => toast.dismiss(),
        },
      });
    }
  };

  console.log("User data:", user);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-10 bg-slate-900/90 backdrop-blur-sm border-b border-purple-800/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/welcome" className="text-white font-bold text-xl flex items-center">
                <span className="bg-primary p-1 rounded mr-2">
                  <Home className="h-5 w-5" />
                </span>
                AutoDev
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/profile" className="text-gray-300 hover:text-white transition-colors">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </div>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-gray-300 hover:text-white hover:bg-red-900/20"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome message */}
          <div className="text-center mb-12 mt-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {greeting}, <span className="text-primary">{user.fullname}</span>!
            </h1>
            <p className="text-gray-300 text-lg">
              What would you like to create today?
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Code Generation Card */}
            <Card className="bg-slate-800/80 border border-purple-700/30 backdrop-blur-sm hover:border-primary/60 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Code className="h-6 w-6 mr-2 text-primary" />
                  Code Generation
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Generate, edit, and execute code with AI assistance
                </CardDescription>
              </CardHeader>
              <CardContent className="text-gray-300">
                <p>
                  Our advanced AI can help you generate code in multiple languages, solve programming problems,
                  and optimize your existing code. With real-time execution, you can test your code instantly.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/code-gen" className="w-full">
                  <Button className="w-full">
                    Start Coding
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Image to Site Card */}
            <Card className="bg-slate-800/80 border border-purple-700/30 backdrop-blur-sm hover:border-primary/60 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <ImageIcon className="h-6 w-6 mr-2 text-primary" />
                  Image to Website
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Convert any design image into working HTML, CSS and JavaScript
                </CardDescription>
              </CardHeader>
              <CardContent className="text-gray-300">
                <p>
                  Upload a screenshot or image of a website design, and our AI will instantly convert it into 
                  clean, responsive HTML/CSS code that you can download or further customize.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/pic-site" className="w-full">
                  <Button className="w-full">
                    Convert Image
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          {/* Recent projects or quick tips section */}
          <Card className="bg-slate-800/60 border border-purple-700/30 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-white">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-gray-300 space-y-2">
                <li>Use natural language to describe the code you want to generate</li>
                <li>For image-to-code conversion, clear screenshots work best</li>
                <li>You can edit and refine the generated code directly in our editor</li>
                <li>Save your projects to access them later from your profile</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/90 border-t border-purple-800/30 py-4">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} AutoDev. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}