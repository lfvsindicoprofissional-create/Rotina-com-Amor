import { ehPreencher, site } from "../data/site";
import { Placeholder } from "./Placeholder";

export function Faq() {
  return (
    <section
      id="perguntas-frequentes"
      aria-labelledby="faq-titulo"
      className="secao-padrao secao-bege"
    >
      <div className="container-site max-w-3xl">
        <div className="text-center mb-12">
          <p
            className="mb-2 text-base font-bold"
            style={{ color: "var(--cor-salvia-escuro)" }}
          >
            {site.faqCabecalho.rotuloSecao}
          </p>
          <h2 id="faq-titulo" className="mb-4">
            {site.faqCabecalho.titulo}
          </h2>
          <p
            className="text-lg mb-0"
            style={{ color: "var(--cor-texto-suave)" }}
          >
            {site.faqCabecalho.subtitulo}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {site.faq.map((item, indice) => {
            const respostaEhPlaceholder = ehPreencher(item.resposta);
            const possuiComplementoPlaceholder = ehPreencher(item.complementar);

            return (
              <details
                key={item.pergunta}
                className="faq-item"
                open={indice === 0}
              >
                <summary className="faq-summary">
                  <span>{item.pergunta}</span>
                  <span className="faq-icone" aria-hidden="true">
                    <span className="faq-icone-mais">+</span>
                    <span className="faq-icone-menos">−</span>
                  </span>
                </summary>

                <div
                  className="px-6 pb-6 pt-1 text-base leading-relaxed border-t"
                  style={{
                    color: "var(--cor-texto-suave)",
                    borderColor: "var(--cor-bege)",
                  }}
                >
                  {respostaEhPlaceholder ? (
                    <Placeholder texto={item.resposta} bloco />
                  ) : (
                    <p className="mb-0">{item.resposta}</p>
                  )}

                  {possuiComplementoPlaceholder && item.complementar && (
                    <div className="mt-3">
                      <Placeholder texto={item.complementar} bloco />
                    </div>
                  )}
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}
