"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Plus, FileText, Calendar, Trash2, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data, error } = await supabase
        .from("resumes")
        .select("id, title, updated_at")
        .order("updated_at", { ascending: false });
      
      if (!error && data) {
        setResumes(data);
      }
    }
    setLoading(false);
  };

  const createNewResume = async () => {
    setCreating(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    
    const { data, error } = await supabase
      .from("resumes")
      .insert([
        {
          user_id: session.user.id,
          title: "Untitled Resume",
        }
      ])
      .select()
      .single();

    if (data && !error) {
      router.push(`/builder/${data.id}`);
    } else {
      alert("Failed to create resume.");
      setCreating(false);
    }
  };

  const deleteResume = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;
    const { error } = await supabase.from("resumes").delete().eq("id", id);
    if (!error) {
      setResumes(resumes.filter(r => r.id !== id));
    } else {
      alert("Failed to delete resume.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Resumes</h1>
          <p className="text-muted-foreground mt-1">Manage and edit your AI-generated resumes</p>
        </div>
        <button 
          onClick={createNewResume}
          disabled={creating}
          className="bg-primary text-primary-foreground flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-all shadow-sm disabled:opacity-70 active:scale-95"
        >
          {creating ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
          Create New
        </button>
      </div>

      {resumes.length === 0 ? (
        <div className="bg-card border border-border rounded-3xl p-12 text-center shadow-sm max-w-2xl mx-auto mt-12">
          <div className="bg-primary/10 w-20 h-20 flex items-center justify-center rounded-2xl mx-auto mb-6 text-primary">
            <FileText size={40} />
          </div>
          <h2 className="text-2xl font-semibold mb-3">No resumes yet</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            You haven&apos;t created any resumes. Click the button below to generate your first professional AI resume.
          </p>
          <button 
            onClick={createNewResume}
            disabled={creating}
            className="bg-primary text-primary-foreground inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 disabled:opacity-70"
          >
            {creating ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
            Create First Resume
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <div key={resume.id} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group relative flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className="bg-secondary text-secondary-foreground p-3.5 rounded-xl group-hover:scale-110 transition-transform">
                  <FileText size={24} />
                </div>
                <button 
                  onClick={() => deleteResume(resume.id)}
                  className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive p-2 rounded-lg transition-colors border border-transparent hover:border-destructive/20"
                  title="Delete Resume"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <h3 className="font-semibold text-xl mb-2 line-clamp-1" title={resume.title}>
                {resume.title || "Untitled Resume"}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 mt-auto pt-4 border-t border-border/50">
                <Calendar size={14} />
                <span>Updated {new Date(resume.updated_at).toLocaleDateString()}</span>
              </div>
              <Link 
                href={`/builder/${resume.id}`}
                className="block w-full text-center bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold py-2.5 rounded-xl transition-colors"
              >
                Open Builder
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
