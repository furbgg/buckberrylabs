import { brand } from "@/lib/config";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="max-w-2xl text-center">
        <span className="inline-block rounded-full border border-primary-accent/30 bg-primary-accent/10 px-3 py-1 text-xs font-mono tracking-wide text-accent-deep uppercase">
          Phase 0 · Scaffold
        </span>
        <h1 className="mt-8 font-display text-5xl font-semibold tracking-tight text-primary-dark sm:text-6xl">
          {brand.name}
        </h1>
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
