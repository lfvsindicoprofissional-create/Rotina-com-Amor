import React from "react";
import { site } from "../data/site";
import { IconeWhatsapp } from "./Icone";

interface BotaoProps {
  href: string;
  variante?: "primario" | "secundario" | "whatsapp";
  externo?: boolean;
  iconeWhatsapp?: boolean;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export function Botao({
  href,
  variante = "primario",
  externo = false,
  iconeWhatsapp = false,
  className = "",
  onClick,
  children,
}: BotaoProps) {
  const classeVariante =
    variante === "whatsapp"
      ? "botao-whatsapp"
      : variante === "secundario"
        ? "botao-secundario"
        : "botao-primario";

  return (
    <a
      href={href}
      className={`botao ${classeVariante} ${className}`.trim()}
      target={externo ? "_blank" : undefined}
      rel={externo ? "noopener noreferrer" : undefined}
      onClick={onClick}
    >
      {iconeWhatsapp && <IconeWhatsapp className="w-5 h-5 shrink-0" />}
      <span>{children}</span>
      {externo && (
        <span className="sr-only"> {site.acessibilidade.abreNovaAba}</span>
      )}
    </a>
  );
}
