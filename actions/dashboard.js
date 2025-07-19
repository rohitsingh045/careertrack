"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateAIInsights = async (industry) => {
  const prompt = `
    Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
    {
      "salaryRanges": [
        { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
      ],
      "growthRate": number,
      "demandLevel": "High" | "Medium" | "Low",
      "topSkills": ["skill1", "skill2"],
      "marketOutlook": "Positive" | "Neutral" | "Negative",
      "keyTrends": ["trend1", "trend2"],
      "recommendedSkills": ["skill1", "skill2"]
    }

    IMPORTANT: Return ONLY valid JSON. No markdown, no text. At least 5 roles, skills, and trends.
  `;

  const result = await model.generateContent(prompt);
  const text = await result.response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  let insights;
  try {
    insights = JSON.parse(cleanedText);
  } catch (err) {
    console.error("Failed to parse AI response:", err);
    throw new Error("AI returned invalid JSON");
  }

  // Normalize enums for Prisma
  insights.demandLevel = insights.demandLevel?.toUpperCase();
  insights.marketOutlook = insights.marketOutlook?.toUpperCase();

  return insights;
};

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsights: true,
    },
  });

  if (!user) throw new Error("User not found");

  if (!user.industryInsights) {
    const insights = await generateAIInsights(user.industry);

    const industryInsight = await db.industryInsights.create({
      data: {
        industry: user.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return industryInsight;
  }

  return user.industryInsights;
}
