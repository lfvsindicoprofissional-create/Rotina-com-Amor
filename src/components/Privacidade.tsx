import { site } from "../data/site";
import { linkWhatsapp, whatsappConfigurado } from "../lib/whatsapp";

interface PrivacidadeProps {
  onVoltar: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function Privacidade({ onVoltar }: PrivacidadeProps) {
  const temWhatsapp = whatsappConfigurado();

  return (
    <section
      aria-labelledby="privacidade-titulo"
      className="secao-padrao secao-branca py-12 md:py-16"
      style={{ backgroundColor: "var(--cor-rosa-claro)" }}
    >
      <div className="container-site max-w-4xl">
        {/* Voltar ao início */}
        <div className="mb-8">
          <a
            href="#inicio"
            onClick={onVoltar}
            className="inline-flex items-center gap-2 font-bold underline underline-offset-4 text-base cursor-pointer hover:opacity-80 transition-opacity"
            style={{ color: "var(--cor-rosa-escuro)" }}
          >
            <span aria-hidden="true">←</span>
            <span>{site.privacidade.voltarTexto}</span>
          </a>
        </div>

        {/* Cabeçalho do documento */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border"
            style={{
              backgroundColor: "var(--cor-rosa-suave)",
              borderColor: "var(--cor-rosa)",
              color: "var(--cor-rosa-escuro)",
            }}
          >
            <span>LGPD • Lei nº 13.709/18</span>
          </div>

          <h1
            id="privacidade-titulo"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ fontFamily: "var(--fonte-titulo)", color: "var(--cor-texto)" }}
          >
            {site.privacidade.titulo}
          </h1>

          <div
            className="inline-block px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border mb-4"
            style={{
              backgroundColor: "var(--cor-bege)",
              borderColor: "var(--cor-bege-escuro)",
              color: "var(--cor-texto-suave)",
            }}
          >
            {site.privacidade.atualizacao}
          </div>

          <p
            className="text-lg leading-relaxed mt-2"
            style={{ color: "var(--cor-texto-suave)" }}
          >
            {site.privacidade.resumo}
          </p>
        </header>

        {/* Blocos da Política */}
        <div className="flex flex-col gap-6">
          {/* 1. Importância da Política de Privacidade */}
          <article
            className="p-6 sm:p-8 rounded-2xl border bg-white"
            style={{
              borderColor: "var(--cor-bege-escuro)",
              boxShadow: "var(--sombra)",
            }}
          >
            <h2
              className="text-xl sm:text-2xl font-bold mb-3"
              style={{ fontFamily: "var(--fonte-titulo)", color: "var(--cor-texto)" }}
            >
              Importância da Política de Privacidade
            </h2>
            <p className="text-base leading-relaxed mb-0" style={{ color: "var(--cor-texto)" }}>
              Com a crescente preocupação sobre proteção de dados, especialmente após a vigência da Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/18), é essencial que você conheça seus direitos e saiba como seus dados são tratados. Esta política é o seu compromisso de transparência e segurança ao utilizar nossos serviços.
            </p>
          </article>

