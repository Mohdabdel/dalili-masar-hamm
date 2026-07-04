import { defineTool } from "@lovable.dev/mcp-js";
import { resources } from "@/lib/data";

export default defineTool({
  name: "list_resources",
  title: "List institutional resources",
  description:
    "List UAE institutional resources for people of determination (entity, steps to access, benefits).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(resources, null, 2) }],
    structuredContent: { items: resources },
  }),
});
