import { NextResponse } from "next/server";

interface ResumeData {
  title?: string;
  summary?: string;
  personal_info?: {
    firstName?: string;
    lastName?: string;
    jobTitle?: string;
  };
  experience?: Array<{
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education?: Array<{
    degree: string;
    school: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills?: string;
}

export async function POST(req: Request) {
  try {
    // Check API Key
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "Analysis service is not configured (API Key missing in .env.local)" }, { status: 500 });
    }

    // Handle JSON body for manual text analysis or full resume object from builder
    let resumeContent = "";
    try {
      const body = await req.json();
      const { resume } = body as { resume: string | ResumeData };
      
      if (typeof resume === "string") {
        resumeContent = resume;
      } else if (resume && typeof resume === "object") {
        // Convert complex resume object to readable text for AI
        const pi = resume.personal_info || {};
        const exp = (resume.experience || []).map((e) => 
          `${e.title} at ${e.company}\n${e.startDate} - ${e.endDate}\n${e.description}`
        ).join("\n\n");
        const edu = (resume.education || []).map((e) => 
          `${e.degree} from ${e.school}\n${e.startDate} - ${e.endDate}\n${e.description}`
        ).join("\n\n");
        
        resumeContent = `
          TITLE: ${resume.title || ""}
          NAME: ${pi.firstName || ""} ${pi.lastName || ""}
          JOB TITLE: ${pi.jobTitle || ""}
          SUMMARY: ${resume.summary || ""}
          EXPERIENCE:
          ${exp}
          EDUCATION:
          ${edu}
          SKILLS: ${resume.skills || ""}
        `;
      }
    } catch {
      return NextResponse.json({ error: "Invalid request format. Expected JSON with 'resume' field." }, { status: 400 });
    }

    if (!resumeContent || !resumeContent.trim()) {
      return NextResponse.json({ error: "No readable resume content found for analysis." }, { status: 400 });
    }

    // AI Analysis using Groq
    const { default: Groq } = await import("groq-sdk");
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `
      Analyze the following resume text based SOLELY on its content quality, professional impact, and relevant keywords.
      DO NOT consider the formatting, layout, or structure of the text. Focus on the substance of the experience and skills.
      
      Resume Content: ${resumeContent.substring(0, 8000)} [Truncated if necessary]
      
      Return ONLY a JSON object: { "score": number, "analysis": "string", "suggestions": ["string", "string", ...] }
      The "score" MUST be an integer between 0 and 100.
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are an ATS compliance expert. Respond ONLY with JSON." },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const aiRes = JSON.parse(completion.choices[0].message.content || "{}");
    
    // Scale score to 0-100 if the AI returns a 0-10 value
    let finalScore = Number(aiRes.score) || 0;
    if (finalScore > 0 && finalScore <= 10) {
      finalScore = finalScore * 10;
    }
    aiRes.score = Math.round(finalScore);

    return NextResponse.json({ ...aiRes });

  } catch (error: unknown) {
    const err = error as Error;
    console.error("Critical ATS API ERROR:", err);
    return NextResponse.json({ error: "Server encountered a problem", message: err.message }, { status: 500 });
  }
}
