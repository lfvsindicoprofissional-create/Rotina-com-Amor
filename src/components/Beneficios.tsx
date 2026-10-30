import { site } from "../data/site";
import { IconeBeneficioSvg } from "./Icone";

export function Beneficios() {
  return (
    <section
      id="beneficios"
      aria-labelledby="beneficios-titulo"
      className="secao-padrao secao-bege"
    >
      <div className="container-site">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p
            className="mb-2 text-base font-bold"
            style={{ color: "var(--cor-salvia-escuro)" }}
          >
            {site.beneficiosCabecalho.rotuloSecao}
          </p>
          <h2 id="beneficios-titulo" className="mb-4">
            {site.beneficiosCabecalho.titulo}
          </h2>
          <p
            className="text-lg mb-0"
            style={{ color: "var(--cor-texto-suave)" }}
          >
            {site.beneficiosCabecalho.subtitulo}
          </p>
        </div>

        <ul
          className="list-none m-0 p-0 grid gap-5"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {site.beneficios.map((item) => (
            <li
              key={item.texto}
              className="flex flex-col items-start p-6 border"
              style={{
                backgroundColor: "var(--cor-branco)",
                borderColor: "var(--cor-bege-escuro)",
                borderRadius: "var(--raio-md)",
                boxShadow: "var(--sombra)",
              }}
            >
              <span
                className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4"
                style={{
                  backgroundColor: "var(--cor-bege)",
                  color: "var(--cor-salvia-escuro)",
                }}
              >
                <IconeBeneficioSvg icone={item.icone} />
              </span>
              <p
                className="mb-0 text-lg font-bold leading-snug"
                style={{ color: "var(--cor-texto)" }}
              >
                {item.texto}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
