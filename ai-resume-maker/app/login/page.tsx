"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        // Optionally show success message or redirect
        alert("Check your email for the confirmation link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      </div>

      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 z-10 hover:opacity-80 transition-opacity">
        <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
          <Sparkles size={20} />
        </div>
        <span className="font-bold text-xl tracking-tight hidden sm:inline-block">AI Resume</span>
      </Link>

      <motion.div 
        className="w-full max-w-md bg-card border border-border rounded-3xl p-8 z-10 shadow-2xl relative"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{isSignUp ? "Create an account" : "Welcome back"}</h1>
          <p className="text-muted-foreground">
            {isSignUp ? "Sign up to start building your AI resume." : "Sign in to access your resumes."}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-background py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-foreground/90 transition-all disabled:opacity-70 mt-6"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                {isSignUp ? "Sign Up" : "Sign In"}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-muted-foreground">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
          </span>
          <button 
            type="button" 
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-semibold text-primary hover:underline transition-all"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
