import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { QuoteBuilderForm } from "@/components/quotes/QuoteBuilderForm";
import { createQuote } from "../actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "New Quote" };

export default async function NewQuotePage({ searchParams }: { searchParams: Promise<{ clientId?: string; projectId?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;
  const { clientId, projectId } = await searchParams;

  const [clients, projects, templates] = await Promise.all([
    db.client.findMany({ where: { userId }, orderBy: { name: "asc" } }),
    db.project.findMany({ where: { userId }, orderBy: { name: "asc" } }),
    db.usageTemplate.findMany({ where: { userId }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="max-w-4xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/quotes"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Quotes</Link>
      </Button>
      <div>
        <h1 className="text-2xl font-bold">New Quote</h1>
        <p className="text-muted-foreground">Build a voice-over quote with usage rights, fees, and terms.</p>
      </div>
      <QuoteBuilderForm
        onSubmit={createQuote}
        clients={clients}
        projects={projects}
        templates={templates}
        defaultValues={{ clientId: clientId || "", projectId: projectId || "" }}
        isNew={true}
      />
    </div>
  );
}
