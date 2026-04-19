import Image from "next/image";
import Link from "next/link";

type LogoVariant = "full" | "icon" | "wordmark";
type LogoSize = "xs" | "sm" | "md" | "lg" | "xl";

type LogoProps = {
  variant?: LogoVariant;
  size?: LogoSize;
  href?: string | null;
  className?: string;
  priority?: boolean;
};

const sources: Record<LogoVariant, { src: string; aspect: number }> = {
  full: { src: "/logo/logo.png", aspect: 580 / 580 },
  icon: { src: "/logo/karelogo.png", aspect: 1 },
  wordmark: { src: "/logo/yazilogo.png", aspect: 1 },
};

const heights: Record<LogoSize, number> = {
  xs: 20,
  sm: 28,
  md: 36,
  lg: 48,
  xl: 72,
};

export function Logo({
  variant = "full",
  size = "md",
  href = "/",
  className,
  priority = false,
}: LogoProps) {
  const { src, aspect } = sources[variant];
  const height = heights[size];
  const width = Math.round(height * aspect);

  const img = (
    <Image
      src={src}
      alt="Buckberry Labs"
      width={width}
      height={height}
      priority={priority}
      className={className}
    />
  );

  if (!href) return img;

  return (
    <Link href={href} className="inline-flex items-center" aria-label="Buckberry Labs — Startseite">
      {img}
    </Link>
  );
}
