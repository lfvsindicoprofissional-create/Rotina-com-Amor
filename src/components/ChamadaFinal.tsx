import { site } from "../data/site";
import { linkWhatsapp, whatsappConfigurado } from "../lib/whatsapp";
import { Botao } from "./Botao";
import { Placeholder } from "./Placeholder";

export function ChamadaFinal() {
  const temNumero = whatsappConfigurado();

  return (
    <section
      id="contato"
      aria-labelledby="contato-titulo"
      className="secao-padrao secao-branca"
    >
      <div className="container-site">
        <div
          className="max-w-3xl mx-auto text-center p-8 sm:p-12 border"
          style={{
            backgroundColor: "var(--cor-bege)",
            borderColor: "var(--cor-bege-escuro)",
            borderRadius: "var(--raio-lg)",
            boxShadow: "var(--sombra)",
          }}
        >
          <p
            className="mb-2 text-base font-bold"
            style={{ color: "var(--cor-salvia-escuro)" }}
          >
            {site.chamadaFinal.rotuloSecao}
          </p>

          <h2 id="contato-titulo" className="mb-4">
            {site.chamadaFinal.titulo}
          </h2>

          <p
            className="text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-8"
            style={{ color: "var(--cor-texto-suave)" }}
          >
            {site.chamadaFinal.texto}
          </p>

          <div className="flex justify-center">
            <Botao
              href={linkWhatsapp(site.ctas.final.msg)}
              variante="whatsapp"
              externo
              iconeWhatsapp
              className="text-lg px-8 py-4"
            >
              {site.ctas.final.texto}
            </Botao>
          </div>

          {!temNumero && (
            <div className="mt-6 max-w-xl mx-auto text-left">
              <Placeholder
                texto={site.chamadaFinal.avisoWhatsappPendente}
                bloco
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
