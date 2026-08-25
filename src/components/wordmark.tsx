"use client";

import Image from "next/image";
import Link from "next/link";

type WordmarkProps = {
  inverse?: boolean;
  onClick?: () => void;
};

export function Wordmark({ inverse = false, onClick }: WordmarkProps) {
  return (
    <Link
      className="wordmark"
      data-inverse={inverse || undefined}
      href="/"
      aria-label="Granit Decor — pradinis puslapis"
      onClick={onClick}
    >
      <Image
        className="wordmark__logo"
        src="/assets/brand/granit-decor-logo.png"
        alt=""
        width={300}
        height={326}
        sizes="64px"
        priority
      />
      <span className="wordmark__name">GRANIT DECOR</span>
    </Link>
  );
}
