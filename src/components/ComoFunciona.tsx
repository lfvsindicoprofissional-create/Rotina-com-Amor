import { site } from "../data/site";
import { IconePassoSvg } from "./Icone";

export function ComoFunciona() {
  return (
    <section
      id="como-funciona"
      aria-labelledby="como-funciona-titulo"
      className="secao-padrao secao-branca"
    >
      <div className="container-site">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p
            className="mb-2 text-base font-bold"
            style={{ color: "var(--cor-salvia-escuro)" }}
          >
            {site.comoFunciona.rotuloSecao}
          </p>
          <h2 id="como-funciona-titulo" className="mb-4">
            {site.comoFunciona.titulo}
          </h2>
          <p
            className="text-lg mb-0"
            style={{ color: "var(--cor-texto-suave)" }}
          >
            {site.comoFunciona.subtitulo}
          </p>
        </div>

        <ol className="list-none m-0 p-0 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {site.passos.map((passo) => (
            <li
              key={passo.numero}
              className="flex flex-col items-start p-7 border"
              style={{
                backgroundColor: "var(--cor-bege)",
                borderColor: "var(--cor-bege-escuro)",
                borderRadius: "var(--raio-md)",
                boxShadow: "var(--sombra)",
              }}
            >
              <div className="w-full flex items-center justify-between gap-4 mb-6">
                <span
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full text-lg font-bold tabular-nums"
                  style={{
                    backgroundColor: "var(--cor-salvia-escuro)",
                    color: "var(--cor-branco)",
                    fontFamily: "var(--fonte-titulo)",
                  }}
                >
                  {passo.numero}
                </span>

                <span
                  className="inline-flex items-center justify-center w-12 h-12 rounded-2xl"
                  style={{
                    backgroundColor: "var(--cor-branco)",
                    color: "var(--cor-salvia-escuro)",
                  }}
                >
                  <IconePassoSvg icone={passo.icone} />
                </span>
              </div>

              <h3 className="mb-0 text-xl leading-snug">{passo.titulo}</h3>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
