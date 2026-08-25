"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clipboard,
  Download,
  File as FileIcon,
  FileImage,
  Gem,
  ImagePlus,
  Layers3,
  MapPin,
  Pencil,
  RotateCcw,
  Ruler,
  Trash2,
  UploadCloud,
  UserRound,
} from "lucide-react";
import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { applications, materialCategories } from "@/data/content";
import { materials } from "@/data/materials";
import {
  clearPlannerDraft,
  createEmptyPlannerData,
  loadPlannerDraft,
  PlannerData,
  PlannerMode,
  readSavedMaterialSlugs,
  savePlannerDraft,
} from "@/lib/planner-storage";

type Option = { value: string; label: string };
type ValidationErrors = Record<string, string>;
type LocalProjectFile = { id: string; file: File; previewUrl?: string };

const steps = [
  { title: "Gaminys", icon: Layers3 },
  { title: "Projektas", icon: Ruler },
  { title: "Akmuo", icon: Gem },
  { title: "Vieta", icon: MapPin },
  { title: "Kontaktai", icon: UserRound },
] as const;

const stepContent = [
  { title: "Ką norite pagaminti?", asideTitle: "Projekto pradžia.", note: "Pasirinkite vieną pagrindinį gaminį." },
  { title: "Ką jau turite?", asideTitle: "Brėžiniai ir matmenys.", note: "Aprašykite projektą ir pridėkite brėžinius arba nuotraukas." },
  { title: "Kokia akmens kryptis?", asideTitle: "Medžiagos pasirinkimas.", note: "Pažymėkite tai, ką jau esate išsirinkę." },
  { title: "Kur bus projektas?", asideTitle: "Objekto informacija.", note: "Vieta ir darbų etapas padės įvertinti projekto eigą." },
  { title: "Kaip su jumis susisiekti?", asideTitle: "Ryšio duomenys.", note: "Pakanka el. pašto arba telefono numerio." },
] as const;

const projectTypeOptions: readonly Option[] = [
  ...applications.map((application) => ({ value: application.id, label: application.shortTitle })),
  { value: "memorialas", label: "Memorialas" },
  { value: "kita", label: "Kitas gaminys" },
];

const dimensionOptions: readonly Option[] = [
  { value: "tikslus", label: "Turiu tikslius matmenis" },
  { value: "apytikslis", label: "Turiu apytikslius matmenis" },
  { value: "reikia-matavimo", label: "Reikalingas matavimas" },
];

const detailOptions: readonly Option[] = [
  { value: "ispjovos", label: "Išpjovos" },
  { value: "nestandartine-forma", label: "Nestandartinė forma" },
  { value: "briaunos", label: "Briaunų sprendimas" },
  { value: "jungtys", label: "Jungtys ir siūlės" },
  { value: "reikia-patarimo", label: "Reikia konsultacijos" },
];

const stoneDecisionOptions: readonly Option[] = [
  { value: "issirinkau", label: "Turiu konkretų akmenį" },
  { value: "turiu-krypti", label: "Turiu vizualinę kryptį" },
  { value: "reikia-rekomendacijos", label: "Reikia rekomendacijos" },
];

const stageOptions: readonly Option[] = [
  { value: "ideja", label: "Idėja" },
  { value: "projektuojama", label: "Projektuojama" },
  { value: "gaminami-baldai", label: "Vyksta kiti darbai" },
  { value: "parengta-matuoti", label: "Parengta matuoti" },
  { value: "atnaujinimas", label: "Keitimas arba atnaujinimas" },
];

const timingOptions: readonly Option[] = [
  { value: "lankstus", label: "Laikas lankstus" },
  { value: "1-3-men", label: "Per 1–3 mėnesius" },
  { value: "3-6-men", label: "Per 3–6 mėnesius" },
  { value: "veliau", label: "Vėliau" },
  { value: "nezinau", label: "Dar nežinau" },
];

const contactPreferenceOptions: readonly Option[] = [
  { value: "telefonu", label: "Telefonu" },
  { value: "el-pastu", label: "El. paštu" },
  { value: "nesvarbu", label: "Nesvarbu" },
];

const acceptedFileExtensions = new Set(["pdf", "dwg", "dxf", "jpg", "jpeg", "png", "webp", "heic"]);
const maxFiles = 8;
const maxFileSize = 25 * 1024 * 1024;

const detailLabels = new Map(detailOptions.map((option) => [option.value, option.label]));
const projectTypeLabels = new Map(projectTypeOptions.map((option) => [option.value, option.label]));
const dimensionLabels = new Map(dimensionOptions.map((option) => [option.value, option.label]));
const stoneDecisionLabels = new Map(stoneDecisionOptions.map((option) => [option.value, option.label]));
const stageLabels = new Map(stageOptions.map((option) => [option.value, option.label]));
const timingLabels = new Map(timingOptions.map((option) => [option.value, option.label]));
const contactPreferenceLabels = new Map(contactPreferenceOptions.map((option) => [option.value, option.label]));
const categoryLabels = new Map(materialCategories.map((category) => [category.id, category.name]));
const materialBySlug = new Map(materials.map((material) => [material.slug, material]));

