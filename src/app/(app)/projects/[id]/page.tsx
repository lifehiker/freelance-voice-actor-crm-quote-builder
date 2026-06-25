import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trash2, FileText } from "lucide-react";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { updateProject, deleteProject } from "../actions";
import { PROJECT_STATUSES } from "@/lib/constants";
import { format } from "date-fns";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [project, clients] = await Promise.all([
    db.project.findUnique({
      where: { id, userId: session.user.id },
      include: { client: true, quotes: { include: { client: true }, orderBy: { createdAt: "desc" }, take: 5 } },
    }),
    db.client.findMany({ where: { userId: session.user.id }, orderBy: { name: "asc" } }),
  ]);

  if (!project) notFound();

  const updateWithId = updateProject.bind(null, id);

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/projects"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader><CardTitle>Edit Project</CardTitle></CardHeader>
            <CardContent>
              <ProjectForm
                action={updateWithId}
                clients={clients}
                defaultValues={{
                  name: project.name,
                  clientId: project.clientId || "",
                  type: project.type || "",
                  status: project.status,
                  dueDate: project.dueDate,
                  followUpAt: project.followUpAt,
                  notes: project.notes || "",
                }}
                submitLabel="Save Changes"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="pt-4 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Status</p>
                <Badge className="mt-1 capitalize">
                  {PROJECT_STATUSES.find(s => s.value === project.status)?.label || project.status}
                </Badge>
              </div>
              {project.client && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Client</p>
                  <Link href={`/clients/${project.client.id}`} className="text-sm font-medium hover:underline">
                    {project.client.name}
                  </Link>
                </div>
              )}
              {project.dueDate && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Due Date</p>
                  <p className="text-sm">{format(new Date(project.dueDate), "MMMM d, yyyy")}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Button asChild className="w-full" size="sm">
            <Link href={`/quotes/new?projectId=${id}`}>
              <FileText className="mr-2 h-4 w-4" /> New Quote
            </Link>
          </Button>

          <form action={async () => { "use server"; await deleteProject(id); }}>
            <Button type="submit" variant="destructive" className="w-full" size="sm">
              <Trash2 className="mr-2 h-4 w-4" /> Delete Project
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
