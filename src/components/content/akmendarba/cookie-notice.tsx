"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

const consentKey = "akmendarba-cookie-notice";

export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setVisible(window.localStorage.getItem(consentKey) !== "accepted");
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  function accept() {
    window.localStorage.setItem(consentKey, "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside className="ak-cookie" aria-label="Informacija apie slapukus">
      <button aria-label="Uždaryti pranešimą" className="ak-cookie__close" onClick={accept} type="button">
        <X aria-hidden="true" size={18} strokeWidth={1.35} />
      </button>
      <p>Ši demonstracinė svetainė naudoja tik būtiną nuostatą jūsų pasirinkimui įsiminti.</p>
      <div>
        <Link href="/slapukai">Slapukų informacija</Link>
        <button className="ak-button ak-button--dark" onClick={accept} type="button">Supratau</button>
      </div>
    </aside>
  );
}
