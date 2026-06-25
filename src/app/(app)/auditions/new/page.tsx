import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AuditionForm } from "@/components/auditions/AuditionForm";
import { createAudition, updateAudition, deleteAudition } from "../actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Log Audition" };

export default async function NewAuditionPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;
  const { edit } = await searchParams;

  const [clients, projects, existing] = await Promise.all([
    db.client.findMany({ where: { userId }, orderBy: { name: "asc" } }),
    db.project.findMany({ where: { userId }, orderBy: { name: "asc" } }),
    edit ? db.audition.findUnique({ where: { id: edit, userId } }) : null,
  ]);

  const action = existing ? updateAudition.bind(null, existing.id) : createAudition;

  return (
    <div className="max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/auditions"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Auditions</Link>
      </Button>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{existing ? "Edit Audition" : "Log Audition"}</CardTitle>
            {existing && (
              <form action={async () => { "use server"; await deleteAudition(existing.id); }}>
                <Button type="submit" variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </form>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <AuditionForm
            action={action}
            clients={clients}
            projects={projects}
            defaultValues={existing ? {
              clientId: existing.clientId || "",
              projectId: existing.projectId || "",
              castingSource: existing.castingSource || "",
              role: existing.role || "",
              submittedAt: existing.submittedAt,
              callbackAt: existing.callbackAt,
              status: existing.status,
              notes: existing.notes || "",
              followUpAt: existing.followUpAt,
            } : {}}
            submitLabel={existing ? "Save Changes" : "Log Audition"}
          />
        </CardContent>
      </Card>
    </div>
  );
}
