"use client";

import React, { useEffect, useState, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, ArrowLeft, Save, Sparkles, Printer, X, AlertCircle } from "lucide-react";
import Link from "next/link";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";

interface Resume {
  id: string;
  title: string;
  personal_info: {
    firstName: string;
    lastName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: string;
  template_id: string;
  ats_report: {
    score: number;
    analysis: string;
    suggestions: string[];
  } | null;
  updated_at: string;
}

export default function BuilderPage({ params }: { params: any }) {
  const router = useRouter();
  const [resume, setResume] = useState<Resume | null>(null);
  const [id, setId] = useState<string | null>(null);

  // Robust params handling for Next.js 14/15 compatibility
  useEffect(() => {
    if (params) {
      if (params instanceof Promise) {
        params.then(p => setId(p.id)).catch(err => {
          console.error("Params Promise Error:", err);
          router.push("/dashboard");
        });
      } else if (params.id) {
        setId(params.id);
      }
    }
  }, [params, router]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  const [analyzingATS, setAnalyzingATS] = useState(false);
  const [showATSModal, setShowATSModal] = useState(false);
  const [dbWarning, setDbWarning] = useState(false);

  const fetchResume = useCallback(async () => {
    if (!id) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      alert("Resume not found or access denied.");
      router.push("/dashboard");
    } else {
      const formattedResume = {
        ...data,
        personal_info: data.personal_info || {},
        experience: data.experience || [],
        education: data.education || [],
        skills: data.skills || "",
        template_id: data.template_id || "modern",
        ats_report: data.ats_report || null,
      };
      setResume(formattedResume);
      setTempTitle(data.title || "Untitled Resume");
    }
    } catch (err) {
      console.error("Fetch Resume Error:", err);
      alert("An unexpected error occurred while loading your resume.");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  const checkSchema = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Try to select new columns to see if they exist
    const { error } = await supabase
      .from("resumes")
      .select("template_id, ats_report")
      .limit(1);
    
    if (error && (error.code === "PGRST204" || error.message?.includes("column"))) {
      setDbWarning(true);
    }
  }, []);

  useEffect(() => {
    fetchResume();
    checkSchema();
  }, [fetchResume, checkSchema]);

  const handleUpdate = (updatedData: Partial<Resume>) => {
    setResume((prev) => prev ? ({ ...prev, ...updatedData }) : null);
  };

  const saveResume = async () => {
    if (!resume) return;
    setSaving(true);
    
    // Attempt full update
    const { error } = await supabase
      .from("resumes")
      .update({
        title: tempTitle,
        personal_info: resume.personal_info,
        summary: resume.summary,
        experience: resume.experience,
        education: resume.education,
        skills: resume.skills,
        template_id: resume.template_id,
        ats_report: resume.ats_report,
        updated_at: new Date().toISOString(),
      })
      .eq("id", resume.id);

    if (error) {
      console.error("Full Save Error:", error);
      
      // Fallback: try saving without new columns (common if user didn't run SQL)
      // We try the fallback if it's a known column error OR if message is weirdly empty (as seen in some logs)
      const isColumnError = error.code === "PGRST204" || 
                           (error.message && (error.message.includes("column") || error.message.includes("template_id"))) ||
                           (!error.message && !error.code); // Broad fallback if error is opaque

      if (isColumnError) {
        console.log("Attempting fallback save...");
        const { error: fallbackError } = await supabase
          .from("resumes")
          .update({
            title: tempTitle,
            personal_info: resume.personal_info,
            summary: resume.summary,
            experience: resume.experience,
            education: resume.education,
            skills: resume.skills,
            updated_at: new Date().toISOString(),
          })
          .eq("id", resume.id);

        if (!fallbackError) {
          setDbWarning(true);
          setResume({ ...resume, title: tempTitle });
          setShowSaveDialog(false);
          setSaving(false);
          return;
        } else {
          console.error("Fallback Save Error:", fallbackError);
        }
      }
      
      alert(`Failed to save resume: ${error.message || "Unknown error"}. Check your DB connection or the schema.`);
    } else {
      setResume({ ...resume, title: tempTitle });
      setDbWarning(false); // Clear warning if full save works
      setShowSaveDialog(false);
    }
    setSaving(false);
  };

  const checkATSScore = async () => {
    if (!resume) return;
    setAnalyzingATS(true);
    try {
      const response = await fetch("/api/ats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // Save report to DB
      await supabase
        .from("resumes")
        .update({ ats_report: data })
        .eq("id", resume.id);

      setResume({ ...resume, ats_report: data });
      setShowATSModal(true);
    } catch (err) {
      console.error(err);
      alert("Failed to analyze ATS score");
    } finally {
      setAnalyzingATS(false);
    }
  };

  if (loading || !resume) {
    return (
      <div className="flex justify-center items-center py-32 h-screen">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/20 flex flex-col font-sans">
      {dbWarning && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-3 flex items-center justify-center gap-3 animate-in slide-in-from-top duration-500 z-[100] no-print shadow-lg">
          <AlertCircle size={18} className="shrink-0" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 flex-1 justify-center">
            <span className="text-sm font-black uppercase tracking-wider">Database Upgrade Required</span>
            <span className="text-xs sm:text-sm font-medium opacity-90">Templates and ATS features are disabled. Run the SQL in <code className="bg-white/20 px-2 py-0.5 rounded font-mono text-xs">FIX_DATABASE.sql</code>.</span>
            <button 
              onClick={checkSchema}
              className="bg-white text-orange-600 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-tight hover:bg-white/90 transition-all shadow-sm active:scale-95"
            >
              Verify Fix
            </button>
          </div>
          <button onClick={() => setDbWarning(false)} className="opacity-70 hover:opacity-100 transition-opacity">
            <X size={18}/>
          </button>
        </div>
      )}

      <header className="bg-background border-b border-border h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50 no-print">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors p-2 -ml-2 rounded-lg hover:bg-secondary">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Editing</span>
            <span className="text-sm font-semibold truncate max-w-[150px]">{resume.title}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-xl border border-border no-print">
            <span className="text-[10px] uppercase font-black text-muted-foreground mr-1">Template</span>
            <select 
              value={resume.template_id}
              onChange={(e) => handleUpdate({ template_id: e.target.value })}
              className="bg-transparent text-sm font-bold focus:outline-none cursor-pointer hover:text-primary transition-colors"
            >
              <option value="modern">Modern</option>
              <option value="classic">Classic</option>
              <option value="minimal">Minimal</option>
              <option value="professional">Professional</option>
              <option value="creative">Creative</option>
              <option value="elegant">Elegant</option>
              <option value="compact">Compact</option>
              <option value="bold">Bold</option>
              <option value="sidebar">Sidebar</option>
            </select>
          </div>

          <button 
            type="button"
            onClick={checkATSScore}
            disabled={analyzingATS}
            className="hidden sm:flex items-center gap-2 bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 px-4 py-2 rounded-xl font-medium transition-colors no-print disabled:opacity-50"
          >
            {analyzingATS ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
            <span className="text-sm">ATS Score</span>
          </button>
          <button
            onClick={() => window.print()}
            className="hidden sm:flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-xl font-medium transition-colors no-print"
          >
            <Printer size={16} />
            <span className="text-sm">Export PDF</span>
          </button>
          <button 
            onClick={() => {
              setTempTitle(resume.title);
              setShowSaveDialog(true);
            }}
            disabled={saving}
            className="bg-primary text-primary-foreground flex items-center gap-2 px-5 py-2 rounded-xl font-medium hover:bg-primary/90 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed no-print"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </header>

      {/* Save Dialog Modal */}
      {showSaveDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200 no-print">
          <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
            <div className="bg-primary/10 w-16 h-16 flex items-center justify-center rounded-2xl mb-6 text-primary">
              <Save size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Save Resume</h2>
            <p className="text-muted-foreground mb-6">Enter a name for your resume to keep it organized.</p>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Resume Title</label>
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  placeholder="e.g. Senior Software Engineer - Google"
                  autoFocus
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveResume();
                  }}
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1 px-6 py-3 rounded-xl font-semibold border border-border hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveResume}
                  disabled={saving}
                  className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="animate-spin" size={18} /> : null}
                  Confirm & Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ATS Analysis Modal */}
      {showATSModal && resume.ats_report && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-background/80 backdrop-blur-md animate-in fade-in duration-300 no-print">
          <div className="bg-card border border-border rounded-[40px] p-10 shadow-3xl max-w-2xl w-full mx-4 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 flex items-center justify-center rounded-3xl bg-primary/10 text-primary overflow-hidden">
                   <div className="absolute inset-0 bg-primary/20 animate-pulse" style={{ height: `${resume.ats_report.score}%`, top: 'auto', bottom: 0 }}></div>
                   <span className="text-4xl font-black relative z-10">{resume.ats_report.score}</span>
                </div>
                <div>
                  <h2 className="text-3xl font-black tracking-tight mb-1">ATS Report</h2>
                  <p className="text-muted-foreground font-medium">AI-powered resume optimization</p>
                </div>
              </div>
              <button 
                onClick={() => setShowATSModal(false)}
                className="p-3 hover:bg-secondary rounded-2xl transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-8">
              <div className="bg-secondary/30 p-6 rounded-[28px] border border-border/50">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Analysis</h3>
                <p className="text-lg font-medium leading-relaxed">{resume.ats_report.analysis}</p>
              </div>

              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-5 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Key Suggestions
                </h3>
                <div className="grid gap-3">
                  {resume.ats_report.suggestions.map((suggestion, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-background border border-border/50 rounded-2xl items-start group hover:border-primary/30 transition-colors">
                      <div className="bg-primary/5 text-primary p-2 rounded-lg font-black text-xs shrink-0 group-hover:bg-primary/10 transition-colors">{i+1}</div>
                      <p className="text-sm font-semibold leading-relaxed group-hover:text-foreground transition-colors">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowATSModal(false)}
                className="w-full bg-slate-900 text-white dark:bg-white dark:text-black py-4 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/10"
              >
                Got it, let&apos;s improve!
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
        <div className="w-full lg:w-[45%] h-full overflow-y-auto border-r border-border bg-background p-4 lg:p-6 scrollbar-thin">
          <ResumeForm resumeData={resume} onChange={handleUpdate} />
        </div>
        <div className="w-full lg:w-[55%] h-full overflow-y-auto bg-secondary/30 p-4 lg:p-8 flex justify-center items-start scrollbar-thin">
          <div className="w-full max-w-[850px] shadow-2xl transition-all hover:shadow-3xl">
            <ResumePreview data={resume} />
          </div>
        </div>
      </main>
    </div>
  );
}
