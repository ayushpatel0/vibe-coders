import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-white">
                Transform Your <span className="text-primary">Code</span> into Reality
              </h1>
              <p className="text-xl text-gray-300 max-w-[600px]">
                All-in-one solution for code generation, execution, and design conversion. 
                From ideas to functioning websites in minutes.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/welcome">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  Get Started Free
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-gray-400 text-white hover:bg-white/10">
                  Explore Features
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              No credit card required • Its totally free
            </div>
          </div>
          <div className="relative w-full h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-2xl border border-purple-700/30">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 mix-blend-overlay" />
            <Image
              src="/images/autodev.webp" 
              alt="AutoDev Code Editor Interface"
              fill
              className="object-cover"
              priority
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}