          {/* 2. Definições Essenciais */}
          <article
            className="p-6 sm:p-8 rounded-2xl border bg-white"
            style={{
              borderColor: "var(--cor-bege-escuro)",
              boxShadow: "var(--sombra)",
            }}
          >
            <h2
              className="text-xl sm:text-2xl font-bold mb-4"
              style={{ fontFamily: "var(--fonte-titulo)", color: "var(--cor-texto)" }}
            >
              Definições Essenciais
            </h2>
            <ul className="list-none m-0 p-0 flex flex-col gap-3">
              <li className="p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-2" style={{ backgroundColor: "var(--cor-bege)", borderColor: "var(--cor-bege-escuro)" }}>
                <strong className="font-bold shrink-0" style={{ color: "var(--cor-rosa-escuro)" }}>
                  Dados Pessoais:
                </strong>
                <span className="text-sm sm:text-base" style={{ color: "var(--cor-texto)" }}>
                  Qualquer informação que possa identificar você, como nome, CPF, endereço IP, entre outros.
                </span>
              </li>
              <li className="p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-2" style={{ backgroundColor: "var(--cor-bege)", borderColor: "var(--cor-bege-escuro)" }}>
                <strong className="font-bold shrink-0" style={{ color: "var(--cor-rosa-escuro)" }}>
                  Dados Pessoais Sensíveis:
                </strong>
                <span className="text-sm sm:text-base" style={{ color: "var(--cor-texto)" }}>
                  Informações relacionadas a origem racial, convicções religiosas, saúde, vida sexual, entre outros dados protegidos por lei.
                </span>
              </li>
              <li className="p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-2" style={{ backgroundColor: "var(--cor-bege)", borderColor: "var(--cor-bege-escuro)" }}>
                <strong className="font-bold shrink-0" style={{ color: "var(--cor-rosa-escuro)" }}>
                  Tratamento de Dados:
                </strong>
                <span className="text-sm sm:text-base" style={{ color: "var(--cor-texto)" }}>
                  Qualquer operação com seus dados, desde a coleta até a exclusão.
                </span>
              </li>
              <li className="p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-2" style={{ backgroundColor: "var(--cor-bege)", borderColor: "var(--cor-bege-escuro)" }}>
                <strong className="font-bold shrink-0" style={{ color: "var(--cor-rosa-escuro)" }}>
                  Leis de Proteção de Dados:
                </strong>
                <span className="text-sm sm:text-base" style={{ color: "var(--cor-texto)" }}>
                  Legislação que regula o tratamento e proteção dos seus dados, incluindo a LGPD.
                </span>
              </li>
            </ul>
          </article>

          {/* 3. Como Utilizamos Seus Dados Pessoais */}
          <article
            className="p-6 sm:p-8 rounded-2xl border bg-white"
            style={{
              borderColor: "var(--cor-bege-escuro)",
              boxShadow: "var(--sombra)",
            }}
          >
            <h2
              className="text-xl sm:text-2xl font-bold mb-3"
              style={{ fontFamily: "var(--fonte-titulo)", color: "var(--cor-texto)" }}
            >
              Como Utilizamos Seus Dados Pessoais
            </h2>
            <p className="text-base mb-3" style={{ color: "var(--cor-texto)" }}>
              Coletamos e usamos seus dados para:
            </p>
            <ul className="list-disc pl-5 mb-4 flex flex-col gap-2 text-base" style={{ color: "var(--cor-texto)" }}>
              <li>
                <strong>Realizar vendas e entregas:</strong> Confirmar e processar suas compras.
              </li>
              <li>
                <strong>Comunicação:</strong> Enviar informações, ofertas e responder suas dúvidas.
              </li>
              <li>
                <strong>Personalização:</strong> Adaptar a experiência no Site conforme seus interesses.
              </li>
              <li>
                <strong>Marketing direcionado:</strong> Enviar publicidade baseada no seu perfil.
              </li>
              <li>
                <strong>Contato direto:</strong> Via telefone, SMS, e-mail ou outros meios, respeitando as regras legais.
              </li>
            </ul>

            <p className="text-base mb-2 font-medium" style={{ color: "var(--cor-texto)" }}>
              Além disso, seus dados podem ser usados para:
            </p>
            <ul className="list-disc pl-5 mb-5 flex flex-col gap-1.5 text-base" style={{ color: "var(--cor-texto)" }}>
              <li>Atender a exigências legais ou judiciais.</li>
              <li>Proteger direitos, privacidade e segurança.</li>
              <li>Prevenir fraudes e abusos.</li>
              <li>Aplicar nossos Termos e Condições de Uso.</li>
            </ul>

            <div
              className="p-4 rounded-xl border flex items-start gap-3"
              style={{
                backgroundColor: "var(--cor-rosa-suave)",
                borderColor: "var(--cor-rosa)",
              }}
            >
              <span className="text-xl shrink-0" aria-hidden="true">⚠️</span>
              <p className="text-sm sm:text-base mb-0 font-medium" style={{ color: "var(--cor-rosa-escuro)" }}>
                <strong>Importante:</strong> Nosso serviço não é destinado a menores de 18 anos. Solicitamos que essa faixa etária não forneça dados pessoais.
              </p>
            </div>
          </article>

