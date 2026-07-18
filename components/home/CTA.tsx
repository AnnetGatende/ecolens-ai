import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="bg-green-700 py-24 text-white">

      <div className="mx-auto max-w-4xl px-6 text-center">

        <h2 className="text-5xl font-bold">
          Help Build Cleaner Communities
        </h2>

        <p className="mt-6 text-xl">
          Every report helps identify pollution faster and supports better
          environmental decisions.
        </p>

        <Link href="/report">

          <Button
            size="lg"
            variant="secondary"
            className="mt-10"
          >
            Report Pollution
          </Button>

        </Link>

      </div>

    </section>
  );
}