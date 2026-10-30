import { useEffect, useState } from "react";
import { AgendaMaeAtipica } from "./components/AgendaMaeAtipica";
import { Atividades } from "./components/Atividades";
import { Beneficios } from "./components/Beneficios";
import { ChamadaFinal } from "./components/ChamadaFinal";
import { ComoFunciona } from "./components/ComoFunciona";
import { Emocional } from "./components/Emocional";
import { Faq } from "./components/Faq";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Privacidade } from "./components/Privacidade";
import { Produto } from "./components/Produto";
import { WhatsappFlutuante } from "./components/WhatsappFlutuante";
import { ehPreencher, site } from "./data/site";
import { GameShell } from "./game/GameShell";

export default function App() {
  const [menuMovelAberto, setMenuMovelAberto] = useState(false);
  const obterPaginaAtual = (): "inicio" | "agenda" | "privacidade" | "jogo" => {
    if (typeof window === "undefined") return "inicio";
    const hash = window.location.hash.toLowerCase();
    const path = window.location.pathname.toLowerCase();
    if (hash === "#agenda" || path.endsWith("/agenda") || path.endsWith("/agenda/")) return "agenda";
    if (hash === "#privacidade" || path.endsWith("/privacidade") || path.endsWith("/privacidade/")) return "privacidade";
    if (hash === "#jogo" || path.endsWith("/jogo") || path.endsWith("/jogo/")) return "jogo";
    return "inicio";
  };

  const [paginaAtual, setPaginaAtual] = useState<"inicio" | "agenda" | "privacidade" | "jogo">(obterPaginaAtual);

  useEffect(() => {
    const aoMudarRota = () => {
      setPaginaAtual(obterPaginaAtual());
    };
    window.addEventListener("popstate", aoMudarRota);
    window.addEventListener("hashchange", aoMudarRota);
    return () => {
      window.removeEventListener("popstate", aoMudarRota);
      window.removeEventListener("hashchange", aoMudarRota);
    };
  }, []);

  const abrirAgenda = (e?: React.MouseEvent) => {
    e?.preventDefault();
    window.location.hash = "agenda";
    setPaginaAtual("agenda");
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const abrirJogo = (e?: React.MouseEvent) => {
    e?.preventDefault();
    window.location.hash = "jogo";
    setPaginaAtual("jogo");
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const abrirPrivacidade = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.hash = "privacidade";
    setPaginaAtual("privacidade");
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const voltarParaInicio = (e?: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e?.preventDefault();
    if (window.location.hash) {
      const urlSemHash = window.location.pathname + window.location.search;
      window.history.pushState(null, "", urlSemHash);
    }
    setPaginaAtual("inicio");
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  // JSON-LD Organization apenas com campos preenchidos
  const jsonLdOrganization: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.marca.nome,
    description: site.seo.descricao,
  };

  if (site.seo.url.trim()) {
    jsonLdOrganization.url = site.seo.url.trim();
  }
  if (site.marca.logo) {
    jsonLdOrganization.logo = site.marca.logo;
  }
  if (!ehPreencher(site.contato.email) && site.contato.email.trim()) {
    jsonLdOrganization.email = site.contato.email.trim();
  }
  const redesSociais = [
    site.contato.instagram.trim(),
    ...site.contato.outrasRedes.map((r) => r.url.trim()),
  ].filter(Boolean);
  if (redesSociais.length > 0) {
    jsonLdOrganization.sameAs = redesSociais;
  }

  if (paginaAtual === "jogo") {
    return <GameShell onExitGame={() => voltarParaInicio()} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdOrganization),
        }}
      />

      <a href="#conteudo" className="skip-link">
        {site.acessibilidade.pularParaConteudo}
      </a>

      {/* 1. Cabeçalho */}
      <Header
        onMenuAbertoChange={setMenuMovelAberto}
        onIrParaInicio={() => voltarParaInicio()}
        onAbrirAgenda={abrirAgenda}
        onAbrirJogo={abrirJogo}
      />

      {/* Conteúdo principal */}
      <main id="conteudo" className="flex-1">
        {paginaAtual === "agenda" ? (
          <AgendaMaeAtipica onVoltarParaInicio={() => voltarParaInicio()} />
        ) : paginaAtual === "privacidade" ? (
          <Privacidade onVoltar={voltarParaInicio} />
        ) : (
          <>
            {/* 2. Apresentação principal (hero) — #inicio */}
            <Hero />

            {/* Destaques Interativos: Agenda da Mãe & Jogo 3D para Crianças Atípicas */}
            <div className="container-site pt-0 pb-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Card 1: Jogo 3D Interativo */}
              <div
                className="p-5 sm:p-6 rounded-3xl border flex flex-col justify-between gap-4 relative overflow-hidden"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "var(--cor-rosa)",
                  boxShadow: "var(--sombra)",
                }}
              >
                <div className="flex items-start gap-3.5">
                  <span
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border"
                    style={{
                      backgroundColor: "var(--cor-rosa-suave)",
                      borderColor: "var(--cor-rosa)",
                    }}
                  >
                    🎮
                  </span>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#fdf2f4] text-[#b85a73] mb-1">
                      <span>✨ Novo • 3D Interativo</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold mb-0.5" style={{ color: "var(--cor-texto)" }}>
                      Jogo 3D: Aventura da Rotina
                    </h3>
                    <p className="text-xs sm:text-sm mb-0" style={{ color: "var(--cor-texto-suave)" }}>
                      Um espaço sensorial acolhedor com Lino o Ursinho para a criança atípica explorar as 5 etapas da rotina diária no seu próprio ritmo, sem sobrecarga.
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[var(--cor-bege-escuro)]">
                  <span className="text-[11px] text-[var(--cor-texto-suave)] font-medium">
                    Som suave · Modo Calmo · Toque ou Teclado
                  </span>
                  <button
                    type="button"
                    onClick={abrirJogo}
                    className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white shrink-0 cursor-pointer shadow-xs hover:opacity-95 transition-all"
                    style={{ backgroundColor: "var(--cor-rosa-escuro)" }}
                  >
                    Brincar no Jogo 3D →
                  </button>
                </div>
              </div>

              {/* Card 2: Agenda da Mãe */}
              <div
                className="p-5 sm:p-6 rounded-3xl border flex flex-col justify-between gap-4"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "var(--cor-bege-escuro)",
                  boxShadow: "var(--sombra)",
                }}
              >
                <div className="flex items-start gap-3.5">
                  <span
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border"
                    style={{
                      backgroundColor: "var(--cor-rosa-suave)",
                      borderColor: "var(--cor-rosa)",
                    }}
                  >
                    📋
                  </span>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#f4ebd9] text-[#7d6860] mb-1">
                      <span>🗓️ 1900 - 2099</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold mb-0.5" style={{ color: "var(--cor-texto)" }}>
                      Agenda Diária da Mãe Atípica
                    </h3>
                    <p className="text-xs sm:text-sm mb-0" style={{ color: "var(--cor-texto-suave)" }}>
                      Programe horários, anotações de cada seguimento e alarmes suaves para consultas, terapias, fonoaudiólogo, fisioterapia e escola.
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[var(--cor-bege-escuro)]">
                  <span className="text-[11px] text-[var(--cor-texto-suave)] font-medium">
                    Organização e previsibilidade
                  </span>
                  <button
                    type="button"
                    onClick={abrirAgenda}
                    className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white shrink-0 cursor-pointer shadow-xs hover:opacity-95 transition-all"
                    style={{ backgroundColor: "var(--cor-rosa-escuro)" }}
                  >
                    Abrir Agenda da Mãe →
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Apresentação do produto — #produto */}
            <Produto />

            {/* 4. Como funciona — #como-funciona */}
            <ComoFunciona />

            {/* 5. Benefícios — #beneficios */}
            <Beneficios />

            {/* 6. Exemplos de atividades — #atividades */}
            <Atividades />

            {/* 7. Seção emocional — #nosso-jeito */}
            <Emocional />

            {/* 8. Perguntas frequentes — #perguntas-frequentes */}
            <Faq />

            {/* 9. Chamada final — #contato */}
            <ChamadaFinal />
          </>
        )}
      </main>

      {/* 10. Rodapé */}
      <Footer
        onAbrirPrivacidade={abrirPrivacidade}
        onIrParaInicio={() => voltarParaInicio()}
      />

      {/* + Botão flutuante WhatsApp */}
      <WhatsappFlutuante menuMovelAberto={menuMovelAberto} />
    </div>
  );
}
