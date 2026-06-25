import { Badge } from "@/components/ui/badge";
import { AUDITION_STATUSES } from "@/lib/constants";

const statusVariants: Record<string, "default" | "secondary" | "destructive"> = {
  planned: "secondary",
  submitted: "default",
  callback: "default",
  booked: "default",
  rejected: "destructive",
  no_response: "secondary",
};

export function AuditionStatusBadge({ status }: { status: string }) {
  const label = AUDITION_STATUSES.find(s => s.value === status)?.label || status;
  return (
    <Badge variant={statusVariants[status] || "secondary"} className="capitalize text-xs">
      {label}
    </Badge>
  );
}
