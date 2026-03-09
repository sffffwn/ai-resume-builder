"use client";

import React from "react";

interface Resume {
  template_id?: string;
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

export default function ResumePreview({ data }: { data: Resume }) {
  const { personal_info, summary, experience, education, template_id = "modern" } = data || {};
  // Normalize skills to always be a string, preventing .split() crashes on new resumes
  const skills = typeof data?.skills === "string" ? data.skills : Array.isArray(data?.skills) ? (data.skills as string[]).join(", ") : "";

  // Standard utility to render experience/education descriptions as bullets
  const renderList = (text: string) => {
    if (!text) return null;
    return (
      <div className="text-sm leading-relaxed whitespace-pre-wrap pl-2">
        {text.split('\n').map((line, i) => {
          if (!line.trim()) return null;
          return (
            <div key={i} className="flex gap-2 mb-1">
              <span className="text-slate-400 select-none font-bold mr-1">•</span>
              <span>{line.trim().replace(/^[•-]\s*/, '')}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const templates: Record<string, React.ReactNode> = {
    modern: (
      <div className="font-sans text-slate-900">
        <header className="text-center border-b-2 border-slate-300 pb-4 mb-6">
          <h1 className="text-3xl font-bold uppercase tracking-wider mb-1">
            {personal_info?.firstName} {personal_info?.lastName}
          </h1>
          <h2 className="text-lg text-slate-600 font-medium mb-2">{personal_info?.jobTitle}</h2>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-slate-500">
            {personal_info?.email && <span>{personal_info.email}</span>}
            {personal_info?.phone && <span>• {personal_info.phone}</span>}
            {personal_info?.location && <span>• {personal_info.location}</span>}
          </div>
        </header>

        {summary && (
          <section className="mb-6">
            <h3 className="text-lg font-bold uppercase border-b border-slate-200 mb-2 pb-1 text-slate-800">Professional Summary</h3>
            <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{summary}</p>
          </section>
        )}

        {experience?.length > 0 && (
          <section className="mb-6">
            <h3 className="text-lg font-bold uppercase border-b border-slate-200 mb-3 pb-1 text-slate-800">Experience</h3>
            <div className="space-y-4">
              {experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline font-medium mb-1">
                    <h4 className="text-[15px] font-bold">{exp.title}</h4>
                    <span className="text-sm text-slate-600">{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <div className="text-sm italic text-slate-700 mb-2">{exp.company}</div>
                  {renderList(exp.description)}
                </div>
              ))}
            </div>
          </section>
        )}

        {education?.length > 0 && (
          <section className="mb-6">
            <h3 className="text-lg font-bold uppercase border-b border-slate-200 mb-3 pb-1 text-slate-800">Education</h3>
            <div className="space-y-3">
              {education.map((edu, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-[15px] font-bold">{edu.school}</h4>
                    <span className="text-sm text-slate-600">{edu.startDate} — {edu.endDate}</span>
                  </div>
                  <div className="text-sm text-slate-800 font-medium">{edu.degree}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills && (
          <section>
            <h3 className="text-lg font-bold uppercase border-b border-slate-200 mb-2 pb-1 text-slate-800">Skills</h3>
            <p className="text-sm leading-relaxed text-slate-700">{skills}</p>
          </section>
        )}
      </div>
    ),

    classic: (
      <div className="font-serif text-slate-900">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">
            {personal_info?.firstName} {personal_info?.lastName}
          </h1>
          <div className="text-sm text-slate-600 space-x-2">
            <span>{personal_info?.email}</span> | <span>{personal_info?.phone}</span> | <span>{personal_info?.location}</span>
          </div>
          {personal_info?.linkedin && <div className="text-xs mt-1 text-slate-500">{personal_info.linkedin}</div>}
        </header>

        {summary && (
          <section className="mb-8">
            <h3 className="text-center text-lg font-bold uppercase tracking-[0.2em] border-y border-slate-300 py-1 mb-4">Summary</h3>
            <p className="text-sm leading-relaxed text-center px-4">{summary}</p>
          </section>
        )}

        {experience?.length > 0 && (
          <section className="mb-8">
            <h3 className="text-center text-lg font-bold uppercase tracking-[0.2em] border-y border-slate-300 py-1 mb-4">Experience</h3>
            <div className="space-y-6">
              {experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between font-bold text-[15px]">
                    <h4>{exp.company}</h4>
                    <span>{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="italic text-sm mb-2">{exp.title}</div>
                  <div className="text-sm pl-4">{renderList(exp.description)}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {education?.length > 0 && (
          <section className="mb-8">
            <h3 className="text-center text-lg font-bold uppercase tracking-[0.2em] border-y border-slate-300 py-1 mb-4">Education</h3>
            {education.map((edu, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between font-bold text-sm">
                  <h4>{edu.school}</h4>
                  <span>{edu.startDate} - {edu.endDate}</span>
                </div>
                <div className="text-sm italic">{edu.degree}</div>
              </div>
            ))}
          </section>
        )}

        {skills && (
          <section>
            <h3 className="text-center text-lg font-bold uppercase tracking-[0.2em] border-y border-slate-300 py-1 mb-4">Skills</h3>
            <p className="text-sm text-center px-8">{skills}</p>
          </section>
        )}
      </div>
    ),

    minimal: (
      <div className="font-sans text-neutral-800 tracking-tight">
        <header className="mb-10">
          <h1 className="text-5xl font-black mb-2 uppercase tracking-tighter">
            {personal_info?.firstName}<span className="text-primary">{personal_info?.lastName}</span>
          </h1>
          <div className="flex gap-4 text-xs font-bold uppercase tracking-widest text-neutral-400">
            <span>{personal_info?.email}</span>
            <span>/</span>
            <span>{personal_info?.phone}</span>
            <span>/</span>
            <span>{personal_info?.location}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-10">
          {summary && (
            <section>
              <p className="text-base leading-relaxed font-medium">{summary}</p>
            </section>
          )}

          {experience?.length > 0 && (
            <section>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-300 mb-6">Experience</h3>
              <div className="space-y-8">
                {experience.map((exp, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between items-end mb-2">
                       <h4 className="text-xl font-black uppercase leading-none">{exp.title}</h4>
                       <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{exp.startDate} — {exp.endDate}</span>
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-primary mb-4">{exp.company}</div>
                    <div className="text-sm opacity-80">{renderList(exp.description)}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="grid grid-cols-2 gap-10">
            {education?.length > 0 && (
              <section>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-300 mb-6">Education</h3>
                {education.map((edu, i) => (
                  <div key={i} className="mb-4">
                    <h4 className="font-black text-sm uppercase mb-1">{edu.school}</h4>
                    <div className="text-xs font-bold text-primary mb-1">{edu.degree}</div>
                    <div className="text-[10px] text-neutral-400 font-bold uppercase">{edu.startDate} — {edu.endDate}</div>
                  </div>
                ))}
              </section>
            )}

            {skills && (
              <section>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-300 mb-6">Skills</h3>
                <p className="text-sm font-medium leading-relaxed">{skills}</p>
              </section>
            )}
          </div>
        </div>
      </div>
    ),

    professional: (
      <div className="font-sans text-gray-900 border-l-8 border-primary pl-8 py-2">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold mb-1">{personal_info?.firstName} {personal_info?.lastName}</h1>
          <p className="text-xl font-bold text-primary mb-4">{personal_info?.jobTitle}</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2"><span>Email:</span> <span className="font-semibold">{personal_info?.email}</span></div>
            <div className="flex items-center gap-2"><span>Phone:</span> <span className="font-semibold">{personal_info?.phone}</span></div>
            <div className="flex items-center gap-2"><span>Location:</span> <span className="font-semibold">{personal_info?.location}</span></div>
            <div className="flex items-center gap-2"><span>LinkedIn:</span> <span className="font-semibold truncate">{personal_info?.linkedin}</span></div>
          </div>
        </header>

        {summary && (
          <section className="mb-8">
            <h3 className="text-lg font-bold bg-primary text-white px-3 py-1 mb-3 rounded-r-md inline-block">Objective</h3>
            <p className="text-sm leading-relaxed">{summary}</p>
          </section>
        )}

        {experience?.length > 0 && (
          <section className="mb-8">
             <h3 className="text-lg font-bold bg-primary text-white px-3 py-1 mb-4 rounded-r-md inline-block">Experience</h3>
             <div className="space-y-6">
                {experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-md font-bold text-gray-800">{exp.title}</h4>
                      <span className="text-sm font-bold opacity-60 italic">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <div className="text-sm font-bold text-primary mb-2">{exp.company}</div>
                    {renderList(exp.description)}
                  </div>
                ))}
             </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {education?.length > 0 && (
            <section>
              <h3 className="text-lg font-bold bg-primary text-white px-3 py-1 mb-4 rounded-r-md inline-block">Education</h3>
              {education.map((edu, i) => (
                <div key={i} className="mb-4">
                  <h4 className="font-bold text-sm">{edu.school}</h4>
                  <div className="text-xs text-primary font-bold">{edu.degree}</div>
                  <div className="text-xs italic opacity-60">{edu.startDate} - {edu.endDate}</div>
                </div>
              ))}
            </section>
          )}
          {skills && (
            <section>
              <h3 className="text-lg font-bold bg-primary text-white px-3 py-1 mb-4 rounded-r-md inline-block">Skills</h3>
              <p className="text-sm leading-relaxed border-l-2 border-gray-100 pl-4">{skills}</p>
            </section>
          )}
        </div>
      </div>
    ),

    creative: (
      <div className="font-sans text-slate-800 bg-gradient-to-br from-indigo-50/30 to-white -m-10 p-10 min-h-inherit border-t-[12px] border-indigo-600">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="flex-1">
            <h1 className="text-6xl font-black text-indigo-900 leading-none mb-4 -ml-1">
              {personal_info?.firstName}<br />
              <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">{personal_info?.lastName}</span>
            </h1>
            <p className="text-2xl font-light tracking-[0.15em] uppercase text-slate-500">{personal_info?.jobTitle}</p>
          </div>
          <div className="bg-indigo-900 text-white p-6 rounded-3xl shadow-xl shadow-indigo-100 rotate-2 max-w-xs">
            <div className="space-y-3 text-xs font-medium">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-indigo-800 flex items-center justify-center shrink-0">@</div>
                 <span className="truncate">{personal_info?.email}</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-indigo-800 flex items-center justify-center shrink-0">#</div>
                 <span>{personal_info?.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-indigo-800 flex items-center justify-center shrink-0">L</div>
                 <span>{personal_info?.location}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-8 space-y-12">
             {summary && (
               <section>
                 <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4">The Story</h3>
                 <p className="text-md leading-relaxed font-medium italic opacity-80 border-l-4 border-indigo-100 pl-6">{summary}</p>
               </section>
             )}

             {experience?.length > 0 && (
               <section>
                 <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-6">Chronicles</h3>
                 <div className="space-y-10">
                   {experience.map((exp, i) => (
                     <div key={i} className="relative pl-8 border-l-2 border-indigo-50">
                       <div className="absolute -left-[5px] top-1.5 w-[8px] h-[8px] rounded-full bg-indigo-300"></div>
                       <div className="flex justify-between items-start mb-2">
                         <h4 className="text-xl font-black text-indigo-900">{exp.title}</h4>
                         <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full uppercase italic">{exp.startDate} - {exp.endDate}</span>
                       </div>
                       <p className="text-sm font-black text-indigo-600 mb-4">{exp.company}</p>
                       <div className="text-sm font-medium leading-relaxed opacity-70">{renderList(exp.description)}</div>
                     </div>
                   ))}
                 </div>
               </section>
             )}
          </div>

          <div className="col-span-4 space-y-12">
             {education?.length > 0 && (
               <section>
                 <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-6">Education</h3>
                 <div className="space-y-6">
                   {education.map((edu, i) => (
                     <div key={i}>
                       <h4 className="text-sm font-black text-indigo-950 mb-1">{edu.school}</h4>
                       <p className="text-xs font-bold text-indigo-600 mb-2">{edu.degree}</p>
                       <p className="text-[10px] opacity-40 uppercase font-black">{edu.startDate} - {edu.endDate}</p>
                     </div>
                   ))}
                 </div>
               </section>
             )}

             {skills && (
               <section>
                 <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-6">Expertise</h3>
                 <div className="flex flex-wrap gap-2">
                   {skills.split(',').map((skill, i) => (
                     <span key={i} className="px-3 py-1.5 bg-white border border-indigo-100 rounded-xl text-xs font-bold text-indigo-900 shadow-sm">{skill.trim()}</span>
                   ))}
                 </div>
               </section>
             )}
          </div>
        </div>
      </div>
    ),

    elegant: (
      <div className="font-serif text-slate-800 px-4">
        <header className="text-center mb-10 border-b border-slate-200 pb-10">
          <h1 className="text-5xl font-light italic mb-4 tracking-tight">
            {personal_info?.firstName} <span className="font-bold not-italic">{personal_info?.lastName}</span>
          </h1>
          <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-[0.2em] text-slate-500 font-sans font-semibold">
            <span>{personal_info?.email}</span>
            <span>{personal_info?.phone}</span>
            <span>{personal_info?.location}</span>
          </div>
        </header>

        {summary && (
          <section className="mb-10 max-w-2xl mx-auto text-center">
            <p className="text-lg leading-relaxed font-light italic text-slate-600">{summary}</p>
          </section>
        )}

        {experience?.length > 0 && (
          <section className="mb-12">
            <h3 className="text-center text-sm font-bold uppercase tracking-[0.4em] text-slate-400 mb-8 flex items-center justify-center gap-6">
              <span className="h-px bg-slate-200 flex-1"></span> Experience <span className="h-px bg-slate-200 flex-1"></span>
            </h3>
            <div className="space-y-10">
              {experience.map((exp, i) => (
                <div key={i} className="max-w-2xl mx-auto">
                   <div className="flex justify-between items-end mb-2 border-b border-slate-50 pb-2">
                     <h4 className="text-xl font-bold text-slate-900">{exp.title}</h4>
                     <span className="text-xs font-sans font-bold uppercase tracking-widest text-slate-400">{exp.startDate} - {exp.endDate}</span>
                   </div>
                   <div className="text-sm font-bold text-slate-500 italic mb-4">{exp.company}</div>
                   <div className="font-sans text-sm leading-relaxed opacity-80">{renderList(exp.description)}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-12 max-w-2xl mx-auto">
          {education?.length > 0 && (
            <section>
               <h3 className="text-sm font-bold uppercase tracking-[0.4em] text-slate-400 mb-6 border-b border-slate-100 pb-2">Education</h3>
               {education.map((edu, i) => (
                 <div key={i} className="mb-4">
                   <h4 className="font-bold text-md text-slate-800 mb-1">{edu.school}</h4>
                   <p className="text-sm italic mb-1">{edu.degree}</p>
                   <p className="text-[10px] font-sans uppercase font-bold text-slate-300">{edu.startDate} - {edu.endDate}</p>
                 </div>
               ))}
            </section>
          )}
          {skills && (
            <section>
               <h3 className="text-sm font-bold uppercase tracking-[0.4em] text-slate-400 mb-6 border-b border-slate-100 pb-2">Skills</h3>
               <p className="text-sm font-sans leading-relaxed text-slate-600 font-medium">{skills}</p>
            </section>
          )}
        </div>
      </div>
    ),

    compact: (
      <div className="font-sans text-xs text-black p-2 leading-tight">
        <header className="flex justify-between items-center border-b-[3px] border-black pb-2 mb-3">
          <h1 className="text-2xl font-black uppercase tracking-tighter shrink-0">{personal_info?.firstName} {personal_info?.lastName}</h1>
          <div className="text-right font-bold flex flex-wrap justify-end gap-x-2">
            <span>{personal_info?.email}</span>
            <span>|</span>
            <span>{personal_info?.phone}</span>
            <span>|</span>
            <span>{personal_info?.location}</span>
          </div>
        </header>

        {summary && (
          <section className="mb-3">
            <h3 className="font-black uppercase bg-black text-white px-1 mb-1 tracking-widest">Professional Summary</h3>
            <p className="font-medium px-1">{summary}</p>
          </section>
        )}

        {experience?.length > 0 && (
          <section className="mb-3">
            <h3 className="font-black uppercase bg-black text-white px-1 mb-2 tracking-widest">Experience</h3>
            <div className="space-y-3">
              {experience.map((exp, i) => (
                <div key={i} className="px-1">
                  <div className="flex justify-between items-center font-black">
                    <span className="uppercase">{exp.title}</span>
                    <span className="text-[10px] uppercase font-bold">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="font-bold italic">{exp.company}</div>
                  <div className="mt-1">{renderList(exp.description)}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-3 mb-3">
          {education?.length > 0 && (
            <section>
              <h3 className="font-black uppercase bg-black text-white px-1 mb-1 tracking-widest">Education</h3>
              <div className="space-y-2 px-1">
                {education.map((edu, i) => (
                  <div key={i}>
                    <div className="font-black">{edu.school}</div>
                    <p className="font-bold italic">{edu.degree}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          {skills && (
            <section>
              <h3 className="font-black uppercase bg-black text-white px-1 mb-1 tracking-widest">Expertise</h3>
              <p className="font-bold px-1">{skills}</p>
            </section>
          )}
        </div>
      </div>
    ),

    bold: (
      <div className="font-sans text-slate-900 border-[16px] border-slate-100 -m-10 p-10 min-h-inherit">
        <header className="mb-12 border-b-8 border-slate-900 pb-8">
          <h1 className="text-7xl font-black uppercase tracking-tighter leading-[0.8]">
            {personal_info?.firstName}<br />
            {personal_info?.lastName}
          </h1>
          <div className="mt-8 flex flex-col gap-1 font-black text-sm uppercase text-slate-500">
            <p>{personal_info?.jobTitle}</p>
            <div className="h-2 w-20 bg-primary mt-2"></div>
          </div>
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 text-[10px] font-black uppercase tracking-widest">
            <div>Email<br /><span className="text-slate-900">{personal_info?.email}</span></div>
            <div>Phone<br /><span className="text-slate-900">{personal_info?.phone}</span></div>
            <div>Location<br /><span className="text-slate-900">{personal_info?.location}</span></div>
            <div>Portfolio<br /><span className="text-slate-900 truncate block">{personal_info?.website}</span></div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-12">
           {summary && (
             <section className="bg-slate-900 text-white p-6 rounded-2xl">
               <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-4 opacity-40">Profile</h3>
               <p className="text-md leading-relaxed font-bold">{summary}</p>
             </section>
           )}

           {experience?.length > 0 && (
             <section>
               <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-300 mb-8 border-b-2 border-slate-100 pb-2">Career History</h3>
               <div className="space-y-12">
                 {experience.map((exp, i) => (
                   <div key={i} className="grid grid-cols-12 gap-8">
                      <div className="col-span-3 text-xs font-black uppercase tracking-widest text-slate-400 mt-1">{exp.startDate} - {exp.endDate}</div>
                      <div className="col-span-9">
                        <h4 className="text-2xl font-black uppercase text-slate-900 mb-1">{exp.title}</h4>
                        <div className="text-sm font-black text-primary uppercase mb-4">{exp.company}</div>
                        <div className="text-sm font-bold leading-relaxed">{renderList(exp.description)}</div>
                      </div>
                   </div>
                 ))}
               </div>
             </section>
           )}

           <div className="grid grid-cols-2 gap-12">
             {education?.length > 0 && (
               <section>
                 <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-300 mb-6 border-b-2 border-slate-100 pb-2">Academic</h3>
                 {education.map((edu, i) => (
                   <div key={i} className="mb-6">
                      <h4 className="font-black text-lg uppercase mb-1">{edu.school}</h4>
                      <p className="text-xs font-bold uppercase text-primary mb-1">{edu.degree}</p>
                      <span className="text-[10px] font-black opacity-30 uppercase">{edu.startDate} - {edu.endDate}</span>
                   </div>
                 ))}
               </section>
             )}
             {skills && (
               <section>
                 <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-300 mb-6 border-b-2 border-slate-100 pb-2">Skills</h3>
                 <div className="flex flex-wrap gap-2 pt-2">
                   {skills.split(',').map((skill, i) => (
                     <span key={i} className="px-3 py-1 bg-slate-100 font-black uppercase text-[10px] rounded-lg">{skill.trim()}</span>
                   ))}
                 </div>
               </section>
             )}
           </div>
        </div>
      </div>
    ),

    sidebar: (
      <div className="font-sans text-slate-900 flex flex-col md:flex-row -m-10 min-h-inherit h-full">
        {/* Left Sidebar */}
        <aside className="w-full md:w-[280px] bg-slate-900 text-white p-10 shrink-0">
          <div className="mb-10">
             <h1 className="text-4xl font-black uppercase leading-none mb-2">
               {personal_info?.firstName}<br />
               {personal_info?.lastName}
             </h1>
             <p className="text-xs font-bold uppercase tracking-widest text-primary">{personal_info?.jobTitle}</p>
          </div>

          <section className="mb-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Contact</h3>
            <div className="space-y-4 text-xs font-bold break-all">
              <div><p className="opacity-40 mb-1">Email</p><p>{personal_info?.email}</p></div>
              <div><p className="opacity-40 mb-1">Phone</p><p>{personal_info?.phone}</p></div>
              <div><p className="opacity-40 mb-1">Location</p><p>{personal_info?.location}</p></div>
              {personal_info?.linkedin && <div><p className="opacity-40 mb-1">LinkedIn</p><p>{personal_info.linkedin}</p></div>}
            </div>
          </section>

          {skills && (
            <section className="mb-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Skills</h3>
              <div className="flex flex-col gap-2">
                {skills.split(',').map((skill, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="text-xs font-bold">{skill.trim()}</span>
                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-full opacity-60"></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {education?.length > 0 && (
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Education</h3>
              <div className="space-y-6">
                {education.map((edu, i) => (
                  <div key={i}>
                    <p className="text-xs font-black mb-1">{edu.school}</p>
                    <p className="text-[10px] opacity-60 italic mb-1">{edu.degree}</p>
                    <p className="text-[9px] font-black uppercase tracking-wider text-primary">{edu.startDate} - {edu.endDate}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>

        {/* Right Content */}
        <div className="flex-1 bg-white p-10 py-12">
          {summary && (
            <section className="mb-12">
               <h2 className="text-sm font-black uppercase tracking-[.4em] text-slate-300 mb-6">Profile</h2>
               <p className="text-base leading-relaxed font-medium text-slate-700">{summary}</p>
            </section>
          )}

          {experience?.length > 0 && (
            <section>
               <h2 className="text-sm font-black uppercase tracking-[.4em] text-slate-300 mb-8">History</h2>
               <div className="space-y-10">
                 {experience.map((exp, i) => (
                   <div key={i}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors">{exp.title}</h4>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 shrink-0">{exp.startDate} — {exp.endDate}</span>
                      </div>
                      <p className="text-sm font-bold text-primary italic mb-4">{exp.company}</p>
                      <div className="text-[14px] leading-relaxed text-slate-600 font-medium">{renderList(exp.description)}</div>
                   </div>
                 ))}
               </div>
            </section>
          )}
        </div>
      </div>
    )
  };

  return (
    <div className="bg-white text-black min-h-[1056px] w-[816px] origin-top mx-auto p-10 shadow-sm font-sans shrink-0 border border-slate-200 print:w-full print:min-h-0 print:h-auto print:border-none print:shadow-none print:p-0 overflow-hidden" id="resume-preview">
      {templates[template_id] || templates.modern}
    </div>
  );
}
