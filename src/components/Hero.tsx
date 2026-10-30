import { site } from "../data/site";
import { linkWhatsapp } from "../lib/whatsapp";
import { Botao } from "./Botao";
import { Placeholder } from "./Placeholder";

export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-titulo"
      className="secao-padrao secao-branca"
      style={{
        backgroundImage:
          "radial-gradient(circle at 12% 15%, rgb(251 230 232 / 0.85), transparent 45%), radial-gradient(circle at 88% 85%, rgb(250 240 242 / 0.9), transparent 50%)",
      }}
    >
      <div className="container-site grid grid-cols-1 min-[900px]:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Coluna de texto */}
        <div className="min-[900px]:col-span-6 flex flex-col items-start">
          <p
            className="mb-3 text-base font-bold tracking-wide"
            style={{ color: "var(--cor-salvia-escuro)" }}
          >
            {site.marca.destaquePublico}
          </p>

          <h1 id="hero-titulo" className="mb-5">
            {site.hero.titulo}
          </h1>

          <p
            className="mb-5 text-lg sm:text-xl leading-relaxed"
            style={{ color: "var(--cor-texto-suave)" }}
          >
            {site.hero.subtitulo}
          </p>

          <p
            className="mb-8 text-xl sm:text-2xl italic font-semibold"
            style={{
              fontFamily: "var(--fonte-titulo)",
              color: "var(--cor-salvia-escuro)",
            }}
          >
            {site.marca.assinatura}
          </p>

          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <Botao
              href={linkWhatsapp(site.ctas.heroPrim.msg)}
              variante="primario"
              externo
              iconeWhatsapp
              className="w-full sm:w-auto"
            >
              {site.ctas.heroPrim.texto}
            </Botao>

            <Botao
              href={site.ctas.heroSec.href}
              variante="secundario"
              className="w-full sm:w-auto"
            >
              {site.ctas.heroSec.texto}
            </Botao>
          </div>
        </div>

        {/* Coluna da imagem do produto em uso */}
        <div className="min-[900px]:col-span-6">
          <figure className="m-0">
            <div
              className="overflow-hidden border"
              style={{
                borderRadius: "var(--raio-lg)",
                borderColor: "var(--cor-bege-escuro)",
                boxShadow: "var(--sombra)",
                backgroundColor: "var(--cor-bege)",
              }}
            >
              <img
                src={site.hero.imagem.src}
                alt={site.hero.imagem.alt}
                width={site.hero.imagem.largura}
                height={site.hero.imagem.altura}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-auto object-cover"
              />
            </div>
            {site.mostrarAvisosPlaceholderMidia && site.hero.imagem.placeholderFoto && (
              <figcaption className="mt-3">
                <Placeholder texto={site.hero.imagem.placeholderFoto} bloco />
              </figcaption>
            )}
          </figure>
        </div>
      </div>
    </section>
  );
}
