import { site } from "../data/site";
import { IconeAtividadeSvg } from "./Icone";

export function Atividades() {
  return (
    <section
      id="atividades"
      aria-labelledby="atividades-titulo"
      className="secao-padrao secao-branca"
    >
      <div className="container-site">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p
            className="mb-2 text-base font-bold"
            style={{ color: "var(--cor-salvia-escuro)" }}
          >
            {site.atividades.rotuloSecao}
          </p>
          <h2 id="atividades-titulo" className="mb-4">
            {site.atividades.titulo}
          </h2>
          <p
            className="text-lg mb-0"
            style={{ color: "var(--cor-texto-suave)" }}
          >
            {site.atividades.subtitulo}
          </p>
        </div>

        {/* 8 cartões visuais imitando os cartões do quadro */}
        <ul className="list-none m-0 p-0 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {site.atividades.itens.map((item) => (
            <li
              key={item.nome}
              className="flex flex-col items-center justify-center text-center p-6 border"
              style={{
                backgroundColor: "var(--cor-bege)",
                borderColor: "var(--cor-bege-escuro)",
                borderRadius: "var(--raio-md)",
                boxShadow: "var(--sombra)",
              }}
            >
              {"imagem" in item && Boolean((item as { imagem?: string }).imagem) ? (
                <div
                  className="w-20 h-28 rounded-xl overflow-hidden mb-4 border shadow-xs bg-white"
                  style={{ borderColor: "var(--cor-bege-escuro)" }}
                >
                  <img
                    src={(item as { imagem?: string }).imagem}
                    alt={`Cartão ilustrado ${item.nome}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ) : (
                <span
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 border"
                  style={{
                    backgroundColor: "var(--cor-branco)",
                    borderColor: "var(--cor-salvia)",
                    color: "var(--cor-salvia-escuro)",
                  }}
                >
                  <IconeAtividadeSvg icone={((item as Record<string, unknown>).icone as any) || "brincar"} />
                </span>
              )}

              <span
                className="text-lg font-bold leading-snug"
                style={{ color: "var(--cor-texto)" }}
              >
                {item.nome}
              </span>
            </li>
          ))}
        </ul>

        {/* Aviso obrigatório legível logo abaixo */}
        <div
          className="mt-8 p-5 rounded-2xl border text-center max-w-3xl mx-auto"
          style={{
            backgroundColor: "var(--cor-bege)",
            borderColor: "var(--cor-bege-escuro)",
          }}
        >
          <p
            className="mb-0 text-base sm:text-lg font-medium"
            style={{ color: "var(--cor-texto)" }}
          >
            <em>{site.atividades.aviso}</em>
          </p>
        </div>
      </div>
    </section>
  );
}
