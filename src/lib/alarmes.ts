// Gerador de sons suaves e delicados para os alarmes do quadro visual via Web Audio API
export type TipoAlarme = "sininho" | "marimba" | "harpa";

export interface OpcaoSomAlarme {
  id: TipoAlarme;
  nome: string;
  descricao: string;
}

export const OPCOES_SONS: OpcaoSomAlarme[] = [
  {
    id: "sininho",
    nome: "Sininho Suave",
    descricao: "Toques leves de caixinha de música, calmos e acolhedores",
  },
  {
    id: "marimba",
    nome: "Gotas de Carinho",
    descricao: "Notas amadeiradas e macias, ideais para transição de atividades",
  },
  {
    id: "harpa",
    nome: "Harpa Serena",
    descricao: "Acorde dedilhado relaxante para momentos de tranquilidade",
  },
];

let audioCtx: AudioContext | null = null;

function obterAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx || audioCtx.state === "closed") {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Toca uma nota suave com onda senoidal e decaimento exponencial delicado
 */
function tocarNota(
  ctx: AudioContext,
  frequencia: number,
  inicio: number,
  duracao: number,
  volumeMax: number = 0.15,
  tipoOnda: OscillatorType = "sine"
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = tipoOnda;
  osc.frequency.setValueAtTime(frequencia, inicio);

  // Envelope suave anti-clique (fade in rápido e fade out progressivo)
  gain.gain.setValueAtTime(0.0001, inicio);
  gain.gain.exponentialRampToValueAtTime(volumeMax, inicio + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, inicio + duracao);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(inicio);
  osc.stop(inicio + duracao + 0.05);
}

/**
 * Toca o alarme sonoro delicado escolhido
 */
export function tocarAlarmeDelicado(tipo: TipoAlarme = "sininho"): boolean {
  const ctx = obterAudioContext();
  if (!ctx) return false;

  const agora = ctx.currentTime + 0.05;

  if (tipo === "sininho") {
    // Sequência melódica suave em tom maior (estilo caixinha de música)
    // C6 (1046Hz), E6 (1318Hz), G6 (1568Hz), C7 (2093Hz)
    const notas = [1046.5, 1318.5, 1567.98, 2093.0];
    notas.forEach((freq, idx) => {
      tocarNota(ctx, freq, agora + idx * 0.18, 0.9, 0.12, "sine");
    });
  } else if (tipo === "marimba") {
    // Notas macias estilo marimba / xilofone infantil suave
    // G4 (392Hz), B4 (493.88Hz), D5 (587.33Hz), G5 (783.99Hz)
    const notas = [392.0, 493.88, 587.33, 783.99];
    notas.forEach((freq, idx) => {
      tocarNota(ctx, freq, agora + idx * 0.22, 0.7, 0.14, "triangle");
      // Harmônico sutil
      tocarNota(ctx, freq * 2, agora + idx * 0.22, 0.35, 0.04, "sine");
    });
  } else if (tipo === "harpa") {
    // Acorde suave estilo harpa
    // F4 (349.23Hz), A4 (440Hz), C5 (523.25Hz), E5 (659.25Hz), A5 (880Hz)
    const notas = [349.23, 440.0, 523.25, 659.25, 880.0];
    notas.forEach((freq, idx) => {
      tocarNota(ctx, freq, agora + idx * 0.15, 1.2, 0.1, "sine");
    });
  }

  return true;
}

/**
 * Retorna o identificador do dia da semana atual compatível com o quadro ("dom", "seg", etc.)
 */
export function obterDiaSemanaAtual(): string {
  const dias = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];
  const indice = new Date().getDay();
  return dias[indice] || "seg";
}

/**
 * Retorna a hora e minuto atual no formato "HH:MM"
 */
export function obterHoraMinutoAtual(): string {
  const agora = new Date();
  const horas = String(agora.getHours()).padStart(2, "0");
  const minutos = String(agora.getMinutes()).padStart(2, "0");
  return `${horas}:${minutos}`;
}