          {/* 4. Dados que Coletamos */}
          <article
            className="p-6 sm:p-8 rounded-2xl border bg-white"
            style={{
              borderColor: "var(--cor-bege-escuro)",
              boxShadow: "var(--sombra)",
            }}
          >
            <h2
              className="text-xl sm:text-2xl font-bold mb-4"
              style={{ fontFamily: "var(--fonte-titulo)", color: "var(--cor-texto)" }}
            >
              Dados que Coletamos
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div
                className="p-4 rounded-xl border"
                style={{
                  backgroundColor: "var(--cor-bege)",
                  borderColor: "var(--cor-bege-escuro)",
                }}
              >
                <h3 className="text-base font-bold mb-2" style={{ color: "var(--cor-salvia-escuro)" }}>
                  Durante a Navegação
                </h3>
                <ul className="list-disc pl-5 flex flex-col gap-1.5 text-sm sm:text-base m-0" style={{ color: "var(--cor-texto)" }}>
                  <li>Dados de localização (geolocalização).</li>
                  <li>Informações sobre preferências e interesses.</li>
                  <li>Dados de navegação (páginas visitadas, interações, IP, dispositivo).</li>
                  <li>Dados anônimos e agregados para análises estatísticas.</li>
                </ul>
              </div>

              <div
                className="p-4 rounded-xl border"
                style={{
                  backgroundColor: "var(--cor-bege)",
                  borderColor: "var(--cor-bege-escuro)",
                }}
              >
                <h3 className="text-base font-bold mb-2" style={{ color: "var(--cor-salvia-escuro)" }}>
                  Por Cadastro ou Contato
                </h3>
                <ul className="list-disc pl-5 flex flex-col gap-1.5 text-sm sm:text-base m-0" style={{ color: "var(--cor-texto)" }}>
                  <li>Nome, telefone, endereço de e-mail, cidade e estado.</li>
                  <li>Informações enviadas por você via formulários (reclamações, dúvidas, sugestões).</li>
                </ul>
              </div>
            </div>

            <p
              className="text-sm font-semibold mb-0 px-3 py-2 rounded-lg border inline-block"
              style={{
                backgroundColor: "var(--cor-rosa-suave)",
                borderColor: "var(--cor-rosa)",
                color: "var(--cor-rosa-escuro)",
              }}
            >
              Observação: Não coletamos dados pessoais sensíveis.
            </p>
          </article>

          {/* 5. Coleta Automática de Dados e Cookies */}
          <article
            className="p-6 sm:p-8 rounded-2xl border bg-white"
            style={{
              borderColor: "var(--cor-bege-escuro)",
              boxShadow: "var(--sombra)",
            }}
          >
            <h2
              className="text-xl sm:text-2xl font-bold mb-3"
              style={{ fontFamily: "var(--fonte-titulo)", color: "var(--cor-texto)" }}
            >
              Coleta Automática de Dados e Cookies
            </h2>
            <p className="text-base mb-3" style={{ color: "var(--cor-texto)" }}>
              Utilizamos tecnologias como cookies, pixel tags e web beacons para:
            </p>
            <ul className="list-disc pl-5 mb-4 flex flex-col gap-1.5 text-base" style={{ color: "var(--cor-texto)" }}>
              <li>Melhorar a funcionalidade da Loja.</li>
              <li>Personalizar sua experiência.</li>
              <li>Direcionar publicidade relevante.</li>
              <li>Coletar informações estatísticas.</li>
            </ul>
            <p className="text-base leading-relaxed mb-3" style={{ color: "var(--cor-texto)" }}>
              Você pode gerenciar suas preferências e desativar cookies via configurações do seu navegador, como Google Chrome, Mozilla Firefox, Safari, entre outros.
            </p>
            <p className="text-base leading-relaxed mb-0" style={{ color: "var(--cor-texto)" }}>
              Para evitar rastreamento em plataformas como Facebook, Google e Bing, é possível ajustar as configurações diretamente nos respectivos serviços.
            </p>
          </article>

