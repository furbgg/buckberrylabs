import { Logo } from "@/components/ui/Logo";
import { brand } from "@/lib/config";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="max-w-2xl text-center">
        <Logo variant="full" size="xl" priority className="mx-auto" />

        <span className="mt-10 inline-block rounded-full border border-primary-accent/30 bg-primary-accent/10 px-3 py-1 font-mono text-xs uppercase tracking-wide text-accent-deep">
          Phase 0 · Scaffold
        </span>

        <p className="mt-6 text-lg text-neutral-700">
          {brand.tagline}
        </p>

        <p className="mt-10 text-sm text-neutral-500">
          Aus {brand.location.city}, {brand.location.country}
        </p>
      </div>
    </main>
  );
}
