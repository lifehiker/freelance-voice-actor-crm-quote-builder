"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AUDITION_STATUSES } from "@/lib/constants";
import { useState } from "react";
import { format } from "date-fns";

interface AuditionFormProps {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    clientId?: string;
    projectId?: string;
    castingSource?: string;
    role?: string;
    submittedAt?: Date | null;
    callbackAt?: Date | null;
    status?: string;
    notes?: string;
    followUpAt?: Date | null;
  };
  clients: Array<{ id: string; name: string }>;
  projects: Array<{ id: string; name: string }>;
  submitLabel?: string;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? "Saving..." : label}</Button>;
}

export function AuditionForm({ action, defaultValues, clients, projects, submitLabel = "Save Audition" }: AuditionFormProps) {
  const [status, setStatus] = useState(defaultValues?.status || "planned");
  const [clientId, setClientId] = useState(defaultValues?.clientId || "");
  const [projectId, setProjectId] = useState(defaultValues?.projectId || "");
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
      <input type="hidden" name="clientId" value={clientId} />
      <input type="hidden" name="projectId" value={projectId} />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="role">Role / Project Name *</Label>
          <Input id="role" name="role" defaultValue={defaultValues?.role || ""} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="castingSource">Casting Source</Label>
          <Input id="castingSource" name="castingSource" defaultValue={defaultValues?.castingSource || ""} placeholder="e.g., Voice123, direct email..." />
        </div>
        <div className="space-y-2">
          <Label>Client</Label>
          <Select value={clientId} onValueChange={setClientId}>
            <SelectTrigger><SelectValue placeholder="Link to client" /></SelectTrigger>
            <SelectContent>
              {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Project</Label>
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger><SelectValue placeholder="Link to project" /></SelectTrigger>
            <SelectContent>
              {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {AUDITION_STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="submittedAt">Submitted Date</Label>
          <Input id="submittedAt" name="submittedAt" type="date"
            defaultValue={defaultValues?.submittedAt ? format(new Date(defaultValues.submittedAt), "yyyy-MM-dd") : ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="callbackAt">Callback Date</Label>
          <Input id="callbackAt" name="callbackAt" type="date"
            defaultValue={defaultValues?.callbackAt ? format(new Date(defaultValues.callbackAt), "yyyy-MM-dd") : ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="followUpAt">Follow-up Date</Label>
          <Input id="followUpAt" name="followUpAt" type="date"
            defaultValue={defaultValues?.followUpAt ? format(new Date(defaultValues.followUpAt), "yyyy-MM-dd") : ""} />
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
