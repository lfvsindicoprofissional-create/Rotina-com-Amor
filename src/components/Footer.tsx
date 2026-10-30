import { ehPreencher, site } from "../data/site";
import { linkWhatsapp, whatsappConfigurado } from "../lib/whatsapp";
import { Placeholder } from "./Placeholder";

interface FooterProps {
  onAbrirPrivacidade?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  onIrParaInicio?: () => void;
}

export function Footer({ onAbrirPrivacidade, onIrParaInicio }: FooterProps) {
  const anoAtual = new Date().getFullYear();
  const temWhatsapp = whatsappConfigurado();
  const emailEhPlaceholder = ehPreencher(site.contato.email);
  const temInstagram = Boolean(site.contato.instagram.trim());
  const outrasRedesPreenchidas = site.contato.outrasRedes.filter((r) =>
    Boolean(r.url.trim())
  );

  return (
    <footer
      className="border-t py-12"
      style={{
        backgroundColor: "var(--cor-bege)",
        borderColor: "var(--cor-bege-escuro)",
        color: "var(--cor-texto)",
      }}
    >
      <div className="container-site">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b" style={{ borderColor: "var(--cor-bege-escuro)" }}>
          {/* Coluna 1: Marca e assinatura */}
          <div className="md:col-span-5">
            <p
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "var(--fonte-titulo)" }}
            >
              {site.marca.nome}
            </p>
            <p
              className="text-lg italic mb-3"
              style={{
                fontFamily: "var(--fonte-titulo)",
                color: "var(--cor-salvia-escuro)",
              }}
            >
              {site.marca.assinatura}
            </p>
            <p
              className="text-base mb-0 max-w-sm"
              style={{ color: "var(--cor-texto-suave)" }}
            >
              {site.seo.descricao}
            </p>
          </div>

          {/* Coluna 2: Navegação */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-bold mb-3">
              {site.rodape.tituloNavegacao}
            </h3>
            <ul className="list-none m-0 p-0 flex flex-col gap-2">
              {site.menu.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => onIrParaInicio?.()}
                    className="no-underline hover:underline underline-offset-4 text-base"
                    style={{ color: "var(--cor-texto-suave)" }}
                  >
                    {item.texto}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3: Contato e redes */}
          <div className="md:col-span-4">
            <h3 className="text-lg font-bold mb-3">
              {site.rodape.tituloContato}
            </h3>
            <ul className="list-none m-0 p-0 flex flex-col gap-3">
              <li>
                <span
                  className="block text-sm font-bold"
                  style={{ color: "var(--cor-salvia-escuro)" }}
                >
                  {site.rodape.rotuloWhatsapp}
                </span>
                {temWhatsapp ? (
                  <a
                    href={linkWhatsapp()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline underline-offset-4"
                    style={{ color: "var(--cor-texto)" }}
                  >
                    {site.contato.whatsappNumeroExibicao ||
                      site.contato.whatsappNumero}
                    <span className="sr-only">
                      {" "}
                      {site.acessibilidade.abreNovaAba}
                    </span>
                  </a>
                ) : (
                  <Placeholder
                    texto={site.contato.whatsappNumeroExibicao}
                    bloco
                  />
                )}
              </li>

              <li>
                <span
                  className="block text-sm font-bold"
                  style={{ color: "var(--cor-salvia-escuro)" }}
                >
                  {site.rodape.rotuloEmail}
                </span>
                {emailEhPlaceholder ? (
                  <Placeholder texto={site.contato.email} bloco />
                ) : (
                  <a
                    href={`mailto:${site.contato.email}`}
                    className="font-semibold underline underline-offset-4"
                    style={{ color: "var(--cor-texto)" }}
                  >
                    {site.contato.email}
                  </a>
                )}
              </li>

              {/* Só renderiza redes sociais quando preenchidas */}
              {temInstagram && (
                <li>
                  <a
                    href={site.contato.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline underline-offset-4"
                    style={{ color: "var(--cor-texto)" }}
                  >
                    {site.rodape.rotuloInstagram}
                    <span className="sr-only">
                      {" "}
                      {site.acessibilidade.abreNovaAba}
                    </span>
                  </a>
                </li>
              )}

              {outrasRedesPreenchidas.map((rede) => (
                <li key={rede.nome}>
                  <a
                    href={rede.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline underline-offset-4"
                    style={{ color: "var(--cor-texto)" }}
                  >
                    {rede.nome}
                    <span className="sr-only">
                      {" "}
                      {site.acessibilidade.abreNovaAba}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Linha final: Direitos e Links Legais */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm" style={{ color: "var(--cor-texto-suave)" }}>
          <p className="mb-0 text-center sm:text-left">
            © {anoAtual} {site.marca.nome}. {site.rodape.textoDireitos}
            {site.rodape.cnpj ? ` CNPJ: ${site.rodape.cnpj}` : ""}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            {site.rodape.linksLegais.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={
                  link.href === "/privacidade" ? onAbrirPrivacidade : undefined
                }
                className="underline underline-offset-4 font-semibold"
                style={{ color: "var(--cor-texto)" }}
              >
                {link.texto}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
