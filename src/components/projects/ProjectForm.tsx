"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PROJECT_STATUSES, PROJECT_TYPES } from "@/lib/constants";
import { useState } from "react";
import { format } from "date-fns";

interface ProjectFormProps {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    name?: string;
    clientId?: string;
    type?: string;
    status?: string;
    dueDate?: Date | null;
    followUpAt?: Date | null;
    notes?: string;
  };
  clients: Array<{ id: string; name: string; company?: string | null }>;
  submitLabel?: string;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? "Saving..." : label}</Button>;
}

export function ProjectForm({ action, defaultValues, clients, submitLabel = "Save Project" }: ProjectFormProps) {
  const [status, setStatus] = useState(defaultValues?.status || "lead");
  const [type, setType] = useState(defaultValues?.type || "");
  const [clientId, setClientId] = useState(defaultValues?.clientId || "");
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
      {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="clientId" value={clientId} />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">Project Name *</Label>
          <Input id="name" name="name" defaultValue={defaultValues?.name} required />
        </div>
        <div className="space-y-2">
          <Label>Client</Label>
          <Select value={clientId} onValueChange={setClientId}>
            <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
            <SelectContent>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}{c.company ? ` — ${c.company}` : ""}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Project Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              {PROJECT_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {PROJECT_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            defaultValue={defaultValues?.dueDate ? format(new Date(defaultValues.dueDate), "yyyy-MM-dd") : ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="followUpAt">Follow-up Date</Label>
          <Input
            id="followUpAt"
            name="followUpAt"
            type="date"
            defaultValue={defaultValues?.followUpAt ? format(new Date(defaultValues.followUpAt), "yyyy-MM-dd") : ""}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={4} defaultValue={defaultValues?.notes || ""} />
      </div>
      <div className="flex justify-end">
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
