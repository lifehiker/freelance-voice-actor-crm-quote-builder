import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Phone, Globe, Trash2, FileText, FolderOpen } from "lucide-react";
import { ClientForm } from "@/components/clients/ClientForm";
import { updateClient, deleteClient } from "../actions";
import { format } from "date-fns";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const client = await db.client.findUnique({
    where: { id, userId: session.user.id },
    include: {
      quotes: { orderBy: { createdAt: "desc" }, take: 5 },
      projects: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  if (!client) notFound();

  const updateWithId = updateClient.bind(null, id);

  const statusColors: Record<string, string> = {
    draft: "secondary", sent: "default", accepted: "default", rejected: "destructive", expired: "secondary",
    lead: "secondary", quoted: "default", booked: "default", delivered: "default", invoiced: "default", paid: "default", lost: "destructive",
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/clients"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Clients</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Edit Client</CardTitle>
            </CardHeader>
            <CardContent>
              <ClientForm
                action={updateWithId}
                defaultValues={{
                  name: client.name,
                  company: client.company || "",
                  email: client.email || "",
                  phone: client.phone || "",
                  website: client.website || "",
                  source: client.source || "",
                  notes: client.notes || "",
                }}
                submitLabel="Save Changes"
              />
            </CardContent>
          </Card>

          {client.quotes.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Recent Quotes</CardTitle>
                <Link href={`/quotes?clientId=${client.id}`} className="text-sm text-primary hover:underline">View all</Link>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {client.quotes.map((q) => (
                    <li key={q.id} className="flex items-center justify-between">
                      <Link href={`/quotes/${q.id}`} className="text-sm font-medium hover:underline">{q.quoteNumber}</Link>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">${q.total.toFixed(2)}</span>
                        <Badge variant={statusColors[q.status] as any} className="text-xs capitalize">{q.status}</Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Contact Info</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {client.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${client.email}`} className="hover:underline">{client.email}</a>
                </div>
              )}
              {client.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{client.phone}</span>
                </div>
              )}
              {client.website && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a href={client.website} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">{client.website}</a>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Button asChild className="w-full" size="sm">
              <Link href={`/quotes/new?clientId=${client.id}`}>
                <FileText className="mr-2 h-4 w-4" /> New Quote
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full" size="sm">
              <Link href={`/projects/new?clientId=${client.id}`}>
                <FolderOpen className="mr-2 h-4 w-4" /> New Project
              </Link>
            </Button>
            <form action={async () => { "use server"; await deleteClient(id); }}>
              <Button type="submit" variant="destructive" className="w-full" size="sm">
                <Trash2 className="mr-2 h-4 w-4" /> Delete Client
              </Button>
            </form>
          </div>

          <Card>
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground">
                Added {format(new Date(client.createdAt), "MMMM d, yyyy")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
