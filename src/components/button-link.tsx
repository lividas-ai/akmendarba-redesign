import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "inverse" | "ghost";
  className?: string;
  showArrow?: boolean;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  showArrow = true,
}: ButtonLinkProps) {
  return (
    <Link className={`button button--${variant} ${className}`.trim()} href={href}>
      <span>{children}</span>
      {showArrow ? <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.75} /> : null}
    </Link>
  );
}
