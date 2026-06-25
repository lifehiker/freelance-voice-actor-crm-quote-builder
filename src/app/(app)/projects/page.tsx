import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FolderOpen } from "lucide-react";
import { PROJECT_STATUSES } from "@/lib/constants";
import { format } from "date-fns";

export const metadata = { title: "Projects" };

const statusColors: Record<string, "default" | "secondary" | "destructive"> = {
  lead: "secondary", quoted: "default", booked: "default", delivered: "default",
  invoiced: "default", paid: "default", lost: "destructive",
};

export default async function ProjectsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const projects = await db.project.findMany({
    where: { userId: session.user.id },
    include: { client: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
        </div>
        <Button asChild>
          <Link href="/projects/new"><Plus className="mr-2 h-4 w-4" /> New Project</Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FolderOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="font-semibold">No projects yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Create your first project to track work.</p>
            <Button asChild className="mt-4">
              <Link href="/projects/new"><Plus className="mr-2 h-4 w-4" /> New Project</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold truncate flex-1">{project.name}</h3>
                    <Badge variant={statusColors[project.status] || "secondary"} className="ml-2 capitalize text-xs">
                      {PROJECT_STATUSES.find(s => s.value === project.status)?.label || project.status}
                    </Badge>
                  </div>
                  {project.client && (
                    <p className="text-sm text-muted-foreground">{project.client.name}</p>
                  )}
                  {project.type && (
                    <p className="text-xs text-muted-foreground mt-1 capitalize">{project.type.replace(/_/g, " ")}</p>
                  )}
                  {project.dueDate && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Due: {format(new Date(project.dueDate), "MMM d, yyyy")}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
