type VeinLineProps = {
  className?: string;
  inverse?: boolean;
};

export function VeinLine({ className = "", inverse = false }: VeinLineProps) {
  return (
    <svg
      className={`vein-line ${className}`.trim()}
      data-inverse={inverse || undefined}
      viewBox="0 0 900 120"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path
        d="M0 72C89 40 126 94 217 59C309 24 330 93 429 51C511 17 556 78 646 47C741 14 798 57 900 25"
        pathLength="1"
      />
      <path
        className="vein-line__branch"
        d="M216 59C242 68 259 88 274 118M646 47C672 53 691 74 706 96"
        pathLength="1"
      />
    </svg>
  );
}
