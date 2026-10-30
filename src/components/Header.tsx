import { useEffect, useRef, useState } from "react";
import { site } from "../data/site";
import { linkWhatsapp } from "../lib/whatsapp";
import { Botao } from "./Botao";

const CORES_LETRAS_ATIPICAS = [
  "#E11D48", // Rosa vibrante
  "#0284C7", // Azul estimulante
  "#D97706", // Âmbar sol acolhedor
  "#059669", // Verde esperança
  "#7C3AED", // Roxo lúdico
  "#EA580C", // Laranja energia
  "#DB2777", // Magenta alegre
  "#0891B2", // Turquesa
  "#4F46E5", // Índigo amigável
  "#CA8A04", // Mostarda dourado
  "#16A34A", // Verde folha
  "#9333EA", // Violeta
];

// Frequências das notas de piano em escala ascendente alegre (Dó4 a Ré6)
const NOTAS_PIANO_FREQUENCIAS = [
  261.63, // Dó 4
  293.66, // Ré 4
  329.63, // Mi 4
  349.23, // Fá 4
  392.0,  // Sol 4
  440.0,  // Lá 4
  493.88, // Si 4
  523.25, // Dó 5
  587.33, // Ré 5
  659.25, // Mi 5
  698.46, // Fá 5
  783.99, // Sol 5
  880.0,  // Lá 5
  987.77, // Si 5
  1046.5, // Dó 6
  1174.66 // Ré 6
];

const NOMES_NOTAS = [
  "Dó", "Ré", "Mi", "Fá", "Sol", "Lá", "Si",
  "Dó", "Ré", "Mi", "Fá", "Sol", "Lá", "Si",
  "Dó", "Ré"
];

let audioCtxPianoGlobal: AudioContext | null = null;

function tocarNotaPiano(frequencia: number) {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    if (!audioCtxPianoGlobal) {
      audioCtxPianoGlobal = new AudioCtx();
    }
    if (audioCtxPianoGlobal.state === "suspended") {
      audioCtxPianoGlobal.resume().catch(() => {});
    }

    const ctx = audioCtxPianoGlobal;
    const now = ctx.currentTime;

    // Master Gain com envelope suave de piano (ataque rápido sem clique áspero, sustentação aveludada)
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.24, now + 0.005);
    masterGain.gain.exponentialRampToValueAtTime(0.12, now + 0.16);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.35);

    // Filtro acústico passa-baixa simulando a caixa harmônica de feltro e cordas
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(Math.min(frequencia * 4.6, 5000), now);
    filter.frequency.exponentialRampToValueAtTime(Math.min(frequencia * 1.7, 1800), now + 0.5);

    // Três harmônicos primários combinados para timbre orgânico de piano acústico
    const harmonicos = [
      { freqMul: 1, ganho: 1.0, type: "triangle" as OscillatorType },
      { freqMul: 2, ganho: 0.38, type: "sine" as OscillatorType },
      { freqMul: 3, ganho: 0.16, type: "sine" as OscillatorType },
    ];

    harmonicos.forEach(({ freqMul, ganho, type }) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = type;
      // Micro-desafinação natural para riqueza tátil
      const detune = (Math.random() - 0.5) * 3;
      osc.detune.setValueAtTime(detune, now);
      osc.frequency.setValueAtTime(frequencia * freqMul, now);

      oscGain.gain.setValueAtTime(ganho, now);
      if (freqMul > 1) {
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      }

      osc.connect(oscGain);
      oscGain.connect(filter);

      osc.start(now);
      osc.stop(now + 1.4);
    });

    filter.connect(masterGain);
    masterGain.connect(ctx.destination);
  } catch {
    // Silencia qualquer restrição de áudio do navegador
  }
}

