"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CLIENT_SOURCES } from "@/lib/constants";
import { useState } from "react";

interface ClientFormProps {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    name?: string;
    company?: string;
    email?: string;
    phone?: string;
    website?: string;
    source?: string;
    notes?: string;
  };
  submitLabel?: string;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : label}
    </Button>
  );
}

export function ClientForm({ action, defaultValues, submitLabel = "Save Client" }: ClientFormProps) {
  const [source, setSource] = useState(defaultValues?.source || "");
  const [error, setError] = useState("");

  async function handleAction(formData: FormData) {
    try {
      setError("");
      await action(formData);
    } catch (e: any) {
      setError(e.message || "An error occurred");
    }
  }

  return (
    <form action={handleAction} className="space-y-4">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" name="name" defaultValue={defaultValues?.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" defaultValue={defaultValues?.company || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={defaultValues?.email || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" defaultValue={defaultValues?.phone || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input id="website" name="website" type="url" placeholder="https://" defaultValue={defaultValues?.website || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="source">Lead Source</Label>
          <input type="hidden" name="source" value={source} />
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger>
              <SelectValue placeholder="How did you meet?" />
            </SelectTrigger>
            <SelectContent>
              {CLIENT_SOURCES.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={4} defaultValue={defaultValues?.notes || ""} placeholder="Any additional notes about this client..." />
      </div>
      <div className="flex justify-end gap-3">
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
