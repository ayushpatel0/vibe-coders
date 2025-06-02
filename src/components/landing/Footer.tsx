import Link from "next/link";
import { Github, Twitter, Linkedin, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-purple-800/30 bg-slate-900">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-bold text-2xl text-white">
              AutoDev
            </Link>
            <p className="mt-2 text-sm text-gray-300">
              Transforming development workflows with AI-powered coding solutions.
            </p>
            <div className="flex gap-4 mt-4">
              <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Github size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Linkedin size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook size={20} />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3 text-white">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-gray-300 hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-primary transition-colors">Changelog</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-primary transition-colors">Documentation</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3 text-white">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-gray-300 hover:text-primary transition-colors">About</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3 text-white">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-gray-300 hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-purple-800/30 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} AutoDev. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}