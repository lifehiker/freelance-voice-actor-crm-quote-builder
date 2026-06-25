"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button variant="outline" onClick={handleCopy}>
      {copied ? "Copied!" : "Copy Template"}
    </Button>
  );
}
