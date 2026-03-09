"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, ArrowLeft, Save, Sparkles, Printer } from "lucide-react";
import Link from "next/link";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";

export default function BuilderPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchResume();
  }, [params.id]);

  const fetchResume = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error || !data) {
      alert("Resume not found or access denied.");
      router.push("/dashboard");
    } else {
      setResume({
        ...data,
        personal_info: data.personal_info || {},
        experience: data.experience || [],
        education: data.education || [],
        skills: data.skills || [],
      });
    }
    setLoading(false);
  };

  const handleUpdate = (updatedData: any) => {
    setResume((prev: any) => ({ ...prev, ...updatedData }));
  };

  const saveResume = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("resumes")
      .update({
        title: resume.title,
        personal_info: resume.personal_info,
        summary: resume.summary,
        experience: resume.experience,
        education: resume.education,
        skills: resume.skills,
        updated_at: new Date().toISOString(),
      })
      .eq("id", resume.id);

    setSaving(false);
    if (error) {
      alert("Failed to save resume");
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
    <div className="min-h-screen bg-secondary/20 flex flex-col">
      <header className="bg-background border-b border-border h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors p-2 -ml-2 rounded-lg hover:bg-secondary">
            <ArrowLeft size={20} />
          </Link>
          <input
            type="text"
            value={resume.title}
            onChange={(e) => handleUpdate({ title: e.target.value })}
            className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary rounded px-2 py-1 max-w-[200px] sm:max-w-xs transition-all"
            placeholder="Untitled Resume"
          />
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            className="hidden sm:flex items-center gap-2 bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 px-4 py-2 rounded-xl font-medium transition-colors"
          >
            <Sparkles size={16} />
            <span className="text-sm">AI Enhance</span>
          </button>
          <button
            onClick={() => window.print()}
            className="hidden sm:flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-xl font-medium transition-colors"
          >
            <Printer size={16} />
            <span className="text-sm">Export PDF</span>
          </button>
          <button 
            onClick={saveResume}
            disabled={saving}
            className="bg-primary text-primary-foreground flex items-center gap-2 px-5 py-2 rounded-xl font-medium hover:bg-primary/90 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </header>

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
