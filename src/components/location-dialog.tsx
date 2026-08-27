"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, MapPin, X } from "lucide-react";
import { activeContactConfig } from "@/client/contact";

type LocationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LocationDialog({ open, onOpenChange }: LocationDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const location = activeContactConfig.location;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  if (!location || !activeContactConfig.address) return null;

  return (
    <dialog
      aria-label={location.dialogAriaLabel}
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
        <button aria-label={location.closeAriaLabel} type="button" onClick={() => onOpenChange(false)}>
          <X aria-hidden="true" size={21} strokeWidth={1.4} />
        </button>
        <MapPin aria-hidden="true" size={24} strokeWidth={1.25} />
        {location.kicker ? <p className="location-dialog__kicker">{location.kicker}</p> : null}
        <h2>{location.title}</h2>
        <address>
          {location.addressLines.map((line, index) => (
            <span key={line}>
              {index > 0 ? <br /> : null}
              {line}
            </span>
          ))}
        </address>
        {location.note ? <p>{location.note}</p> : null}
        <a
          className="button button--primary"
          href={activeContactConfig.address.href}
          rel="noreferrer"
          target="_blank"
        >
          {location.mapActionLabel} <ArrowUpRight aria-hidden="true" size={16} />
        </a>
        <button className="location-dialog__cancel" type="button" onClick={() => onOpenChange(false)}>
          {location.closeLabel}
        </button>
      </div>
    </dialog>
  );
}
