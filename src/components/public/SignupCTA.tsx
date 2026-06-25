import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface SignupCTAProps {
  headline?: string;
  subtext?: string;
}

export function SignupCTA({ headline = "Save quotes, track auditions, export PDFs", subtext = "Create a free account to save your work. No credit card required." }: SignupCTAProps) {
  return (
    <div className="rounded-xl bg-primary/5 border border-primary/20 p-6 text-center">
      <h3 className="text-lg font-bold mb-2">{headline}</h3>
      <p className="text-muted-foreground text-sm mb-4">{subtext}</p>
      <Button asChild>
        <Link href="/signup">
          Create free account <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
      <p className="text-xs text-muted-foreground mt-3">Free plan: 3 clients, 3 quotes, 10 auditions.</p>
    </div>
  );
}