          {/* 6. Compartilhamento de Dados com Terceiros */}
          <article
            className="p-6 sm:p-8 rounded-2xl border bg-white"
            style={{
              borderColor: "var(--cor-bege-escuro)",
              boxShadow: "var(--sombra)",
            }}
          >
            <h2
              className="text-xl sm:text-2xl font-bold mb-3"
              style={{ fontFamily: "var(--fonte-titulo)", color: "var(--cor-texto)" }}
            >
              Compartilhamento de Dados com Terceiros
            </h2>
            <p className="text-base mb-3" style={{ color: "var(--cor-texto)" }}>
              Seus dados podem ser compartilhados com:
            </p>
            <ul className="list-disc pl-5 mb-4 flex flex-col gap-1.5 text-base" style={{ color: "var(--cor-texto)" }}>
              <li>Empresas parceiras que você escolher.</li>
              <li>Provedores de serviços que auxiliam na operação do site (hospedagem, suporte, marketing).</li>
              <li>Em casos de reorganização ou transferência da empresa.</li>
            </ul>
            <p className="text-base leading-relaxed mb-0" style={{ color: "var(--cor-texto)" }}>
              Esses parceiros podem estar localizados no Brasil ou no exterior, sempre obedecendo às normas de proteção de dados.
            </p>
          </article>

          {/* 7. Transferência Internacional de Dados */}
          <article
            className="p-6 sm:p-8 rounded-2xl border bg-white"
            style={{
              borderColor: "var(--cor-bege-escuro)",
              boxShadow: "var(--sombra)",
            }}
          >
            <h2
              className="text-xl sm:text-2xl font-bold mb-3"
              style={{ fontFamily: "var(--fonte-titulo)", color: "var(--cor-texto)" }}
            >
              Transferência Internacional de Dados
            </h2>
            <p className="text-base leading-relaxed mb-0" style={{ color: "var(--cor-texto)" }}>
              Dados coletados podem ser transferidos entre empresas do nosso grupo global, respeitando as disposições legais de proteção.
            </p>
          </article>

          {/* 8. Direitos do Usuário */}
          <article
            className="p-6 sm:p-8 rounded-2xl border bg-white"
            style={{
              borderColor: "var(--cor-bege-escuro)",
              boxShadow: "var(--sombra)",
            }}
          >
            <h2
              className="text-xl sm:text-2xl font-bold mb-3"
              style={{ fontFamily: "var(--fonte-titulo)", color: "var(--cor-texto)" }}
            >
              Direitos do Usuário
            </h2>
            <p className="text-base mb-3" style={{ color: "var(--cor-texto)" }}>
              Você tem o direito de solicitar a qualquer momento:
            </p>
            <ul className="list-disc pl-5 mb-4 flex flex-col gap-1.5 text-base" style={{ color: "var(--cor-texto)" }}>
              <li>Confirmação do tratamento dos seus dados.</li>
              <li>Acesso, correção ou atualização dos seus dados.</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários.</li>
              <li>Portabilidade dos dados para outro serviço.</li>
              <li>Revogação do consentimento.</li>
              <li>Informações sobre compartilhamento dos seus dados.</li>
            </ul>
            <p className="text-base leading-relaxed mb-0" style={{ color: "var(--cor-texto-suave)" }}>
              Alguns pedidos podem ter limitações por exigências legais. Para exercer seus direitos, é necessário comprovar sua identidade.
            </p>
          </article>

          {/* 9. Segurança dos Dados */}
          <article
            className="p-6 sm:p-8 rounded-2xl border bg-white"
            style={{
              borderColor: "var(--cor-bege-escuro)",
              boxShadow: "var(--sombra)",
            }}
          >
            <h2
              className="text-xl sm:text-2xl font-bold mb-3"
              style={{ fontFamily: "var(--fonte-titulo)", color: "var(--cor-texto)" }}
            >
              Segurança dos Dados
            </h2>
            <p className="text-base leading-relaxed mb-0" style={{ color: "var(--cor-texto)" }}>
              Adotamos medidas técnicas e organizacionais para proteger seus dados pessoais contra acessos não autorizados, vazamentos ou perdas. Contudo, nenhum sistema é 100% seguro; caso identifique qualquer problema, notifique-nos imediatamente.
            </p>
          </article>

