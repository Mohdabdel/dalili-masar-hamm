import { defineTool } from "@lovable.dev/mcp-js";
import { messages } from "@/lib/data";

export default defineTool({
  name: "list_interpreted_messages",
  title: "List interpreted behavior messages",
  description:
    "List interpreted behaviors: observed behavior, its likely meaning, and a caregiver recommendation.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(messages, null, 2) }],
    structuredContent: { items: messages },
  }),
});
