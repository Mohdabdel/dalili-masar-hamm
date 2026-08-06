import { createFileRoute, Link } from "@tanstack/react-router";
import { ReminderVisual } from "@/components/ReminderCardPilot";
import { decodePayload } from "@/lib/reminder-assets";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/reminder")({
  validateSearch: (search: Record<string, unknown>) => ({
    c: typeof search["c"] === "string" ? search["c"] : "",
  }),
  head: () => ({
    meta: [
      { title: "بطاقة تذكير | دليلي" },
      { name: "description", content: "عرض بطاقة تذكير بسيطة تتضمن وقت الموعد ومكانه." },
      { property: "og:title", content: "بطاقة تذكير | دليلي" },
      {
        property: "og:description",
        content: "عرض بطاقة تذكير بسيطة تتضمن وقت الموعد ومكانه.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReminderPage,
});

function ReminderPage() {
  const { c } = Route.useSearch();
  const payload = c ? decodePayload(c) : null;

  return (
    <main
      dir="rtl"
      className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 bg-background px-5 py-10"
    >
      <h1 className="sr-only">بطاقة تذكير</h1>
      {payload ? (
        <ReminderVisual title={payload.title} message={payload.resolvedMessage} />
      ) : (
        <p className="text-center text-base font-semibold text-muted-foreground">
          رابط البطاقة غير صالح أو غير مكتمل.
        </p>
      )}
      <Button asChild variant="outline" className="min-h-11">
        <Link to="/">العودة إلى دليلي</Link>
      </Button>
    </main>
  );
}
