"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, Check, Copy, FileText, ShieldCheck } from "lucide-react";
import { activeContactConfig } from "@/client/contact";
import { applications } from "@/client/content";
import { materials } from "@/client/materials";
import styles from "./contact-demo-form.module.css";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
  consent: boolean;
};

type FormErrorKey = keyof FormValues | "contact";
type FormErrors = Partial<Record<FormErrorKey, string>>;
type CopyStatus = "idle" | "copied" | "failed";

const initialValues: FormValues = {
  name: "",
  email: "",
  phone: "",
  projectType: "",
  message: "",
  consent: false,
};

const supportedMaterialLabels = new Map(
  materials.map((material) => [
    material.slug,
    `${material.name} (${material.sourceAssetName})`,
  ]),
);

function parseSelectedMaterials(value: string | null): string[] {
  if (!value) return [];

  return Array.from(
    new Set(
      value
        .split(",")
        .map((slug) => supportedMaterialLabels.get(slug.trim().toLocaleLowerCase("lt-LT")))
        .filter((label): label is string => Boolean(label)),
    ),
  );
}

function createSummary(values: FormValues, selectedMaterials: readonly string[]) {
  return [
    `Vardas: ${values.name.trim()}`,
    values.email.trim() ? `El. paštas: ${values.email.trim()}` : null,
    values.phone.trim() ? `Telefonas: ${values.phone.trim()}` : null,
    `Darbų kategorija: ${values.projectType}`,
    selectedMaterials.length > 0 ? `Pasirinkti pavyzdžiai: ${selectedMaterials.join(", ")}` : null,
    `Užklausa: ${values.message.trim()}`,
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const email = values.email.trim();
  const phone = values.phone.trim();

  if (!values.name.trim()) errors.name = "Įrašykite savo vardą.";

  if (!email && !phone) {
    errors.contact = "Įrašykite bent vieną kontaktą: el. paštą arba telefono numerį.";
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Patikrinkite el. pašto adresą.";
  }

  if (phone) {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 15) errors.phone = "Patikrinkite telefono numerį.";
  }

  if (!values.projectType) errors.projectType = "Pasirinkite darbų kategoriją.";
  if (!values.message.trim()) errors.message = "Trumpai aprašykite, ko reikia.";
  if (!values.consent) errors.consent = "Patvirtinkite, kad suprantate demonstracinės formos veikimą.";

  return errors;
}

function describedBy(...ids: Array<string | false | undefined>): string | undefined {
  const value = ids.filter(Boolean).join(" ");
  return value || undefined;
}

