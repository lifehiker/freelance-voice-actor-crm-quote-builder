import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, User, Building, Mail } from "lucide-react";
import { getPlan } from "@/lib/permissions";
import { PLAN_LIMITS } from "@/lib/constants";

export const metadata = { title: "Clients" };

export default async function ClientsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const [user, clients] = await Promise.all([
    db.user.findUnique({ where: { id: userId }, include: { subscription: true } }),
    db.client.findMany({
      where: { userId },
      orderBy: { name: "asc" },
      include: { _count: { select: { quotes: true, projects: true } } },
    }),
  ]);

  const plan = getPlan(user?.subscription);
  const limit = PLAN_LIMITS[plan].clients;
  const atLimit = clients.length >= limit;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-muted-foreground">
            {clients.length} client{clients.length !== 1 ? "s" : ""}
            {plan === "free" && ` (${clients.length}/${limit} on free plan)`}
          </p>
        </div>
        {atLimit && plan === "free" ? (
          <Button asChild variant="outline">
            <Link href="/pricing">Upgrade to Add More</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href="/clients/new">
              <Plus className="mr-2 h-4 w-4" /> Add Client
            </Link>
          </Button>
        )}
      </div>

      {clients.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <User className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="font-semibold">No clients yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Add your first client to get started.</p>
            <Button asChild className="mt-4">
              <Link href="/clients/new"><Plus className="mr-2 h-4 w-4" /> Add Client</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Link key={client.id} href={`/clients/${client.id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{client.name}</h3>
                      {client.company && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <Building className="h-3 w-3" />
                          <span className="truncate">{client.company}</span>
                        </div>
                      )}
                      {client.email && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{client.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-3">
                    <span className="text-xs text-muted-foreground">{client._count.quotes} quote{client._count.quotes !== 1 ? "s" : ""}</span>
                    <span className="text-xs text-muted-foreground">{client._count.projects} project{client._count.projects !== 1 ? "s" : ""}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
