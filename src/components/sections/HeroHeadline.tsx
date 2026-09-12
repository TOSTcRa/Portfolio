// Storytelling: the two headline lines rise out of a clip mask one after the other.
// Pure CSS so the text is painted (LCP) before hydration; see .hero-line in globals.css.
export function HeroHeadline({ lines }: { lines: [string, string] }) {
  return (
    <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[2.5rem] xl:text-[3.25rem]">
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden pb-1">
          <span className="hero-line block" style={{ animationDelay: `${0.1 + i * 0.12}s` }}>
            {line}
          </span>
        </span>
      ))}
    </h1>
  );
}
