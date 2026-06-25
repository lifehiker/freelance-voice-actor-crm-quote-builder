import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { createTemplate, deleteTemplate } from "./actions";

export const metadata = { title: "Usage Templates" };

export default async function TemplatesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const templates = await db.usageTemplate.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { name: "asc" }],
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/settings"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Settings</Link>
        </Button>
      </div>
      <div>
        <h1 className="text-2xl font-bold">Usage Templates</h1>
        <p className="text-muted-foreground">Reusable text templates for usage rights, revision policies, and more.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Add New Template</CardTitle></CardHeader>
        <CardContent>
          <form action={createTemplate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name *</Label>
              <Input id="name" name="name" placeholder="e.g., Web & Social Usage" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" name="category" placeholder="e.g., web_social, broadcast, corporate..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Template Text *</Label>
              <Textarea id="content" name="content" rows={6} placeholder="Enter the template text..." required />
            </div>
            <Button type="submit"><Plus className="mr-2 h-4 w-4" /> Add Template</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Your Templates ({templates.length})</h2>
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-sm font-medium">{template.name}</CardTitle>
                {template.category && (
                  <p className="text-xs text-muted-foreground">{template.category.replace(/_/g, " ")}</p>
                )}
              </div>
              <div className="flex gap-2">
                {template.isDefault && (
                  <span className="text-xs bg-muted px-2 py-0.5 rounded">Default</span>
                )}
                <form action={deleteTemplate.bind(null, template.id)}>
                  <Button type="submit" variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </form>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{template.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
