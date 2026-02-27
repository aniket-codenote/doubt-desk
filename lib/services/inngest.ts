import { Inngest } from "inngest";

const isDev =
  process.env.NODE_ENV === "development" && process.env.INNGEST_DEV !== "false";

export const inngest = new Inngest({
  id: "doubt-desk", 
  name: "Doubt Desk",
  isDev,
  eventKey: process.env.INNGEST_EVENT_KEY,
  ...(isDev && process.env.INNGEST_BASE_URL
    ? { baseUrl: process.env.INNGEST_BASE_URL }
    : {}),
});
