import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="state-page">
      <h1>Trip not found</h1>
      <p>The page you are looking for is not available.</p>
      <Button asChild>
        <Link href="/">Return home</Link>
      </Button>
    </main>
  );
}
