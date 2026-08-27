"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { activeContactConfig } from "@/client/contact";

type FormValues = {
  name: string;
  contact: string;
  projectType: string;
  message: string;
  consent: boolean;
};

const initialValues: FormValues = {
  name: "",
  contact: "",
  projectType: "",
  message: "",
  consent: false,
};

function createSummary(values: FormValues) {
  return [
    `Vardas: ${values.name}`,
    `Kontaktas: ${values.contact}`,
    `Projektas: ${values.projectType}`,
    `Trumpai: ${values.message}`,
  ].join("\n");
}

export function ContactDemoForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setSubmitted(false);
    setCopied(false);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(createSummary(values));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  if (submitted) {
    return (
      <div className="demo-form__result" role="status" aria-live="polite">
        <span className="demo-form__result-icon" aria-hidden="true">
          <Check size={24} strokeWidth={1.5} />
        </span>
        <span className="eyebrow">Užklausa parengta</span>
        <h2>Šioje demonstracijoje duomenys nebuvo išsiųsti.</h2>
        <p>
          Forma veikia vietoje, tačiau dar nėra prijungta prie el. pašto ar klientų valdymo sistemos. Galite nukopijuoti santrauką
          {activeContactConfig.email ? <> ir išsiųsti ją adresu <a href={activeContactConfig.email.href}>{activeContactConfig.email.display}</a></> : null}.
        </p>
        <div className="demo-form__result-actions">
          <button className="button button--primary" type="button" onClick={copySummary}>
            <span>{copied ? "Santrauka nukopijuota" : "Kopijuoti santrauką"}</span>
            <Copy aria-hidden="true" size={17} strokeWidth={1.75} />
          </button>
          <button className="button button--secondary" type="button" onClick={() => setSubmitted(false)}>
            Grįžti į formą
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="demo-form" onSubmit={handleSubmit}>
      <div className="demo-form__intro">
        <span className="eyebrow">Trumpa užklausa</span>
        <h2>Papasakokite, ką planuojate.</h2>
        <p>
          Užtenka apytikrių matmenų ir kelių sakinių. Pradiniam pokalbiui nebūtinas galutinis brėžinys.
        </p>
      </div>

      <div className="demo-form__fields">
        <label>
          <span>Vardas</span>
          <input
            autoComplete="name"
            name="name"
            onChange={(event) => update("name", event.target.value)}
            required
            type="text"
            value={values.name}
          />
        </label>
        <label>
          <span>El. paštas arba telefonas</span>
          <input
            autoComplete="email"
            name="contact"
            onChange={(event) => update("contact", event.target.value)}
            required
            type="text"
            value={values.contact}
          />
        </label>
        <label>
          <span>Projekto tipas</span>
          <select
            name="projectType"
            onChange={(event) => update("projectType", event.target.value)}
            required
            value={values.projectType}
          >
            <option value="" disabled>
              Pasirinkite
            </option>
            <option>Virtuvė</option>
            <option>Vonios erdvė</option>
            <option>Židinys ar siena</option>
            <option>Laiptai ar palangės</option>
            <option>Baldo detalė</option>
            <option>Fasadas ar lauko elementas</option>
            <option>Kita</option>
          </select>
        </label>
        <label className="demo-form__wide">
          <span>Trumpas projekto aprašymas</span>
          <textarea
            name="message"
            onChange={(event) => update("message", event.target.value)}
            placeholder="Ką norite pagaminti, kokius matmenis jau turite, kur yra objektas?"
            required
            rows={5}
            value={values.message}
          />
        </label>
        <label className="demo-form__consent demo-form__wide">
          <input
            checked={values.consent}
            name="consent"
            onChange={(event) => update("consent", event.target.checked)}
            required
            type="checkbox"
          />
          <span>
            Sutinku, kad mano pateikti duomenys būtų naudojami atsakyti į šią užklausą. Demonstracinėje versijoje duomenys niekur nesiunčiami.
          </span>
        </label>
      </div>

      <div className="demo-form__submit">
        <button className="button button--primary" type="submit">
          Parengti užklausą
        </button>
        <p>Paspaudus ši demonstracinė forma tik parodys vietinę santrauką.</p>
      </div>
    </form>
  );
}
