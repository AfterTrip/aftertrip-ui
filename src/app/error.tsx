"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="state-page">
      <h1>Something went off route.</h1>
      <p>Please try loading AfterTrip again.</p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
