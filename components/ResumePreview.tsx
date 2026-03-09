export default function ResumePreview({ data }: { data: any }) {
  const { personal_info, summary, experience, education, skills } = data || {};

  return (
    <div className="bg-white text-black min-h-[1056px] w-[816px] origin-top mx-auto p-10 shadow-sm font-sans shrink-0 border border-slate-200 print:w-full print:min-h-0 print:h-auto print:border-none print:shadow-none print:p-0" id="resume-preview">
      {/* Header */}
      <header className="text-center border-b-2 border-slate-300 pb-4 mb-4 mt-2">
        <h1 className="text-3xl font-bold uppercase tracking-wider mb-1">
          {personal_info?.firstName || "First"}{" "}
          {personal_info?.lastName || "Last"}
        </h1>
        {personal_info?.jobTitle && (
          <h2 className="text-lg text-slate-600 font-medium mb-2">{personal_info.jobTitle}</h2>
        )}
        <div className="flex flex-wrap justify-center items-center gap-3 text-sm text-slate-600">
          {personal_info?.email && <span>{personal_info.email}</span>}
          {personal_info?.email && personal_info?.phone && <span>•</span>}
          {personal_info?.phone && <span>{personal_info.phone}</span>}
          {personal_info?.phone && personal_info?.location && <span>•</span>}
          {personal_info?.location && <span>{personal_info.location}</span>}
          {personal_info?.linkedin && (
            <>
              <span>•</span>
              <span>{personal_info.linkedin}</span>
            </>
          )}
          {personal_info?.website && (
            <>
              <span>•</span>
              <span>{personal_info.website}</span>
            </>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-6">
          <h3 className="text-lg font-bold uppercase border-b border-slate-200 mb-2 pb-1 text-slate-800">Professional Summary</h3>
          <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && experience.some((exp: any) => exp.title || exp.company) && (
        <section className="mb-6">
          <h3 className="text-lg font-bold uppercase border-b border-slate-200 mb-3 pb-1 text-slate-800">Experience</h3>
          <div className="space-y-4">
            {experience.map((exp: any, index: number) => {
              if (!exp.title && !exp.company) return null;
              return (
                <div key={index}>
                  <div className="flex justify-between items-baseline font-medium mb-1">
                    <h4 className="text-[15px] font-bold text-slate-900">{exp.title}</h4>
                    <span className="text-sm text-slate-600 whitespace-nowrap font-medium">
                      {exp.startDate} {exp.startDate && exp.endDate && "—"} {exp.endDate}
                    </span>
                  </div>
                  <div className="text-sm italic text-slate-700 mb-2">{exp.company}</div>
                  {exp.description && (
                     <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap pl-2">
                        {exp.description.split('\n').map((line: string, i: number) => {
                           if (!line.trim()) return null;
                           return (
                             <div key={i} className="flex gap-2 mb-1">
                               <span className="text-slate-400 select-none font-bold mr-1">•</span>
                               <span>{line.trim().replace(/^[•-]\s*/, '')}</span>
                             </div>
                           );
                        })}
                     </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && education.some((edu: any) => edu.school || edu.degree) && (
        <section className="mb-6">
          <h3 className="text-lg font-bold uppercase border-b border-slate-200 mb-3 pb-1 text-slate-800">Education</h3>
          <div className="space-y-3">
            {education.map((edu: any, index: number) => {
              if (!edu.school && !edu.degree) return null;
              return (
                <div key={index}>
                  <div className="flex justify-between items-baseline font-medium mb-1">
                    <h4 className="text-[15px] font-bold text-slate-900">{edu.school}</h4>
                    <span className="text-sm text-slate-600 whitespace-nowrap font-medium">
                      {edu.startDate} {edu.startDate && edu.endDate && "—"} {edu.endDate}
                    </span>
                  </div>
                  <div className="text-sm text-slate-800 font-medium mb-1">{edu.degree}</div>
                  {edu.description && <p className="text-sm text-slate-600 mt-1">{edu.description}</p>}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && (
        <section className="mb-6">
          <h3 className="text-lg font-bold uppercase border-b border-slate-200 mb-2 pb-1 text-slate-800">Skills</h3>
          <p className="text-sm leading-relaxed text-slate-700">{skills}</p>
        </section>
      )}
    </div>
  );
}
