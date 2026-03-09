"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BrainCircuit, Loader2, Sparkles, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ATSCheckPage() {
  const [text, setText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<{
    score: number;
    analysis: string;
    suggestions: string[];
  } | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setAnalyzing(true);
    setReport(null);
    try {
      const response = await fetch("/api/ats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: text }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server Error (${response.status}): ${errorText.substring(0, 50)}`);
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setReport(data);
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      alert(error.message || "Failed to analyze text");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-20 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-3">
             <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                <BrainCircuit size={24} />
             </div>
             <h1 className="text-xl font-black tracking-tight">ATS <span className="text-indigo-600">Optimizer</span></h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 lg:py-20">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6"
          >
            <Sparkles size={14} />
            Professional Analysis
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-6xl font-black tracking-tighter mb-6 dark:text-white"
          >
            How ATS-friendly is your <span className="text-indigo-600">Resume?</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto font-medium"
          >
            Our AI analyzes your content against modern hiring algorithms to ensure you get past the filters.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-2xl shadow-indigo-100 dark:shadow-none border border-slate-100 dark:border-slate-800 pb-12"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Step 1: Paste Resume Content</h3>
              </div>
              
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your resume summary, experience, and skills here..."
                className="w-full h-80 bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all border-none resize-none mb-8 scrollbar-thin"
              />

              <button
                onClick={handleAnalyze}
                disabled={analyzing || !text.trim()}
                className="w-full bg-slate-900 dark:bg-white dark:text-black text-white h-20 rounded-3xl font-black text-xl flex items-center justify-center gap-4 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-2xl shadow-slate-200 dark:shadow-none disabled:opacity-50"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Analyzing Content...
                  </>
                ) : (
                  <>
                    <BrainCircuit size={24} />
                    Analyze ATS Score
                  </>
                )}
              </button>
            </motion.div>
          </div>

          <AnimatePresence>
            {report && (
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                className="lg:col-span-12 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                <div className="lg:col-span-4">
                  <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 h-full border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden relative">
                     <div className="absolute top-0 right-0 p-8 opacity-5">
                        <BarChart3 size={120} />
                     </div>
                     <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-10">Compatibility Score</h3>
                     <div className="relative w-40 h-40 mx-auto flex items-center justify-center mb-8">
                        <svg className="w-full h-full transform -rotate-90">
                           <circle cx="80" cy="80" r="70" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="12" fill="none" />
                           <circle 
                            cx="80" cy="80" r="70" 
                            className="stroke-indigo-600 transition-all duration-1000" 
                            strokeWidth="12" 
                            fill="none" 
                            strokeDasharray={440} 
                            strokeDashoffset={440 - (440 * report.score) / 100}
                            strokeLinecap="round"
                           />
                        </svg>
                        <span className="absolute text-5xl font-black tracking-tighter">{report.score}</span>
                     </div>
                     <p className="text-center text-slate-500 font-bold uppercase text-[10px] tracking-widest">Score out of 100</p>
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-8">
                   <div className="bg-indigo-600 rounded-[40px] p-10 text-white shadow-2xl shadow-indigo-200 dark:shadow-none">
                      <h3 className="text-[10px] font-black uppercase tracking-[.4em] mb-6 opacity-60">AI Analysis</h3>
                      <p className="text-2xl font-bold leading-tight">{report.analysis}</p>
                   </div>

                   <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-slate-100 dark:border-slate-800 shadow-xl">
                      <h3 className="text-[10px] font-black uppercase tracking-[.4em] text-slate-400 mb-8 flex items-center gap-4">
                         <span className="h-px bg-slate-100 dark:bg-slate-800 flex-1"></span>
                         Improvement Plan
                         <span className="h-px bg-slate-100 dark:bg-slate-800 flex-1"></span>
                      </h3>
                      <div className="grid gap-4">
                        {report.suggestions.map((s, i) => (
                          <div key={i} className="flex gap-6 items-start p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-all">
                             <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-700 flex items-center justify-center shrink-0 shadow-sm font-black text-indigo-600">
                                {i+1}
                             </div>
                             <p className="text-md font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{s}</p>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
