// Storytelling: the two headline lines rise out of a clip mask one after the other.
// Pure CSS so the text is painted (LCP) before hydration; see .hero-line in globals.css.
export function HeroHeadline({ lines }: { lines: [string, string] }) {
  return (
    <h1 className="text-5xl font-bold leading-[0.98] tracking-tighter sm:text-6xl xl:text-7xl">
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden pb-[0.12em]">
          <span className="hero-line block" style={{ animationDelay: `${0.1 + i * 0.12}s` }}>
            {line}
          </span>
        </span>
      ))}
    </h1>
  );
}
