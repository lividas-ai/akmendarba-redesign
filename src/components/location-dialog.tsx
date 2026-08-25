"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, MapPin, X } from "lucide-react";

type LocationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LocationDialog({ open, onOpenChange }: LocationDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      aria-label="Granit Decor vieta"
      className="location-dialog"
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        onOpenChange(false);
      }}
      onClose={() => onOpenChange(false)}
      onClick={(event) => {
        if (event.target === dialogRef.current) onOpenChange(false);
      }}
    >
      <div className="location-dialog__panel">
        <button aria-label="Uždaryti vietos informaciją" type="button" onClick={() => onOpenChange(false)}>
          <X aria-hidden="true" size={21} strokeWidth={1.4} />
        </button>
        <MapPin aria-hidden="true" size={24} strokeWidth={1.25} />
        <p className="location-dialog__kicker">Dirbtuvės ir konsultacijos</p>
        <h2>Lentvaris</h2>
        <address>
          Kęstučio g. 1, Lentvaris
          <br />
          I–V 8:00–16:00
        </address>
        <p>Prieš atvykdami susisiekite — pasiruošime aptarti jūsų projektą ir medžiagos pasirinkimą.</p>
        <a
          className="button button--primary"
          href="https://www.google.com/maps/search/?api=1&query=K%C4%99stu%C4%8Dio+g.+1%2C+Lentvaris"
          rel="noreferrer"
          target="_blank"
        >
          Atidaryti žemėlapį <ArrowUpRight aria-hidden="true" size={16} />
        </a>
        <button className="location-dialog__cancel" type="button" onClick={() => onOpenChange(false)}>
          Uždaryti
        </button>
      </div>
    </dialog>
  );
}
