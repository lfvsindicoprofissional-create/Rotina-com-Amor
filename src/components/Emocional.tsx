import { site } from "../data/site";

export function Emocional() {
  return (
    <section
      id="nosso-jeito"
      aria-labelledby="emocional-titulo"
      className="secao-padrao secao-rosa"
    >
      <div className="container-site">
        <div
          className="max-w-[65ch] mx-auto text-center py-4 sm:py-6 px-4 sm:px-8"
        >
          {/* Elemento decorativo leve e acolhedor */}
          <div className="flex justify-center mb-5" aria-hidden="true">
            <span
              className="inline-flex items-center justify-center w-14 h-14 rounded-full"
              style={{
                backgroundColor: "var(--cor-branco)",
                color: "var(--cor-rosa-escuro)",
                boxShadow: "var(--sombra)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-7 h-7"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </span>
          </div>

          <p
            className="mb-2 text-base font-bold"
            style={{ color: "var(--cor-salvia-escuro)" }}
          >
            {site.emocional.rotuloSecao}
          </p>

          <h2 id="emocional-titulo" className="mb-5">
            {site.emocional.titulo}
          </h2>

          <p
            className="text-lg sm:text-xl leading-relaxed mb-0"
            style={{ color: "var(--cor-texto)" }}
          >
            {site.emocional.texto}
          </p>
        </div>
      </div>
    </section>
  );
}
