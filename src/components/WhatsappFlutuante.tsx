import { useEffect, useState } from "react";
import { site } from "../data/site";
import { linkWhatsapp } from "../lib/whatsapp";
import { IconeWhatsapp } from "./Icone";

interface WhatsappFlutuanteProps {
  menuMovelAberto?: boolean;
}

export function WhatsappFlutuante({
  menuMovelAberto = false,
}: WhatsappFlutuanteProps) {
  const [secaoFinalVisivel, setSecaoFinalVisivel] = useState(false);

  useEffect(() => {
    const alvos = [
      document.querySelector("#contato"),
      document.querySelector("footer"),
    ].filter((el): el is Element => el !== null);

    if (alvos.length === 0 || typeof IntersectionObserver === "undefined") {
      return;
    }

    const visiveis = new Set<Element>();
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) {
            visiveis.add(entrada.target);
          } else {
            visiveis.delete(entrada.target);
          }
        }
        setSecaoFinalVisivel(visiveis.size > 0);
      },
      { threshold: 0.1 }
    );

    alvos.forEach((alvo) => observador.observe(alvo));
    return () => observador.disconnect();
  }, []);

  const oculto = secaoFinalVisivel || menuMovelAberto;

  return (
    <a
      href={linkWhatsapp(site.ctas.flutuante.msg)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${site.ctas.flutuante.rotulo} ${site.acessibilidade.abreNovaAba}`}
      data-whatsapp-flutuante=""
      data-oculto={oculto ? "" : undefined}
      tabIndex={oculto ? -1 : 0}
      aria-hidden={oculto ? "true" : undefined}
      className="whatsapp-fab"
    >
      <IconeWhatsapp className="w-7 h-7" />
    </a>
  );
}
