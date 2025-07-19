import { generateAIInsights } from "@/actions/dashboard";
import { inngest } from "@/lib/inngest/client";
import { serve } from "inngest/next";

// Expose this API handler to Inngest
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    generateAIInsights, // 👈 list your Inngest functions here
  ],
});
