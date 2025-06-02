"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlignJustify, X } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-800/30 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/80">
      <div className="container flex h-16 items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-2xl text-white">
            AutoDev
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
            Features
          </Link>
          <Link href="#faqs" className="text-gray-300 hover:text-white transition-colors">
            FAQs
          </Link>
          <Link href="#" className="text-gray-300 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="#" className="text-gray-300 hover:text-white transition-colors">
            Documentation
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-purple-800/20">Login</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-primary hover:bg-primary/90">Register</Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-white" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <AlignJustify size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden p-4 pt-0 bg-slate-900 border-b border-purple-800/30">
          <nav className="flex flex-col space-y-4 py-4">
            <Link 
              href="#features"
              className="px-2 py-1 text-gray-300 hover:bg-purple-800/20 hover:text-white rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="#faqs"
              className="px-2 py-1 text-gray-300 hover:bg-purple-800/20 hover:text-white rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQs
            </Link>
            <Link 
              href="#"
              className="px-2 py-1 text-gray-300 hover:bg-purple-800/20 hover:text-white rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="#"
              className="px-2 py-1 text-gray-300 hover:bg-purple-800/20 hover:text-white rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Documentation
            </Link>
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/login">
                <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:text-white hover:bg-purple-800/20">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button className="w-full bg-primary hover:bg-primary/90">Get Started</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}