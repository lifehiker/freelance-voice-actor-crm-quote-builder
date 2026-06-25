import { ClientForm } from "@/components/clients/ClientForm";
import { createClient } from "../actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "New Client" };

export default function NewClientPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/clients"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Clients</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Add New Client</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientForm action={createClient} submitLabel="Add Client" />
        </CardContent>
      </Card>
    </div>
  );
}