function LetrasColoridas({ texto }: { texto: string }) {
  const [letraTocada, setLetraTocada] = useState<number | null>(null);
  const [notaAtiva, setNotaAtiva] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  let indiceLetra = 0;
  const palavras = texto.split(" ");

  const dispararSomLetra = (
    e: React.PointerEvent | React.MouseEvent | React.KeyboardEvent,
    index: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const freq = NOTAS_PIANO_FREQUENCIAS[index % NOTAS_PIANO_FREQUENCIAS.length];
    const nome = NOMES_NOTAS[index % NOMES_NOTAS.length];
    tocarNotaPiano(freq);

    setLetraTocada(index);
    setNotaAtiva(nome);

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setLetraTocada(null);
      setNotaAtiva(null);
    }, 400);
  };

  return (
    <span
      className="inline-flex items-center flex-wrap gap-x-2 gap-y-1 px-3 sm:px-4 py-1.5 rounded-2xl bg-white/95 border-2 border-pink-200 shadow-[0_4px_14px_rgba(244,114,182,0.18)] hover:shadow-[0_6px_20px_rgba(244,114,182,0.28)] hover:border-pink-300 transition-all select-none relative group"
      aria-label={`${texto} - toque nas letras para tocar piano`}
    >
      <span
        className="inline-flex items-center gap-1 text-base sm:text-lg mr-0.5 select-none pointer-events-none"
        aria-hidden="true"
      >
        <span className="animate-bounce" style={{ animationDuration: "2.4s" }}>
          🎹
        </span>
        {notaAtiva ? (
          <span className="text-[11px] font-black text-pink-600 bg-pink-100 px-1.5 py-0.2 rounded-full border border-pink-200 animate-pulse">
            {notaAtiva}
          </span>
        ) : null}
      </span>
      {palavras.map((palavra, pIndex) => (
        <span key={pIndex} className="inline-flex items-center tracking-normal">
          {palavra.split("").map((letra, lIndex) => {
            const indiceAtual = indiceLetra;
            const cor = CORES_LETRAS_ATIPICAS[indiceAtual % CORES_LETRAS_ATIPICAS.length];
            const nomeNota = NOMES_NOTAS[indiceAtual % NOMES_NOTAS.length];
            const estaTocando = letraTocada === indiceAtual;
            indiceLetra++;

            return (
              <span
                key={lIndex}
                role="button"
                tabIndex={0}
                aria-label={`Letra ${letra}, nota ${nomeNota}`}
                onPointerDown={(e) => dispararSomLetra(e, indiceAtual)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    dispararSomLetra(e, indiceAtual);
                  }
                }}
                className={`inline-block font-black text-xl sm:text-2xl md:text-[1.65rem] transition-all duration-150 cursor-pointer select-none active:scale-95 ${
                  estaTocando
                    ? "-translate-y-2.5 scale-130 drop-shadow-[0_8px_12px_rgba(244,114,182,0.45)]"
                    : "hover:-translate-y-1.5 hover:scale-120"
                }`}
                style={{
                  color: cor,
                  textShadow: estaTocando
                    ? "0 4px 10px rgba(0, 0, 0, 0.2)"
                    : "0 2px 0 rgba(0, 0, 0, 0.08), 0 3px 6px rgba(0, 0, 0, 0.05)",
                  fontFamily: "var(--fonte-titulo)",
                  lineHeight: 1.1,
                  transformOrigin: "bottom center",
                }}
              >
                {letra}
              </span>
            );
          })}
        </span>
      ))}
      <span
        className="inline-block text-base sm:text-lg ml-0.5 select-none pointer-events-none opacity-80"
        aria-hidden="true"
        title="Notas de piano ao tocar!"
      >
        ✨
      </span>
    </span>
  );
}

interface HeaderProps {
  onMenuAbertoChange?: (aberto: boolean) => void;
  onIrParaInicio?: () => void;
  onAbrirAgenda?: () => void;
  onAbrirJogo?: () => void;
}

