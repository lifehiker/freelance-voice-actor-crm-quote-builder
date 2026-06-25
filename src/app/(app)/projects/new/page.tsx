import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { createProject } from "../actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "New Project" };

export default async function NewProjectPage({ searchParams }: { searchParams: Promise<{ clientId?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const { clientId } = await searchParams;

  const clients = await db.client.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/projects"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects</Link>
      </Button>
      <Card>
        <CardHeader><CardTitle>New Project</CardTitle></CardHeader>
        <CardContent>
          <ProjectForm
            action={createProject}
            clients={clients}
            defaultValues={{ clientId: clientId || "" }}
            submitLabel="Create Project"
          />
        </CardContent>
      </Card>
    </div>
  );
}
