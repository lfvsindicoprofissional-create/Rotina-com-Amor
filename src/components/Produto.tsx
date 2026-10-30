import { useState } from "react";
import { site } from "../data/site";
import { Placeholder } from "./Placeholder";
import { QuadroVisualInterativo } from "./QuadroVisualInterativo";

export function Produto() {
  const [modoVisualizacao, setModoVisualizacao] = useState<"interativo" | "foto">("interativo");

  return (
    <section
      id="produto"
      aria-labelledby="produto-titulo"
      className="secao-padrao secao-bege"
    >
      <div className="container-site">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <p
            className="mb-2 text-base font-bold"
            style={{ color: "var(--cor-salvia-escuro)" }}
          >
            {site.produto.rotuloSecao}
          </p>
          <h2 id="produto-titulo" className="mb-5">
            {site.produto.titulo}
          </h2>
          <p
            className="text-lg leading-relaxed mb-6"
            style={{ color: "var(--cor-texto-suave)" }}
          >
            {site.produto.texto}
          </p>

          {/* Alternador de visualização: Interativo vs Foto */}
          <div className="inline-flex items-center p-1 rounded-full border mb-4" style={{ backgroundColor: "#FFFFFF", borderColor: "var(--cor-bege-escuro)" }}>
            <button
              type="button"
              onClick={() => setModoVisualizacao("interativo")}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold cursor-pointer transition-colors ${
                modoVisualizacao === "interativo"
                  ? "text-white"
                  : "text-slate-700 hover:text-black"
              }`}
              style={{
                backgroundColor:
                  modoVisualizacao === "interativo"
                    ? "var(--cor-rosa-escuro)"
                    : "transparent",
              }}
            >
              ⏱️ Quadro Interativo (Programar Horários)
            </button>
            <button
              type="button"
              onClick={() => setModoVisualizacao("foto")}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold cursor-pointer transition-colors ${
                modoVisualizacao === "foto"
                  ? "text-white"
                  : "text-slate-700 hover:text-black"
              }`}
              style={{
                backgroundColor:
                  modoVisualizacao === "foto"
                    ? "var(--cor-rosa-escuro)"
                    : "transparent",
              }}
            >
              🖼️ Visualização do Quadro Físico
            </button>
          </div>
        </div>

        {/* Quadro Interativo com programação de horários ou imagem ampla */}
        <div className="mb-10">
          {modoVisualizacao === "interativo" ? (
            <QuadroVisualInterativo />
          ) : (
            <figure className="m-0">
              <div
                className="overflow-hidden border"
                style={{
                  borderRadius: "var(--raio-lg)",
                  borderColor: "var(--cor-bege-escuro)",
                  backgroundColor: "var(--cor-branco)",
                  boxShadow: "var(--sombra)",
                }}
              >
                <img
                  src={site.produto.imagemPrincipal.src}
                  alt={site.produto.imagemPrincipal.alt}
                  width={site.produto.imagemPrincipal.largura}
                  height={site.produto.imagemPrincipal.altura}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-cover"
                />
              </div>
              <figcaption
                className="mt-3 text-center text-base"
                style={{ color: "var(--cor-texto-suave)" }}
              >
                {site.produto.imagemPrincipal.legenda}
              </figcaption>
              {site.mostrarAvisosPlaceholderMidia && site.produto.imagemPrincipal.placeholderFoto && (
                <div className="mt-2">
                  <Placeholder
                    texto={site.produto.imagemPrincipal.placeholderFoto}
                    bloco
                  />
                </div>
              )}
            </figure>
          )}
        </div>

        {/* Grade de 3 detalhes dos cartões */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {site.produto.detalhes.map((detalhe) => (
            <figure
              key={detalhe.titulo}
              className="m-0 flex flex-col overflow-hidden border p-4"
              style={{
                backgroundColor: "var(--cor-branco)",
                borderColor: "var(--cor-bege-escuro)",
                borderRadius: "var(--raio-md)",
                boxShadow: "var(--sombra)",
              }}
            >
              <div
                className="overflow-hidden mb-4 border aspect-[4/3] bg-neutral-100 flex items-center justify-center"
                style={{
                  borderRadius: "var(--raio-sm)",
                  borderColor: "var(--cor-bege-escuro)",
                }}
              >
                <img
                  src={detalhe.src}
                  alt={detalhe.alt}
                  width={detalhe.largura}
                  height={detalhe.altura}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="flex-1 flex flex-col">
                <h3 className="mb-2">{detalhe.titulo}</h3>
                <p
                  className="text-base mb-0"
                  style={{ color: "var(--cor-texto-suave)" }}
                >
                  {detalhe.legenda}
                </p>
                {site.mostrarAvisosPlaceholderMidia && detalhe.placeholderFoto && (
                  <div className="mt-3 pt-2">
                    <Placeholder texto={detalhe.placeholderFoto} bloco />
                  </div>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
