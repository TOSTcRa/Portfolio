const base =
  "inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md px-5 text-sm font-medium transition-[transform,background-color,color] duration-200 active:scale-[0.98] focus-visible:outline-2";

const variants = {
  primary: "bg-accent text-accent-fg hover:opacity-90",
  secondary: "border border-line bg-transparent text-fg hover:bg-bg-raised",
} as const;

export function buttonClasses(variant: keyof typeof variants): string {
  return `${base} ${variants[variant]}`;
}