const errorTargets: Record<string, string> = {
  projectType: "planner-project-type",
  projectDescription: "planner-description",
  dimensionsStatus: "planner-dimensions-status",
  dimensions: "planner-dimensions",
  stoneDecision: "planner-stone-decision",
  selectedMaterialSlugs: "planner-stone-notes",
  location: "planner-location",
  projectStage: "planner-stage",
  timing: "planner-timing",
  contactName: "planner-name",
  contact: "planner-email",
  email: "planner-email",
  phone: "planner-phone",
  contactPreference: "planner-contact-preference",
};

function labelFor(map: ReadonlyMap<string, string>, value: string): string {
  return map.get(value) ?? (value || "—");
}

function joinLabels(map: ReadonlyMap<string, string>, values: readonly string[]): string {
  return values.length > 0 ? values.map((value) => labelFor(map, value)).join(", ") : "Nenurodyta";
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileExtension(file: File): string {
  return file.name.split(".").pop()?.toLowerCase() ?? "";
}

function canPreview(file: File): boolean {
  return file.type.startsWith("image/") && fileExtension(file) !== "heic";
}

function validateStep(step: number, data: PlannerData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (step === 0 && !data.projectType) errors.projectType = "Pasirinkite gaminio tipą.";

  if (step === 1) {
    if (data.projectDescription.trim().length < 10) errors.projectDescription = "Trumpai aprašykite projektą.";
    if (!data.dimensionsStatus) errors.dimensionsStatus = "Pasirinkite matmenų būseną.";
    if (
      (data.dimensionsStatus === "tikslus" || data.dimensionsStatus === "apytikslis") &&
      data.dimensions.trim().length < 2
    ) {
      errors.dimensions = "Įrašykite turimus matmenis.";
    }
  }

  if (step === 2) {
    if (!data.stoneDecision) errors.stoneDecision = "Pasirinkite akmens pasirinkimo būseną.";
    if (
      data.stoneDecision === "issirinkau" &&
      data.selectedMaterialSlugs.length === 0 &&
      data.stoneNotes.trim().length < 2
    ) {
      errors.selectedMaterialSlugs = "Pasirinkite akmenį arba įrašykite jo pavadinimą.";
    }
  }

  if (step === 3) {
    if (data.location.trim().length < 2) errors.location = "Nurodykite miestą.";
    if (!data.projectStage) errors.projectStage = "Pasirinkite projekto etapą.";
    if (!data.timing) errors.timing = "Pasirinkite pageidaujamą laikotarpį.";
  }

  if (step === 4) {
    const email = data.email.trim();
    const phoneDigits = data.phone.replace(/\D/g, "");
    if (data.contactName.trim().length < 2) errors.contactName = "Įrašykite vardą.";
    if (!email && !data.phone.trim()) errors.contact = "Įrašykite el. paštą arba telefono numerį.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Patikrinkite el. pašto adresą.";
    if (data.phone.trim() && phoneDigits.length < 7) errors.phone = "Patikrinkite telefono numerį.";
    if (data.contactPreference === "telefonu" && !data.phone.trim()) errors.contactPreference = "Įrašykite telefono numerį.";
    if (data.contactPreference === "el-pastu" && !email) errors.contactPreference = "Įrašykite el. pašto adresą.";
  }

  return errors;
}

function Choice({ name, option, checked, onChange }: { name: string; option: Option; checked: boolean; onChange: (value: string) => void }) {
  return (
    <label className="planner-choice">
      <input type="radio" name={name} value={option.value} checked={checked} onChange={() => onChange(option.value)} />
      <span className="planner-choice__mark" aria-hidden="true"><Check size={13} strokeWidth={2} /></span>
      <span>{option.label}</span>
    </label>
  );
}

function CheckChoice({ option, checked, onChange }: { option: Option; checked: boolean; onChange: (value: string) => void }) {
  return (
    <label className="planner-check-choice">
      <input type="checkbox" value={option.value} checked={checked} onChange={() => onChange(option.value)} />
      <span aria-hidden="true"><Check size={13} strokeWidth={2} /></span>
      <strong>{option.label}</strong>
    </label>
  );
}

function FieldError({ id, children }: { id: string; children?: string }) {
  return children ? <p className="planner-field-error" id={id}>{children}</p> : null;
}

function ReviewSection({ id, title, onEdit, children }: { id: string; title: string; onEdit: () => void; children: ReactNode }) {
  return (
    <section className="planner-review__section" aria-labelledby={`review-title-${id}`}>
      <header>
        <h3 id={`review-title-${id}`}>{title}</h3>
        <button type="button" className="planner-edit-button" onClick={onEdit}>
          <Pencil aria-hidden="true" size={14} strokeWidth={1.7} /> Keisti
        </button>
      </header>
      {children}
    </section>
  );
}

function SummaryRows({ children }: { children: ReactNode }) {
  return <dl className="planner-summary-rows">{children}</dl>;
}

function SummaryRow({ term, children }: { term: string; children: ReactNode }) {
  return <div><dt>{term}</dt><dd>{children || "—"}</dd></div>;
}

function buildPlainTextSummary(data: PlannerData, projectFiles: LocalProjectFile[]): string {
  const selectedMaterials = data.selectedMaterialSlugs.map((slug) => materialBySlug.get(slug)?.name ?? slug).join(", ");
  const attachments = projectFiles.map(({ file }) => `${file.name} (${formatFileSize(file.size)})`);

  return [
    "GRANIT DECOR — PROJEKTO INFORMACIJA",
    "",
    `Gaminys: ${labelFor(projectTypeLabels, data.projectType)}`,
    `Projektas: ${data.projectDescription.trim() || "Nenurodyta"}`,
    `Matmenų būsena: ${labelFor(dimensionLabels, data.dimensionsStatus)}`,
    `Matmenys: ${data.dimensions.trim() || "Nenurodyta"}`,
    `Detalės: ${joinLabels(detailLabels, data.detailFlags)}`,
    `Pridėti failai: ${attachments.join(", ") || "Nėra"}`,
    "",
    `Akmens pasirinkimas: ${labelFor(stoneDecisionLabels, data.stoneDecision)}`,
    `Akmens rūšys: ${joinLabels(categoryLabels, data.stoneCategories)}`,
    `Pasirinkti akmenys: ${selectedMaterials || "Nenurodyta"}`,
    `Akmens pastabos: ${data.stoneNotes.trim() || "Nenurodyta"}`,
    "",
    `Vieta: ${data.location.trim() || "Nenurodyta"}`,
    `Etapas: ${labelFor(stageLabels, data.projectStage)}`,
    `Laikotarpis: ${labelFor(timingLabels, data.timing)}`,
    `Objekto pastabos: ${data.siteNotes.trim() || "Nenurodyta"}`,
    "",
    `Vardas: ${data.contactName.trim() || "Nenurodyta"}`,
    `Įmonė: ${data.company.trim() || "Nenurodyta"}`,
    `El. paštas: ${data.email.trim() || "Nenurodyta"}`,
    `Telefonas: ${data.phone.trim() || "Nenurodyta"}`,
    `Ryšio būdas: ${labelFor(contactPreferenceLabels, data.contactPreference)}`,
  ].join("\n");
}

export function ProjectPlanner() {
  const [data, setData] = useState<PlannerData>(() => createEmptyPlannerData());
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<PlannerMode>("editing");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [hydrated, setHydrated] = useState(false);
  const [wasResumed, setWasResumed] = useState(false);
  const [savedCollectionSlugs, setSavedCollectionSlugs] = useState<string[]>([]);
  const [projectFiles, setProjectFiles] = useState<LocalProjectFile[]>([]);
  const [fileError, setFileError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [exportStatus, setExportStatus] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const projectFilesRef = useRef<LocalProjectFile[]>([]);

  const savedCollectionMaterials = useMemo(() => {
    const visibleSlugs = new Set([...savedCollectionSlugs, ...data.selectedMaterialSlugs]);
    return Array.from(visibleSlugs)
      .map((slug) => materialBySlug.get(slug))
      .filter((material): material is NonNullable<typeof material> => Boolean(material));
  }, [data.selectedMaterialSlugs, savedCollectionSlugs]);

  const selectedMaterialNames = useMemo(
    () => data.selectedMaterialSlugs.map((slug) => materialBySlug.get(slug)?.name ?? slug),
    [data.selectedMaterialSlugs],
  );

  useEffect(() => { projectFilesRef.current = projectFiles; }, [projectFiles]);

  useEffect(() => () => {
    projectFilesRef.current.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
  }, []);

  useEffect(() => {
    const hydrationFrame = window.requestAnimationFrame(() => {
      const allowedSlugs = new Set(materials.map((material) => material.slug));
      const savedSlugs = readSavedMaterialSlugs().filter((slug) => allowedSlugs.has(slug));
      const draft = loadPlannerDraft();
      const requestedProjectType = new URLSearchParams(window.location.search).get("gaminys");
      const hasRequestedProjectType = projectTypeOptions.some((option) => option.value === requestedProjectType);
      setSavedCollectionSlugs(savedSlugs);

      if (draft) {
        setData({
          ...draft.data,
          projectType: hasRequestedProjectType ? requestedProjectType ?? "" : draft.data.projectType,
          selectedMaterialSlugs: Array.from(new Set([
            ...draft.data.selectedMaterialSlugs.filter((slug) => allowedSlugs.has(slug)),
            ...savedSlugs,
          ])),
        });
        setStep(hasRequestedProjectType ? 0 : draft.step);
        setMode(hasRequestedProjectType ? "editing" : draft.mode);
        setWasResumed(true);
      } else {
        setData({
          ...createEmptyPlannerData(),
          projectType: hasRequestedProjectType ? requestedProjectType ?? "" : "",
          selectedMaterialSlugs: savedSlugs,
        });
      }
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(hydrationFrame);
  }, []);

  useEffect(() => {
    if (hydrated) savePlannerDraft({ data: { ...data, consent: false }, step, mode });
  }, [data, hydrated, mode, step]);

  function focusHeading() {
    window.requestAnimationFrame(() => headingRef.current?.focus());
  }

  function clearErrors(...keys: string[]) {
    setErrors((current) => {
      const next = { ...current };
      keys.forEach((key) => delete next[key]);
      return next;
    });
  }

  function updateField<K extends keyof PlannerData>(key: K, value: PlannerData[K]) {
    setData((current) => ({ ...current, [key]: value }));
    clearErrors(key, key === "email" || key === "phone" ? "contact" : "");
  }

  function toggleArrayField(key: "detailFlags" | "stoneCategories" | "selectedMaterialSlugs", value: string) {
    setData((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }));
    clearErrors(key);
  }

  function goToStep(nextStep: number) {
    setMode("editing");
    setStep(nextStep);
    setErrors({});
    setExportStatus("");
    focusHeading();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateStep(step, data);
    const firstError = Object.keys(nextErrors)[0];

    if (firstError) {
      setErrors(nextErrors);
      window.requestAnimationFrame(() => {
        const targetId = errorTargets[firstError];
        if (targetId) document.getElementById(targetId)?.focus();
      });
      return;
    }

    setErrors({});
    if (step < steps.length - 1) {
      setStep((current) => current + 1);
      focusHeading();
      return;
    }
    setMode("review");
    focusHeading();
  }

  function addProjectFiles(files: FileList | File[]) {
    const incoming = Array.from(files);
    if (incoming.length === 0) return;

    setProjectFiles((current) => {
      const existing = new Set(current.map(({ file }) => `${file.name}-${file.size}-${file.lastModified}`));
      const availableSlots = Math.max(0, maxFiles - current.length);
      const accepted: LocalProjectFile[] = [];
      const rejected: string[] = [];

      for (const file of incoming) {
        const key = `${file.name}-${file.size}-${file.lastModified}`;
        const extension = fileExtension(file);
        if (existing.has(key)) continue;
        if (!acceptedFileExtensions.has(extension)) {
          rejected.push(`${file.name}: netinkamas formatas`);
          continue;
        }
        if (file.size > maxFileSize) {
          rejected.push(`${file.name}: failas didesnis nei 25 MB`);
          continue;
        }
        if (accepted.length >= availableSlots) {
          rejected.push(`Galima pridėti iki ${maxFiles} failų`);
          break;
        }
        existing.add(key);
        accepted.push({
          id: `${key}-${crypto.randomUUID()}`,
          file,
          previewUrl: canPreview(file) ? URL.createObjectURL(file) : undefined,
        });
      }

      setFileError(Array.from(new Set(rejected)).join(". "));
      return [...current, ...accepted];
    });
  }

  function handleFileInput(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) addProjectFiles(event.target.files);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    addProjectFiles(event.dataTransfer.files);
  }

  function removeProjectFile(id: string) {
    setProjectFiles((current) => {
      const removed = current.find((item) => item.id === id);
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return current.filter((item) => item.id !== id);
    });
    setFileError("");
  }

  function resetPlanner() {
    if (!window.confirm("Ar išvalyti visą projekto informaciją?")) return;
    projectFiles.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
    clearPlannerDraft();
    setData({ ...createEmptyPlannerData(), selectedMaterialSlugs: savedCollectionSlugs });
    setProjectFiles([]);
    setStep(0);
    setMode("editing");
    setErrors({});
    setFileError("");
    setWasResumed(false);
    focusHeading();
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(buildPlainTextSummary(data, projectFiles));
      setExportStatus("Informacija nukopijuota.");
    } catch {
      setExportStatus("Nepavyko nukopijuoti. Galite atsisiųsti tekstinį failą.");
    }
  }

  function downloadSummary() {
    const blob = new Blob([buildPlainTextSummary(data, projectFiles)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "granit-decor-projekto-informacija.txt";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    setExportStatus("Santrauka atsisiųsta.");
  }

  const activeStep = steps[step];
  const activeContent = stepContent[step];

  return (
    <div className="project-planner" id="projekto-planas">
      <div className="planner-progress-wrap">
        <p className="planner-progress__status" aria-live="polite">
          {mode === "review" ? "Informacija parengta" : `${step + 1} iš ${steps.length}`}
        </p>
        <ol className="planner-progress" aria-label="Projekto užklausos eiga">
          {steps.map((item, index) => {
            const StepIcon = item.icon;
            const state = mode === "review" || index < step ? "complete" : index === step ? "current" : "upcoming";
            const canOpen = mode === "review" || index <= step;
            return (
              <li key={item.title} data-state={state}>
                <button
                  type="button"
                  onClick={() => canOpen && goToStep(index)}
                  disabled={!canOpen}
                  aria-current={state === "current" ? "step" : undefined}
                  aria-label={`${index + 1}. ${item.title}`}
                >
                  <span className="planner-progress__icon" aria-hidden="true">
                    {state === "complete" ? <Check size={14} strokeWidth={2} /> : <StepIcon size={15} strokeWidth={1.6} />}
                  </span>
                  <span className="planner-progress__label">{item.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {wasResumed ? (
        <div className="planner-resume" role="status">
          <CheckCircle2 aria-hidden="true" size={18} strokeWidth={1.7} />
          <span>Tęsiate išsaugotą projektą.</span>
          <button type="button" onClick={resetPlanner}>Pradėti iš naujo</button>
        </div>
      ) : null}

      <div className="planner-workspace">
        <aside className="planner-aside" aria-label="Dabartinis projekto žingsnis">
          <span className="planner-aside__step">{mode === "review" ? "Peržiūra" : activeStep.title}</span>
          <div>
            <h2>{mode === "review" ? "Viskas vienoje vietoje." : activeContent.asideTitle}</h2>
            <p>{mode === "review" ? "Patikrinkite informaciją prieš aptarimą." : activeContent.note}</p>
          </div>
          <p className="planner-aside__privacy">Duomenys ir failai šioje demonstracinėje versijoje nėra siunčiami.</p>
        </aside>

        <div className="planner-surface">
          {mode === "editing" ? (
            <form onSubmit={handleSubmit} noValidate>
              <div className="planner-step" key={step}>
                <header className="planner-step__header">
                  <span>{activeStep.title}</span>
                  <h2 tabIndex={-1} ref={headingRef}>{activeContent.title}</h2>
                </header>

                {step === 0 ? (
                  <fieldset className="planner-fieldset">
                    <legend className="sr-only">Gaminio tipas</legend>
                    <div className="planner-choice-grid planner-choice-grid--projects" id="planner-project-type" tabIndex={-1}>
                      {projectTypeOptions.map((option) => (
                        <Choice key={option.value} name="project-type" option={option} checked={data.projectType === option.value} onChange={(value) => updateField("projectType", value)} />
                      ))}
                    </div>
                    <FieldError id="error-project-type">{errors.projectType}</FieldError>
                  </fieldset>
                ) : null}

                {step === 1 ? (
                  <div className="planner-fields">
                    <div className="planner-field">
                      <label htmlFor="planner-description">Trumpas projekto aprašymas <span>*</span></label>
                      <textarea
                        id="planner-description"
                        rows={4}
                        value={data.projectDescription}
                        onChange={(event) => updateField("projectDescription", event.target.value)}
                        aria-invalid={Boolean(errors.projectDescription)}
                        aria-describedby={errors.projectDescription ? "error-project-description" : undefined}
                        placeholder="Pavyzdžiui: L formos virtuvės stalviršis su sala ir plautuvės išpjova."
                      />
                      <FieldError id="error-project-description">{errors.projectDescription}</FieldError>
                    </div>

                    <fieldset className="planner-fieldset">
                      <legend>Matmenys <span>*</span></legend>
                      <div className="planner-choice-grid" id="planner-dimensions-status" tabIndex={-1}>
                        {dimensionOptions.map((option) => (
                          <Choice key={option.value} name="dimensions-status" option={option} checked={data.dimensionsStatus === option.value} onChange={(value) => updateField("dimensionsStatus", value)} />
                        ))}
                      </div>
                      <FieldError id="error-dimensions-status">{errors.dimensionsStatus}</FieldError>
                    </fieldset>

                    {data.dimensionsStatus && data.dimensionsStatus !== "reikia-matavimo" ? (
                      <div className="planner-field">
                        <label htmlFor="planner-dimensions">Turimi matmenys <span>*</span></label>
                        <textarea
                          id="planner-dimensions"
                          rows={3}
                          value={data.dimensions}
                          onChange={(event) => updateField("dimensions", event.target.value)}
                          aria-invalid={Boolean(errors.dimensions)}
                          aria-describedby={errors.dimensions ? "error-dimensions" : undefined}
                          placeholder="2450 × 620 mm; sala 1800 × 900 mm"
                        />
                        <FieldError id="error-dimensions">{errors.dimensions}</FieldError>
                      </div>
                    ) : null}

                    <fieldset className="planner-fieldset planner-fieldset--compact">
                      <legend>Svarbios detalės <span>(nebūtina)</span></legend>
                      <div className="planner-check-grid">
                        {detailOptions.map((option) => (
                          <CheckChoice key={option.value} option={option} checked={data.detailFlags.includes(option.value)} onChange={(value) => toggleArrayField("detailFlags", value)} />
                        ))}
                      </div>
                    </fieldset>

                    <section className="planner-upload" aria-labelledby="planner-upload-title">
                      <div className="planner-upload__heading">
                        <div>
                          <h3 id="planner-upload-title">Projekto failai</h3>
                          <p>PDF, DWG, DXF, JPG, PNG, WEBP arba HEIC. Iki 25 MB.</p>
                        </div>
                        <span>{projectFiles.length}/{maxFiles}</span>
                      </div>

                      <div
                        className="planner-dropzone"
                        data-dragging={isDragging ? "true" : undefined}
                        onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
                        onDragOver={(event) => event.preventDefault()}
                        onDragLeave={(event) => {
                          if (!event.currentTarget.contains(event.relatedTarget as Node)) setIsDragging(false);
                        }}
                        onDrop={handleDrop}
                      >
                        <input
                          className="sr-only"
                          ref={inputRef}
                          id="planner-files"
                          type="file"
                          multiple
                          accept=".pdf,.dwg,.dxf,.jpg,.jpeg,.png,.webp,.heic"
                          onChange={handleFileInput}
                        />
                        <UploadCloud aria-hidden="true" size={25} strokeWidth={1.45} />
                        <div><strong>Nutempkite failus čia</strong><span>arba pasirinkite iš įrenginio</span></div>
                        <button type="button" className="planner-upload__button" onClick={() => inputRef.current?.click()} disabled={projectFiles.length >= maxFiles}>
                          <ImagePlus aria-hidden="true" size={16} strokeWidth={1.7} /> Pasirinkti failus
                        </button>
                      </div>

                      {fileError ? <p className="planner-field-error" role="alert">{fileError}</p> : null}

                      {projectFiles.length > 0 ? (
                        <ul className="planner-file-list" aria-label="Pridėti projekto failai">
                          {projectFiles.map((item) => (
                            <li key={item.id}>
                              <span className="planner-file-list__preview">
                                {item.previewUrl ? (
                                  <Image src={item.previewUrl} alt="" width={72} height={72} unoptimized />
                                ) : fileExtension(item.file) === "pdf" ? (
                                  <FileIcon aria-hidden="true" size={21} strokeWidth={1.45} />
                                ) : (
                                  <FileImage aria-hidden="true" size={21} strokeWidth={1.45} />
                                )}
                              </span>
                              <span className="planner-file-list__copy">
                                <strong>{item.file.name}</strong>
                                <small>{fileExtension(item.file).toUpperCase()} · {formatFileSize(item.file.size)}</small>
                              </span>
                              <button type="button" onClick={() => removeProjectFile(item.id)} aria-label={`Pašalinti ${item.file.name}`}>
                                <Trash2 aria-hidden="true" size={16} strokeWidth={1.65} />
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      <p className="planner-upload__local-note">Failai laikomi tik šiame puslapyje iki jo perkrovimo.</p>
                    </section>
                  </div>
                ) : null}

                {step === 2 ? (
                  <div className="planner-fields">
                    <fieldset className="planner-fieldset">
                      <legend className="sr-only">Akmens pasirinkimo būsena</legend>
                      <div className="planner-choice-grid" id="planner-stone-decision" tabIndex={-1}>
                        {stoneDecisionOptions.map((option) => (
                          <Choice key={option.value} name="stone-decision" option={option} checked={data.stoneDecision === option.value} onChange={(value) => updateField("stoneDecision", value)} />
                        ))}
                      </div>
                      <FieldError id="error-stone-decision">{errors.stoneDecision}</FieldError>
                    </fieldset>

                    {savedCollectionMaterials.length > 0 ? (
                      <fieldset className="planner-fieldset planner-fieldset--saved">
                        <legend>Išsaugoti akmenys</legend>
                        <div className="planner-saved-materials">
                          {savedCollectionMaterials.map((material) => (
                            <label className="planner-saved-material" key={material.slug}>
                              <input type="checkbox" checked={data.selectedMaterialSlugs.includes(material.slug)} onChange={() => toggleArrayField("selectedMaterialSlugs", material.slug)} />
                              <span className="planner-saved-material__image"><Image src={material.localPath} alt="" width={72} height={72} sizes="72px" /></span>
                              <span><strong>{material.name}</strong><small>{labelFor(categoryLabels, material.category)}</small></span>
                              <span className="planner-saved-material__check" aria-hidden="true"><Check size={13} strokeWidth={2} /></span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    ) : (
                      <div className="planner-collection-empty">
                        <Gem aria-hidden="true" size={19} strokeWidth={1.5} />
                        <span>Išsaugotų akmenų nėra.</span>
                        <Link href="/akmuo">Peržiūrėti akmenis</Link>
                      </div>
                    )}

                    <fieldset className="planner-fieldset planner-fieldset--compact">
                      <legend>Akmens rūšis <span>(nebūtina)</span></legend>
                      <div className="planner-check-grid">
                        {materialCategories.map((category) => (
                          <CheckChoice key={category.id} option={{ value: category.id, label: category.name }} checked={data.stoneCategories.includes(category.id)} onChange={(value) => toggleArrayField("stoneCategories", value)} />
                        ))}
                      </div>
                    </fieldset>

                    <div className="planner-field">
                      <label htmlFor="planner-stone-notes">Akmens pavadinimas arba norima kryptis <span>(nebūtina)</span></label>
                      <textarea
                        id="planner-stone-notes"
                        rows={3}
                        value={data.stoneNotes}
                        onChange={(event) => { updateField("stoneNotes", event.target.value); clearErrors("selectedMaterialSlugs"); }}
                        aria-invalid={Boolean(errors.selectedMaterialSlugs)}
                        aria-describedby={errors.selectedMaterialSlugs ? "error-selected-materials" : undefined}
                        placeholder="Pavyzdžiui: šviesus fonas, ramus pilkas raštas"
                      />
                      <FieldError id="error-selected-materials">{errors.selectedMaterialSlugs}</FieldError>
                    </div>
                  </div>
                ) : null}

                {step === 3 ? (
                  <div className="planner-fields">
                    <div className="planner-field">
                      <label htmlFor="planner-location">Miestas arba savivaldybė <span>*</span></label>
                      <input id="planner-location" type="text" autoComplete="address-level2" value={data.location} onChange={(event) => updateField("location", event.target.value)} aria-invalid={Boolean(errors.location)} aria-describedby={errors.location ? "error-location" : undefined} placeholder="Vilnius" />
                      <FieldError id="error-location">{errors.location}</FieldError>
                    </div>

                    <fieldset className="planner-fieldset">
                      <legend>Projekto etapas <span>*</span></legend>
                      <div className="planner-choice-grid" id="planner-stage" tabIndex={-1}>
                        {stageOptions.map((option) => (
                          <Choice key={option.value} name="project-stage" option={option} checked={data.projectStage === option.value} onChange={(value) => updateField("projectStage", value)} />
                        ))}
                      </div>
                      <FieldError id="error-project-stage">{errors.projectStage}</FieldError>
                    </fieldset>

                    <fieldset className="planner-fieldset planner-fieldset--compact">
                      <legend>Pageidaujamas laikotarpis <span>*</span></legend>
                      <div className="planner-check-grid" id="planner-timing" tabIndex={-1}>
                        {timingOptions.map((option) => (
                          <Choice key={option.value} name="timing" option={option} checked={data.timing === option.value} onChange={(value) => updateField("timing", value)} />
                        ))}
                      </div>
                      <FieldError id="error-timing">{errors.timing}</FieldError>
                    </fieldset>

                    <div className="planner-field">
                      <label htmlFor="planner-site-notes">Papildoma informacija <span>(nebūtina)</span></label>
                      <textarea id="planner-site-notes" rows={3} value={data.siteNotes} onChange={(event) => updateField("siteNotes", event.target.value)} placeholder="Patekimas į objektą, baldų gamybos eiga ar kitos svarbios aplinkybės" />
                    </div>
                  </div>
                ) : null}

                {step === 4 ? (
                  <div className="planner-fields">
                    <div className="planner-field-grid">
                      <div className="planner-field">
                        <label htmlFor="planner-name">Vardas <span>*</span></label>
                        <input id="planner-name" type="text" autoComplete="name" value={data.contactName} onChange={(event) => updateField("contactName", event.target.value)} aria-invalid={Boolean(errors.contactName)} aria-describedby={errors.contactName ? "error-contact-name" : undefined} />
                        <FieldError id="error-contact-name">{errors.contactName}</FieldError>
                      </div>
                      <div className="planner-field">
                        <label htmlFor="planner-company">Įmonė <span>(nebūtina)</span></label>
                        <input id="planner-company" type="text" autoComplete="organization" value={data.company} onChange={(event) => updateField("company", event.target.value)} />
                      </div>
                    </div>

                    <div className="planner-field-grid">
                      <div className="planner-field">
                        <label htmlFor="planner-email">El. paštas</label>
                        <input id="planner-email" type="email" inputMode="email" autoComplete="email" value={data.email} onChange={(event) => updateField("email", event.target.value)} aria-invalid={Boolean(errors.email || errors.contact)} aria-describedby={errors.email ? "error-email" : errors.contact ? "error-contact" : undefined} />
                        <FieldError id="error-email">{errors.email}</FieldError>
                        {!errors.email ? <FieldError id="error-contact">{errors.contact}</FieldError> : null}
                      </div>
                      <div className="planner-field">
                        <label htmlFor="planner-phone">Telefono numeris</label>
                        <input id="planner-phone" type="tel" inputMode="tel" autoComplete="tel" value={data.phone} onChange={(event) => updateField("phone", event.target.value)} aria-invalid={Boolean(errors.phone || errors.contact)} aria-describedby={errors.phone ? "error-phone" : undefined} placeholder="+370" />
                        <FieldError id="error-phone">{errors.phone}</FieldError>
                      </div>
                    </div>

                    <fieldset className="planner-fieldset planner-fieldset--compact">
                      <legend>Pageidaujamas ryšio būdas <span>(nebūtina)</span></legend>
                      <div className="planner-check-grid planner-check-grid--contact" id="planner-contact-preference" tabIndex={-1}>
                        {contactPreferenceOptions.map((option) => (
                          <Choice key={option.value} name="contact-preference" option={option} checked={data.contactPreference === option.value} onChange={(value) => updateField("contactPreference", value)} />
                        ))}
                      </div>
                      <FieldError id="error-contact-preference">{errors.contactPreference}</FieldError>
                    </fieldset>

                    <p className="planner-local-notice">Šiuo metu tai demonstracinė forma — informacija nebus išsiųsta.</p>
                  </div>
                ) : null}
              </div>

              <footer className="planner-form-actions">
                {step > 0 ? (
                  <button type="button" className="planner-button planner-button--secondary" onClick={() => goToStep(step - 1)}>
                    <ArrowLeft aria-hidden="true" size={16} strokeWidth={1.7} /> Atgal
                  </button>
                ) : <span />}
                <button type="submit" className="planner-button planner-button--primary">
                  {step === steps.length - 1 ? "Peržiūrėti" : "Tęsti"}
                  <ArrowRight aria-hidden="true" size={16} strokeWidth={1.7} />
                </button>
              </footer>
            </form>
          ) : (
            <div className="planner-review">
              <header className="planner-step__header planner-review__header">
                <span>Peržiūra</span>
                <h2 tabIndex={-1} ref={headingRef}>Projekto informacija</h2>
              </header>

              <div className="planner-review__sections">
                <ReviewSection id="gaminys" title="Gaminys" onEdit={() => goToStep(0)}>
                  <SummaryRows><SummaryRow term="Tipas">{labelFor(projectTypeLabels, data.projectType)}</SummaryRow></SummaryRows>
                </ReviewSection>

                <ReviewSection id="projektas" title="Projektas" onEdit={() => goToStep(1)}>
                  <SummaryRows>
                    <SummaryRow term="Aprašymas">{data.projectDescription}</SummaryRow>
                    <SummaryRow term="Matmenys">{data.dimensions || labelFor(dimensionLabels, data.dimensionsStatus)}</SummaryRow>
                    <SummaryRow term="Detalės">{joinLabels(detailLabels, data.detailFlags)}</SummaryRow>
                    <SummaryRow term="Failai">{projectFiles.length > 0 ? `${projectFiles.length} pridėta` : "Nėra"}</SummaryRow>
                  </SummaryRows>
                  {projectFiles.length > 0 ? (
                    <ul className="planner-review-files">
                      {projectFiles.map(({ id, file }) => <li key={id}><FileIcon aria-hidden="true" size={14} />{file.name}</li>)}
                    </ul>
                  ) : null}
                </ReviewSection>

                <ReviewSection id="akmuo" title="Akmuo" onEdit={() => goToStep(2)}>
                  <SummaryRows>
                    <SummaryRow term="Pasirinkimas">{labelFor(stoneDecisionLabels, data.stoneDecision)}</SummaryRow>
                    <SummaryRow term="Rūšys">{joinLabels(categoryLabels, data.stoneCategories)}</SummaryRow>
                    <SummaryRow term="Akmenys">{selectedMaterialNames.join(", ") || data.stoneNotes || "Nenurodyta"}</SummaryRow>
                  </SummaryRows>
                </ReviewSection>

                <ReviewSection id="vieta" title="Vieta ir eiga" onEdit={() => goToStep(3)}>
                  <SummaryRows>
                    <SummaryRow term="Vieta">{data.location}</SummaryRow>
                    <SummaryRow term="Etapas">{labelFor(stageLabels, data.projectStage)}</SummaryRow>
                    <SummaryRow term="Laikotarpis">{labelFor(timingLabels, data.timing)}</SummaryRow>
                  </SummaryRows>
                </ReviewSection>

                <ReviewSection id="kontaktai" title="Kontaktai" onEdit={() => goToStep(4)}>
                  <SummaryRows>
                    <SummaryRow term="Vardas">{data.contactName}</SummaryRow>
                    <SummaryRow term="El. paštas">{data.email || "Nenurodyta"}</SummaryRow>
                    <SummaryRow term="Telefonas">{data.phone || "Nenurodyta"}</SummaryRow>
                    <SummaryRow term="Ryšio būdas">{labelFor(contactPreferenceLabels, data.contactPreference)}</SummaryRow>
                  </SummaryRows>
                </ReviewSection>
              </div>

              <section className="planner-export-panel" aria-labelledby="planner-export-title">
                <div><h3 id="planner-export-title">Išsisaugokite santrauką</h3><p>Užklausos siuntimas bus prijungtas vėliau.</p></div>
                <div className="planner-export-actions">
                  <button type="button" className="planner-button planner-button--primary" onClick={copySummary}><Clipboard aria-hidden="true" size={16} strokeWidth={1.7} /> Kopijuoti</button>
                  <button type="button" className="planner-button planner-button--secondary" onClick={downloadSummary}><Download aria-hidden="true" size={16} strokeWidth={1.7} /> Atsisiųsti</button>
                </div>
                <p className="planner-export-status" aria-live="polite">{exportStatus}</p>
              </section>

              <footer className="planner-review__footer">
                <button type="button" className="planner-reset-button" onClick={resetPlanner}><RotateCcw aria-hidden="true" size={15} strokeWidth={1.7} /> Pradėti iš naujo</button>
              </footer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
