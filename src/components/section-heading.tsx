type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  body?: string;
  align?: "start" | "split";
  id?: string;
};

export function SectionHeading({ eyebrow, title, body, align = "start", id }: SectionHeadingProps) {
  return (
    <header className={`section-heading section-heading--${align}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="display-title" id={id}>
        {title}
      </h2>
      {body ? <p className="lede">{body}</p> : null}
    </header>
  );
}
