import { defineTool } from "@lovable.dev/mcp-js";
import { calendarEvents } from "@/lib/data";

export default defineTool({
  name: "list_calendar_events",
  title: "List community calendar events",
  description: "List upcoming community events relevant to people of determination.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(calendarEvents, null, 2) }],
    structuredContent: { items: calendarEvents },
  }),
});