export function Header({
  onMenuAbertoChange,
  onIrParaInicio,
  onAbrirAgenda,
  onAbrirJogo,
}: HeaderProps) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [rolou, setRolou] = useState(false);
  const botaoMenuRef = useRef<HTMLButtonElement>(null);

  const atualizarMenu = (novoEstado: boolean, devolverFoco = false) => {
    setMenuAberto(novoEstado);
    onMenuAbertoChange?.(novoEstado);
    if (!novoEstado && devolverFoco) {
      requestAnimationFrame(() => {
        botaoMenuRef.current?.focus();
      });
    }
  };

  useEffect(() => {
    const aoRolar = () => {
      setRolou(window.scrollY > 8);
    };
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  useEffect(() => {
    if (!menuAberto) return;
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        evento.preventDefault();
        atualizarMenu(false, true);
      }
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [menuAberto]);

  return (
    <header
      className="sticky top-0 z-50 w-full transition-shadow duration-150"
      style={{
        backgroundColor: "rgb(255 245 246 / 0.96)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid var(--cor-bege-escuro)",
        boxShadow: rolou ? "var(--sombra)" : "none",
      }}
    >
      <div className="container-site flex items-center justify-between gap-8 min-h-[76px]">
        {/* Zona 1: Nome da marca (ou logo quando preenchido) */}
        <a
          href="#inicio"
          onClick={() => {
            onIrParaInicio?.();
            if (menuAberto) atualizarMenu(false);
          }}
          className="inline-flex items-center gap-3 no-underline whitespace-nowrap shrink-0 py-2"
          style={{
            fontFamily: "var(--fonte-titulo)",
            color: "var(--cor-texto)",
            fontSize: "1.35rem",
            fontWeight: 700,
          }}
        >
          {site.marca.logo ? (
            <img
              src={site.marca.logo}
              alt={site.marca.nome}
              width={160}
              height={42}
              className="h-10 w-auto object-contain"
            />
          ) : (
            <LetrasColoridas texto={site.marca.nome} />
          )}
        </a>

        {/* Zona 2: Menu desktop (>=900px) */}
        <nav
          aria-label={site.acessibilidade.menuPrincipal}
          className="hidden min-[900px]:flex items-center gap-7"
        >
          {site.menu.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                if (item.href === "/agenda") {
                  e.preventDefault();
                  onAbrirAgenda?.();
                } else if (item.href === "/jogo") {
                  e.preventDefault();
                  onAbrirJogo?.();
                } else {
                  onIrParaInicio?.();
                }
              }}
              className="text-base font-semibold no-underline hover:underline underline-offset-8 whitespace-nowrap shrink-0 py-2"
              style={{
                color: "var(--cor-texto)",
                textDecorationColor: "var(--cor-rosa-escuro)",
              }}
            >
              {item.texto}
            </a>
          ))}
        </nav>

        {/* Zona 3: Botão CTA desktop e botão hambúrguer mobile */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden min-[900px]:block">
            <Botao
              href={linkWhatsapp(site.ctas.header.msg)}
              variante="primario"
              externo
              iconeWhatsapp
            >
              {site.ctas.header.texto}
            </Botao>
          </div>

          <button
            ref={botaoMenuRef}
            type="button"
            aria-expanded={menuAberto}
            aria-controls="menu-movel-painel"
            aria-label={
              menuAberto
                ? site.acessibilidade.fecharMenu
                : site.acessibilidade.abrirMenu
            }
            onClick={() => atualizarMenu(!menuAberto)}
            className="min-[900px]:hidden inline-flex items-center justify-center w-12 h-12 rounded-xl border cursor-pointer"
            style={{
              backgroundColor: "var(--cor-branco)",
              borderColor: "var(--cor-bege-escuro)",
              color: "var(--cor-texto)",
            }}
          >
            {menuAberto ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
                aria-hidden="true"
              >
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Painel do menu móvel (<900px) */}
      <div
        id="menu-movel-painel"
        hidden={!menuAberto}
        className="min-[900px]:hidden border-t"
        style={{
          backgroundColor: "var(--cor-branco)",
          borderColor: "var(--cor-bege-escuro)",
          boxShadow: "var(--sombra)",
        }}
      >
        <nav
          aria-label={site.acessibilidade.menuPrincipal}
          className="container-site py-5 flex flex-col gap-2"
        >
          {site.menu.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                if (item.href === "/agenda") {
                  e.preventDefault();
                  onAbrirAgenda?.();
                } else if (item.href === "/jogo") {
                  e.preventDefault();
                  onAbrirJogo?.();
                } else {
                  onIrParaInicio?.();
                }
                atualizarMenu(false);
              }}
              className="px-4 py-3 rounded-xl text-lg font-semibold no-underline"
              style={{
                color: "var(--cor-texto)",
              }}
            >
              {item.texto}
            </a>
          ))}
          <div className="pt-3 mt-2 border-t" style={{ borderColor: "var(--cor-bege-escuro)" }}>
            <Botao
              href={linkWhatsapp(site.ctas.header.msg)}
              variante="primario"
              externo
              iconeWhatsapp
              className="w-full"
              onClick={() => atualizarMenu(false)}
            >
              {site.ctas.header.texto}
            </Botao>
          </div>
        </nav>
      </div>
    </header>
  );
}
