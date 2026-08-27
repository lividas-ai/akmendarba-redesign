import Link from "next/link";
import { Grid2X2, MessageSquareText, Phone } from "lucide-react";
import { activeContactConfig } from "@/client/contact";

export function MobileActionDock() {
  return (
    <nav className="mobile-action-dock" aria-label="Greitieji veiksmai">
      {activeContactConfig.phone ? (
        <a href={activeContactConfig.phone.href}>
          <Phone aria-hidden="true" size={18} strokeWidth={1.7} />
          <span>Skambinti</span>
        </a>
      ) : null}
      <Link className="mobile-action-dock__primary" href="/projektas">
        <MessageSquareText aria-hidden="true" size={18} strokeWidth={1.7} />
        <span>Projektas</span>
      </Link>
      <Link href="/akmuo">
        <Grid2X2 aria-hidden="true" size={18} strokeWidth={1.7} />
        <span>Akmuo</span>
      </Link>
    </nav>
  );
}
