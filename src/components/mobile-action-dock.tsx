import Link from "next/link";
import { Grid2X2, MessageSquareText, Phone } from "lucide-react";

export function MobileActionDock() {
  return (
    <nav className="mobile-action-dock" aria-label="Greitieji veiksmai">
      <a href="tel:+37065023784">
        <Phone aria-hidden="true" size={18} strokeWidth={1.7} />
        <span>Skambinti</span>
      </a>
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
