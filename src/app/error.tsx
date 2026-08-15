"use client";

import { useEffect } from "react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section className="flex min-h-[60vh] flex-col justify-center">
      <h1 className="type-display text-display text-hot">Error</h1>
      <p className="mt-6 max-w-[45ch] text-body text-paper">
        Something went wrong loading this page.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Button onClick={reset} variant="solid">
          Try again
        </Button>
        <Button href="/" variant="outline">
          Home
        </Button>
      </div>
    </Section>
  );
}
