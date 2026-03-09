"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Sparkles, Layout, Zap, ArrowRight, Github, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] opacity-50" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] opacity-50" />
      </div>

      <nav className="w-full h-16 border-b border-border bg-background/50 backdrop-blur-md fixed top-0 z-50 flex items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
            <Sparkles size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight">AI Resume Maker</span>
        </div>
        <div className="flex gap-8 items-center">
          <Link href="/ats-check" className="hidden md:block text-sm font-semibold hover:text-primary transition-colors">
            ATS Optimizer
          </Link>
          <div className="flex gap-4 items-center">
          {loading ? (
            <Loader2 className="animate-spin text-muted-foreground" size={20} />
          ) : session ? (
            <Link 
              href="/dashboard" 
              className="text-sm font-medium bg-primary text-primary-foreground px-5 py-2 rounded-full hover:bg-primary/90 transition-colors shadow-sm"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                Sign In
              </Link>
              <Link 
                href="/login" 
                className="text-sm font-medium bg-foreground text-background px-4 py-2 rounded-full hover:bg-foreground/90 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
      </nav>

      <main className="flex-1 w-full max-w-6xl px-6 pt-32 pb-16 z-10 flex flex-col items-center text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-sm font-medium mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          Now powered by Groq LLaMA 3
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Land your dream job with an <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">AI-crafted</span> resume.
        </motion.h1>

        <motion.p 
          className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Stand out from the crowd. Give us your details, and our cutting-edge AI will generate a professional, ATS-friendly resume in seconds.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link 
            href="/dashboard" 
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
          >
            Build Resume Free
            <ArrowRight size={20} />
          </Link>
          <Link 
            href="https://github.com" 
            target="_blank"
            className="flex items-center justify-center gap-2 bg-card border border-border text-foreground px-8 py-4 rounded-full font-semibold text-lg hover:bg-secondary transition-all"
          >
            <Github size={20} />
            Star on GitHub
          </Link>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full text-left"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all hover:translate-y-[-4px]">
            <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-xl mb-6 text-primary">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
            <p className="text-muted-foreground">Powered by Groq&apos;s LPU technology, experience near-instant AI generation for your bullet points and summaries.</p>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all hover:translate-y-[-4px]">
            <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-xl mb-6 text-primary">
              <Layout size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Live Preview</h3>
            <p className="text-muted-foreground">See exactly what your resume looks like as you type. Real-time updates with Pixel-perfect PDF rendering.</p>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all hover:translate-y-[-4px]">
            <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-xl mb-6 text-primary">
              <FileText size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">ATS-Optimized</h3>
            <p className="text-muted-foreground">Clean, standard templates that parse perfectly in popular Applicant Tracking Systems. No formatting issues.</p>
          </div>
        </motion.div>
      </main>

      <footer className="w-full border-t border-border py-8 text-center text-sm text-muted-foreground mt-auto relative z-10 bg-background/80">
        <p>&copy; {new Date().getFullYear()} AI Resume Maker. Built with Next.js and Supabase.</p>
      </footer>
    </div>
  );
}
