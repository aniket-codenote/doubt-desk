import { serve } from "inngest/next";
import { inngest } from "@/lib/services/inngest";
import { processTranscript } from "@/inngest/functions/process-transcript";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    processTranscript,
  ],
});