          {/* 10. Links para Sites e Redes Sociais de Terceiros */}
          <article
            className="p-6 sm:p-8 rounded-2xl border bg-white"
            style={{
              borderColor: "var(--cor-bege-escuro)",
              boxShadow: "var(--sombra)",
            }}
          >
            <h2
              className="text-xl sm:text-2xl font-bold mb-3"
              style={{ fontFamily: "var(--fonte-titulo)", color: "var(--cor-texto)" }}
            >
              Links para Sites e Redes Sociais de Terceiros
            </h2>
            <p className="text-base leading-relaxed mb-0" style={{ color: "var(--cor-texto)" }}>
              Nossa Loja pode conter links para sites e redes sociais de parceiros, fornecedores ou anunciantes. Não nos responsabilizamos pelas políticas de privacidade desses terceiros. Recomendamos que sempre leia as políticas de privacidade antes de fornecer seus dados.
            </p>
          </article>

          {/* 11. Atualizações desta Política */}
          <article
            className="p-6 sm:p-8 rounded-2xl border bg-white"
            style={{
              borderColor: "var(--cor-bege-escuro)",
              boxShadow: "var(--sombra)",
            }}
          >
            <h2
              className="text-xl sm:text-2xl font-bold mb-3"
              style={{ fontFamily: "var(--fonte-titulo)", color: "var(--cor-texto)" }}
            >
              Atualizações desta Política
            </h2>
            <p className="text-base leading-relaxed mb-3" style={{ color: "var(--cor-texto)" }}>
              Podemos atualizar esta Política de Privacidade a qualquer momento. Publicaremos as alterações no site com a data de revisão atualizada. Caso as mudanças sejam significativas, avisaremos via contato cadastrado ou notificação direta.
            </p>
            <p className="text-base leading-relaxed mb-0" style={{ color: "var(--cor-texto-suave)" }}>
              Seu uso contínuo do site após as atualizações implica aceitação da nova política. Se discordar, recomendamos cessar o uso do site.
            </p>
          </article>

          {/* 12. Contato da Pessoa Responsável pelo Tratamento dos Dados */}
          <article
            className="p-6 sm:p-8 rounded-2xl border"
            style={{
              backgroundColor: "var(--cor-bege)",
              borderColor: "var(--cor-bege-escuro)",
              boxShadow: "var(--sombra)",
            }}
          >
            <h2
              className="text-xl sm:text-2xl font-bold mb-3"
              style={{ fontFamily: "var(--fonte-titulo)", color: "var(--cor-texto)" }}
            >
              Contato da Pessoa Responsável pelo Tratamento dos Dados
            </h2>
            <p className="text-base leading-relaxed mb-4" style={{ color: "var(--cor-texto)" }}>
              Para dúvidas, solicitações ou reclamações relacionadas ao tratamento dos seus dados pessoais, entre em contato conosco. Agradecemos a confiança em utilizar nosso site com segurança e tranquilidade.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href={`mailto:${site.contato.email}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-bold text-white text-sm sm:text-base no-underline hover:opacity-95 transition-opacity"
                style={{ backgroundColor: "var(--cor-rosa-escuro)" }}
              >
                <span>✉️</span>
                <span>{site.contato.email}</span>
              </a>

              {temWhatsapp && (
                <a
                  href={linkWhatsapp("Olá! Gostaria de tirar uma dúvida sobre a Política de Privacidade e tratamento de dados.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-bold text-white text-sm sm:text-base no-underline hover:opacity-95 transition-opacity"
                  style={{ backgroundColor: "var(--cor-whatsapp)" }}
                >
                  <span>💬</span>
                  <span>WhatsApp: {site.contato.whatsappNumeroExibicao}</span>
                </a>
              )}
            </div>
          </article>
        </div>

        {/* Botão de retorno no rodapé da página */}
        <div className="mt-12 text-center">
          <a
            href="#inicio"
            onClick={onVoltar}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white text-base no-underline cursor-pointer hover:opacity-95 transition-opacity"
            style={{ backgroundColor: "var(--cor-rosa-escuro)" }}
          >
            <span aria-hidden="true">←</span>
            <span>{site.privacidade.voltarTexto}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
