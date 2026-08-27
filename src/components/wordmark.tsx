"use client";

import Image from "next/image";
import Link from "next/link";
import { activeBrandConfig } from "@/client/brand";

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
      aria-label={activeBrandConfig.identity.homeAriaLabel}
      onClick={onClick}
    >
      <Image
        className="wordmark__logo"
        src={activeBrandConfig.brand.logo.src}
        alt=""
        width={activeBrandConfig.brand.logo.width}
        height={activeBrandConfig.brand.logo.height}
        sizes={activeBrandConfig.brand.logo.sizes}
        priority
      />
      <span className="wordmark__name">{activeBrandConfig.identity.wordmark}</span>
    </Link>
  );
}
