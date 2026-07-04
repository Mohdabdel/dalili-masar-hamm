import { defineMcp } from "@lovable.dev/mcp-js";
import listActivities from "./tools/list-activities";
import listMessages from "./tools/list-messages";
import listResources from "./tools/list-resources";
import listCalendar from "./tools/list-calendar";

export default defineMcp({
  name: "daleeli-masar-himam-mcp",
  title: "Daleeli - Masar Himam MCP",
  version: "0.1.0",
  instructions:
    "Tools for the Daleeli - Masar Himam transitional-planning app: browse daily-living activities, interpreted-behavior guidance, UAE institutional resources, and the community events calendar.",
  tools: [listActivities, listMessages, listResources, listCalendar],
});
