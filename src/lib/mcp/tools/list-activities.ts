import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { homeEvents } from "@/lib/data";

export default defineTool({
  name: "list_activities",
  title: "List activities",
  description:
    "List daily-living activities (home or community) with steps, duration, requirements, and fun hooks.",
  inputSchema: {
    category: z
      .enum(["home", "community", "all"])
      .default("all")
      .describe("Filter by activity category."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category }) => {
    const items =
      category === "all" ? homeEvents : homeEvents.filter((e) => e.category === category);
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { items },
    };
  },
});
