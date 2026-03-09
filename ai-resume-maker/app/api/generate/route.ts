import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { prompt, type } = await request.json();
    
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key') {
      return NextResponse.json({ error: "Groq API key not configured" }, { status: 500 });
    }

    let systemPrompt = "You are an expert resume writer and career coach.";
    if (type === "summary") {
      systemPrompt += " Write a compelling, professional summary (3-4 sentences max) based on the user's details. Do not use buzzwords like 'synergy' or 'ninja'. Do not include any introductory text, just the summary itself.";
    } else if (type === "experience") {
      systemPrompt += " Improve the user's experience description. Turn it into powerful, action-oriented bullet points suitable for an ATS-friendly resume. Focus on quantifiable achievements rather than responsibilities. Do not include any introductory words, just the bullet points.";
    } else {
      systemPrompt += " Suggest up to 10 highly relevant skills based on the context. Return them as a comma-separated list without any introductory text.";
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API error:", errorData);
      return NextResponse.json({ error: "Failed to generate AI content" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ result: data.choices[0].message.content });

  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