export function ContactDemoForm() {
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const returnToFormRef = useRef(false);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const selectedMaterials = useMemo(
    () => parseSelectedMaterials(searchParams.get("akmenys")),
    [searchParams],
  );
  const summary = useMemo(
    () => createSummary(values, selectedMaterials),
    [selectedMaterials, values],
  );

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      if (submitted) resultRef.current?.focus();
      else if (returnToFormRef.current) {
        returnToFormRef.current = false;
        nameInputRef.current?.focus();
      }
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [submitted]);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key] && !((key === "email" || key === "phone") && current.contact)) return current;
      const next = { ...current };
      delete next[key];
      if (key === "email" || key === "phone") delete next.contact;
      return next;
    });
    setSubmitted(false);
    setCopyStatus("idle");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      });
      return;
    }

    setErrors({});
    setSubmitted(true);
    setCopyStatus("idle");
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  }

  if (submitted) {
    const mailtoHref = activeContactConfig.email
      ? `${activeContactConfig.email.href}?subject=${encodeURIComponent(`Užklausa: ${values.projectType}`)}&body=${encodeURIComponent(summary)}`
      : null;

    return (
      <div
        className={`${styles.result} demo-form__result`}
        ref={resultRef}
        role="status"
        aria-live="polite"
        tabIndex={-1}
      >
        <span className={styles.resultIcon} aria-hidden="true">
          <Check size={24} strokeWidth={1.5} />
        </span>
        <p className={styles.kicker}>Vietinis juodraštis parengtas</p>
        <h2>Duomenys nebuvo išsiųsti.</h2>
        <p className={styles.resultLead}>
          Ši demonstracinė forma nieko nesiunčia ir nesaugo. Nukopijuokite parengtą tekstą arba atverkite jį savo el. pašto programoje.
        </p>

        <dl className={styles.summary} aria-label="Parengtos užklausos santrauka">
          <div><dt>Vardas</dt><dd>{values.name.trim()}</dd></div>
          {values.email.trim() ? <div><dt>El. paštas</dt><dd>{values.email.trim()}</dd></div> : null}
          {values.phone.trim() ? <div><dt>Telefonas</dt><dd>{values.phone.trim()}</dd></div> : null}
          <div><dt>Darbų kategorija</dt><dd>{values.projectType}</dd></div>
          {selectedMaterials.length > 0 ? (
            <div><dt>Pasirinkti pavyzdžiai</dt><dd>{selectedMaterials.join(", ")}</dd></div>
          ) : null}
          <div className={styles.summaryWide}><dt>Užklausa</dt><dd>{values.message.trim()}</dd></div>
        </dl>

        <div className={`${styles.resultActions} demo-form__result-actions`}>
          <button className="ak-button ak-button--light" type="button" onClick={copySummary}>
            <span>{copyStatus === "copied" ? "Juodraštis nukopijuotas" : "Kopijuoti juodraštį"}</span>
            <Copy aria-hidden="true" size={17} strokeWidth={1.75} />
          </button>
          {mailtoHref ? (
            <a className={`${styles.secondaryAction} ak-button`} href={mailtoHref}>
              Atidaryti el. laišką <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.5} />
            </a>
          ) : null}
          <button
            className={`${styles.textAction} ak-button`}
            type="button"
            onClick={() => {
              returnToFormRef.current = true;
              setSubmitted(false);
            }}
          >
            Taisyti duomenis
          </button>
        </div>
        <p className={styles.copyFeedback} aria-live="polite">
          {copyStatus === "failed" ? "Nepavyko nukopijuoti automatiškai. Duomenis galite pažymėti santraukoje." : null}
        </p>
        {activeContactConfig.email ? (
          <p className={styles.deliveryNote}>
            El. pašto programoje gavėjas bus <strong>{activeContactConfig.email.display}</strong>; laišką dar reikės išsiųsti patiems.
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form className={`${styles.form} demo-form`} ref={formRef} onSubmit={handleSubmit} noValidate>
      <div className={`${styles.intro} demo-form__intro`}>
        <p className={styles.kicker}>Trumpa užklausa</p>
        <h2>Aprašykite planuojamą darbą.</h2>
        <p className={styles.introText}>
          Nurodykite darbų kategoriją ir tai, ką jau žinote. Prieš prijungiant el. paštą ši forma veikia tik kaip užklausos juodraštis.
        </p>
        <div className={styles.demoNotice} role="note">
          <ShieldCheck aria-hidden="true" size={20} strokeWidth={1.5} />
          <span><strong>Demonstracinė forma.</strong> Įrašyti duomenys neišsiunčiami ir nesaugomi.</span>
        </div>
        {selectedMaterials.length > 0 ? (
          <div className={styles.materialSelection}>
            <span>Prie užklausos pridėta</span>
            <ul aria-label="Pasirinkti pavyzdžiai">
              {selectedMaterials.map((material) => <li key={material}>{material}</li>)}
            </ul>
          </div>
        ) : null}
      </div>

      <div className={`${styles.fields} demo-form__fields`}>
        <label className={styles.field} htmlFor="contact-name">
          <span>Vardas</span>
          <input
            className={styles.control}
            id="contact-name"
            autoComplete="name"
            name="name"
            onChange={(event) => update("name", event.target.value)}
            ref={nameInputRef}
            required
            type="text"
            value={values.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
          />
          {errors.name ? <small className={styles.error} id="contact-name-error" role="alert">{errors.name}</small> : null}
        </label>

        <label className={styles.field} htmlFor="contact-project-type">
          <span>Darbų kategorija</span>
          <select
            className={styles.control}
            id="contact-project-type"
            name="projectType"
            onChange={(event) => update("projectType", event.target.value)}
            required
            value={values.projectType}
            aria-invalid={Boolean(errors.projectType)}
            aria-describedby={errors.projectType ? "contact-project-type-error" : undefined}
          >
            <option value="" disabled>Pasirinkite</option>
            {applications.map((application) => (
              <option value={application.shortTitle} key={application.id}>{application.shortTitle}</option>
            ))}
          </select>
          {errors.projectType ? <small className={styles.error} id="contact-project-type-error" role="alert">{errors.projectType}</small> : null}
        </label>

        <label className={styles.field} htmlFor="contact-email">
          <span>El. paštas</span>
          <input
            className={styles.control}
            id="contact-email"
            autoComplete="email"
            inputMode="email"
            name="email"
            onChange={(event) => update("email", event.target.value)}
            type="email"
            value={values.email}
            aria-invalid={Boolean(errors.email || errors.contact)}
            aria-describedby={describedBy("contact-method-hint", errors.email && "contact-email-error", errors.contact && "contact-method-error")}
          />
          {errors.email ? <small className={styles.error} id="contact-email-error" role="alert">{errors.email}</small> : null}
          {errors.contact ? <small className={styles.error} id="contact-method-error" role="alert">{errors.contact}</small> : null}
        </label>

        <label className={styles.field} htmlFor="contact-phone">
          <span>Telefono numeris</span>
          <input
            className={styles.control}
            id="contact-phone"
            autoComplete="tel"
            inputMode="tel"
            name="phone"
            onChange={(event) => update("phone", event.target.value)}
            placeholder="+370"
            type="tel"
            value={values.phone}
            aria-invalid={Boolean(errors.phone || errors.contact)}
            aria-describedby={describedBy("contact-method-hint", errors.phone && "contact-phone-error", errors.contact && "contact-method-error")}
          />
          {errors.phone ? <small className={styles.error} id="contact-phone-error" role="alert">{errors.phone}</small> : null}
        </label>
        <p className={`${styles.hint} ${styles.contactHint}`} id="contact-method-hint">Pakanka vieno kontakto.</p>

        <label className={`${styles.field} ${styles.wide} demo-form__wide`} htmlFor="contact-message">
          <span>Trumpas darbų aprašymas</span>
          <textarea
            className={styles.control}
            id="contact-message"
            name="message"
            onChange={(event) => update("message", event.target.value)}
            placeholder="Kokio gaminio ar darbų reikia, ką jau žinote apie matmenis ir vietą?"
            required
            rows={6}
            value={values.message}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
          />
          {errors.message ? <small className={styles.error} id="contact-message-error" role="alert">{errors.message}</small> : null}
        </label>

        <label className={`${styles.consent} demo-form__consent demo-form__wide`} htmlFor="contact-consent">
          <input
            id="contact-consent"
            checked={values.consent}
            name="consent"
            onChange={(event) => update("consent", event.target.checked)}
            required
            type="checkbox"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? "contact-consent-error" : undefined}
          />
          <span>
            Suprantu, kad tai demonstracinė forma: duomenys nebus išsiųsti ir nebus išsaugoti.
            {errors.consent ? <small className={styles.error} id="contact-consent-error" role="alert">{errors.consent}</small> : null}
          </span>
        </label>

        <div className={`${styles.submit} demo-form__submit demo-form__wide`}>
          <button className="ak-button ak-button--light" type="submit">
            Parengti užklausos juodraštį <FileText aria-hidden="true" size={17} strokeWidth={1.5} />
          </button>
          <p>Paspaudus bus parodyta tik vietinė santrauka.</p>
        </div>
      </div>
    </form>
  );
}
