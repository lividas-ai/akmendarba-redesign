"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="fallback-page content-shell" role="alert">
      <h1>Puslapio įkelti nepavyko.</h1>
      <p>Bandykite dar kartą. Išsaugoti akmens variantai ir projekto juodraštis liks šiame įrenginyje.</p>
      <button className="button button--primary" type="button" onClick={reset}>
        Bandyti dar kartą
      </button>
    </section>
  );
}
