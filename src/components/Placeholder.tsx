import { site } from "../data/site";

interface PlaceholderProps {
  texto: string;
  bloco?: boolean;
  className?: string;
}

export function Placeholder({
  texto,
  bloco = false,
  className = "",
}: PlaceholderProps) {
  return (
    <span
      className={`placeholder-box ${bloco ? "flex w-full my-2" : "inline-flex"} ${className}`.trim()}
      role="note"
      aria-label={`${site.acessibilidade.campoEditavel} ${texto}`}
    >
      <span
        aria-hidden="true"
        className="inline-block w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: "var(--cor-rosa-escuro)" }}
      />
      <span>{texto}</span>
    </span>
  );
}
