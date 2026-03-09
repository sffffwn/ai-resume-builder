"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Wand2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ResumeValues {
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
}

interface Resume {
  id: string;
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
}

export default function ResumeForm({ resumeData, onChange }: { resumeData: Resume, onChange: (data: ResumeValues) => void }) {
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [generatingSkills, setGeneratingSkills] = useState(false);
  const [generatingExp, setGeneratingExp] = useState<number | null>(null);

  const { register, control, watch, reset, getValues, setValue } = useForm<ResumeValues>({
    defaultValues: {
      personal_info: {
        firstName: resumeData.personal_info?.firstName || "",
        lastName: resumeData.personal_info?.lastName || "",
        jobTitle: resumeData.personal_info?.jobTitle || "",
        email: resumeData.personal_info?.email || "",
        phone: resumeData.personal_info?.phone || "",
        location: resumeData.personal_info?.location || "",
        linkedin: resumeData.personal_info?.linkedin || "",
        website: resumeData.personal_info?.website || "",
      },
      summary: resumeData.summary || "",
      experience: resumeData.experience?.length ? resumeData.experience : [{ title: "", company: "", startDate: "", endDate: "", description: "" }],
      education: resumeData.education?.length ? resumeData.education : [{ school: "", degree: "", startDate: "", endDate: "", description: "" }],
      skills: resumeData.skills || "",
    }
  });

  const { fields: expFields, append: expAppend, remove: expRemove } = useFieldArray({ control, name: "experience" });
  const { fields: eduFields, append: eduAppend, remove: eduRemove } = useFieldArray({ control, name: "education" });

  useEffect(() => {
    const subscription = watch((value) => onChange(value as ResumeValues));
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  useEffect(() => {
    if (resumeData) {
      reset({
        personal_info: {
          firstName: resumeData.personal_info?.firstName || "",
          lastName: resumeData.personal_info?.lastName || "",
          jobTitle: resumeData.personal_info?.jobTitle || "",
          email: resumeData.personal_info?.email || "",
          phone: resumeData.personal_info?.phone || "",
          location: resumeData.personal_info?.location || "",
          linkedin: resumeData.personal_info?.linkedin || "",
          website: resumeData.personal_info?.website || "",
        },
        summary: resumeData.summary || "",
        experience: resumeData.experience?.length ? resumeData.experience : [{ title: "", company: "", startDate: "", endDate: "", description: "" }],
        education: resumeData.education?.length ? resumeData.education : [{ school: "", degree: "", startDate: "", endDate: "", description: "" }],
        skills: typeof resumeData.skills === "string" ? resumeData.skills : Array.isArray(resumeData.skills) ? (resumeData.skills as string[]).join(", ") : "",
      });
    }
  }, [resumeData.id, reset]);

  const generateAI = async (type: string, prompt: string, setter: (val: string) => void, setLoading: (val: boolean) => void) => {
    try {
      setLoading(true);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, prompt })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setter(data.result);
      onChange(getValues());
    } catch (e: unknown) {
      const error = e as Error;
      alert("AI Generation failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = () => {
    const vals = getValues();
    const prompt = `Name: ${vals.personal_info.firstName} ${vals.personal_info.lastName}. Title: ${vals.personal_info.jobTitle}. Skills: ${vals.skills}. Experience: ${JSON.stringify(vals.experience)}`;
    generateAI("summary", prompt, (res) => setValue("summary", res), setGeneratingSummary);
  };

  const handleGenerateSkills = () => {
    const vals = getValues();
    const prompt = `Title: ${vals.personal_info.jobTitle}. Experience: ${JSON.stringify(vals.experience)}`;
    generateAI("skills", prompt, (res) => setValue("skills", res), setGeneratingSkills);
  };

  const handleRewriteExperience = (index: number) => {
    const exp = getValues(`experience.${index}`);
    if (!exp.description && !exp.title) return alert("Add a title or basic description first.");
    const prompt = `Title: ${exp.title}, Company: ${exp.company}. Current description: ${exp.description || 'none'}`;
    setGeneratingExp(index);
    generateAI("experience", prompt, (res) => setValue(`experience.${index}.description`, res), () => setGeneratingExp(null));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Personal Info */}
      <section className="bg-card border border-border p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">1</div>
          Personal Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground ml-1">First Name</label>
            <input {...register("personal_info.firstName")} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="John" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground ml-1">Last Name</label>
            <input {...register("personal_info.lastName")} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Doe" />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-medium text-muted-foreground ml-1">Job Title</label>
            <input {...register("personal_info.jobTitle")} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Senior Software Engineer" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground ml-1">Email</label>
            <input {...register("personal_info.email")} type="email" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="john@example.com" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground ml-1">Phone</label>
            <input {...register("personal_info.phone")} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="+1 (555) 000-0000" />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-medium text-muted-foreground ml-1">Location</label>
            <input {...register("personal_info.location")} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="San Francisco, CA" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground ml-1">LinkedIn URL</label>
            <input {...register("personal_info.linkedin")} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="linkedin.com/in/johndoe" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground ml-1">Website / Portfolio</label>
            <input {...register("personal_info.website")} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="johndoe.com" />
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="bg-card border border-border p-6 rounded-2xl shadow-sm relative overflow-hidden group/sec">
        <div className="absolute top-6 right-6 opacity-0 group-hover/sec:opacity-100 transition-opacity">
           <button onClick={handleGenerateSummary} disabled={generatingSummary} type="button" className="text-xs flex items-center gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1.5 rounded-lg font-semibold transition-colors disabled:opacity-50">
              {generatingSummary ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />} AI Generate
           </button>
        </div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">2</div>
          Professional Summary
        </h2>
        <div className="space-y-2">
          <textarea {...register("summary")} rows={4} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none resize-none" placeholder="Write a brief summary... Or let AI write it for you!" />
        </div>
      </section>

      {/* Experience */}
      <section className="bg-card border border-border p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">3</div>
          Experience
        </h2>
        <div className="space-y-6">
          {expFields.map((field, index) => (
            <div key={field.id} className="relative border border-border rounded-xl p-4 bg-secondary/20 group/exp">
              <button type="button" onClick={() => expRemove(index)} className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors p-1">
                <Trash2 size={18} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground ml-1">Job Title</label>
                  <input {...register(`experience.${index}.title`)} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Software Engineer" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground ml-1">Company</label>
                  <input {...register(`experience.${index}.company`)} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Tech Inc." />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground ml-1">Start Date</label>
                  <input {...register(`experience.${index}.startDate`)} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Jan 2020" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground ml-1">End Date</label>
                  <input {...register(`experience.${index}.endDate`)} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Present" />
                </div>
              </div>
              <div className="space-y-1 relative">
                <div className="absolute top-0 right-0 opacity-0 group-hover/exp:opacity-100 transition-opacity -mt-2 z-10">
                   <button onClick={() => handleRewriteExperience(index)} disabled={generatingExp === index} type="button" className="text-xs flex items-center gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200 px-2 py-1.5 rounded-lg font-semibold transition-colors disabled:opacity-50">
                      {generatingExp === index ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />} Rewrite
                   </button>
                </div>
                <label className="text-xs font-medium text-muted-foreground ml-1">Description (Bullet points)</label>
                <textarea {...register(`experience.${index}.description`)} rows={4} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none resize-y" placeholder="• Developed new features..." />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => expAppend({ title: "", company: "", startDate: "", endDate: "", description: "" })} className="w-full py-3 border-2 border-dashed border-border rounded-xl text-sm font-medium text-primary hover:bg-primary/5 transition-colors flex justify-center items-center gap-2">
            <Plus size={18} /> Add Experience
          </button>
        </div>
      </section>

      {/* Education */}
      <section className="bg-card border border-border p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">4</div>
          Education
        </h2>
        <div className="space-y-6">
          {eduFields.map((field, index) => (
            <div key={field.id} className="relative border border-border rounded-xl p-4 bg-secondary/20">
              <button type="button" onClick={() => eduRemove(index)} className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors p-1">
                <Trash2 size={18} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground ml-1">School</label>
                  <input {...register(`education.${index}.school`)} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="University..." />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground ml-1">Degree</label>
                  <input {...register(`education.${index}.degree`)} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="B.S. CS" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground ml-1">Start Date</label>
                  <input {...register(`education.${index}.startDate`)} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Sep 2016" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground ml-1">End Date</label>
                  <input {...register(`education.${index}.endDate`)} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="May 2020" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground ml-1">Description (Optional)</label>
                <textarea {...register(`education.${index}.description`)} rows={2} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none resize-y" placeholder="Graduated with honors" />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => eduAppend({ school: "", degree: "", startDate: "", endDate: "", description: "" })} className="w-full py-3 border-2 border-dashed border-border rounded-xl text-sm font-medium text-primary hover:bg-primary/5 transition-colors flex justify-center items-center gap-2">
            <Plus size={18} /> Add Education
          </button>
        </div>
      </section>

      {/* Skills */}
      <section className="bg-card border border-border p-6 rounded-2xl shadow-sm relative group/sec">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">5</div>
          Skills
        </h2>
        <div className="space-y-2 relative">
           <div className="absolute top-0 right-0 opacity-0 group-hover/sec:opacity-100 transition-opacity -mt-8 z-10 pr-2">
              <button onClick={handleGenerateSkills} disabled={generatingSkills} type="button" className="text-xs flex items-center gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1.5 rounded-lg font-semibold transition-colors disabled:opacity-50">
                 {generatingSkills ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />} Suggest Skills
              </button>
           </div>
          <textarea {...register("skills")} rows={3} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none resize-none" placeholder="React, Node.js, etc..." />
        </div>
      </section>
    </div>
  );
}
