import { useEffect, useRef, useState } from "react";
import type { IconeAtividade } from "../data/site";
import {
  OPCOES_SONS,
  obterDiaSemanaAtual,
  obterHoraMinutoAtual,
  tocarAlarmeDelicado,
  type TipoAlarme,
} from "../lib/alarmes";
import { IconeAtividadeSvg } from "./Icone";

export interface TarefaRotina {
  id: string;
  diaId: string;
  nome: string;
  icone: IconeAtividade;
  hora: string; // ex: "07:30"
  periodo: "Manhã" | "Tarde" | "Noite";
  feita?: boolean;
  alarmeAtivo?: boolean;
  somAlarme?: TipoAlarme;
  anotacao?: string; // Campo de anotação/observação para cada seguimento
  imagem?: string; // Imagem/cartão ilustrado específico
}

export const DIAS_SEMANA = [
  { id: "seg", nome: "Segunda", nomeCompleto: "Segunda-feira" },
  { id: "ter", nome: "Terça", nomeCompleto: "Terça-feira" },
  { id: "qua", nome: "Quarta", nomeCompleto: "Quarta-feira" },
  { id: "qui", nome: "Quinta", nomeCompleto: "Quinta-feira" },
  { id: "sex", nome: "Sexta", nomeCompleto: "Sexta-feira" },
  { id: "sab", nome: "Sábado", nomeCompleto: "Sábado" },
  { id: "dom", nome: "Domingo", nomeCompleto: "Domingo" },
] as const;

const FOTO_ACORDAR = "./assets/aistudio/Gemini_Generated_Image_lqybm1lqybm1lqyb_73ef9f1d.jpg";
const FOTO_TOMAR_CAFE = "./assets/aistudio/tomar_cafe_e5ca323f.jpg";
const FOTO_ESCOVAR_DENTES = "./assets/aistudio/Ir_para_escola_3c215afb.jpg";
const FOTO_ESCOLA = "./assets/aistudio/Gemini_Generated_Image_c4lfcpc4lfcpc4lf_f77f3b70.jpg";
const FOTO_BRINCAR = "./assets/aistudio/brincar_bd987619.jpg";
const FOTO_DESCANSAR = "./assets/aistudio/Descansar_811f8709.jpg";
const FOTO_DORMIR = "./assets/aistudio/dormir_ba348315.jpg";
const FOTO_ATENDIMENTOS = "./assets/aistudio/PARTICIPAR_DE_ATENDIMENTO_ace0abf0.jpg";

const TAREFAS_INICIAIS: TarefaRotina[] = [
  // Segunda
  { id: "seg-1", diaId: "seg", nome: "Acordar", icone: "acordar", hora: "07:00", periodo: "Manhã", alarmeAtivo: true, somAlarme: "sininho", anotacao: "Alongar com calma e abrir a cortina juntos", imagem: FOTO_ACORDAR },
  { id: "seg-2", diaId: "seg", nome: "Tomar café", icone: "cafe", hora: "07:30", periodo: "Manhã", alarmeAtivo: true, somAlarme: "marimba", anotacao: "Fruta fresca e leite morno", imagem: FOTO_TOMAR_CAFE },
  { id: "seg-3", diaId: "seg", nome: "Escovar os dentes", icone: "dentes", hora: "07:50", periodo: "Manhã", alarmeAtivo: true, somAlarme: "sininho", anotacao: "Movimentos suaves por 2 minutos", imagem: FOTO_ESCOVAR_DENTES },
  { id: "seg-4", diaId: "seg", nome: "Ir à escola", icone: "escola", hora: "08:15", periodo: "Manhã", alarmeAtivo: true, somAlarme: "sininho", anotacao: "Conferir estojo, garrafinha e casaco", imagem: FOTO_ESCOLA },
  { id: "seg-5", diaId: "seg", nome: "Brincar", icone: "brincar", hora: "14:30", periodo: "Tarde", alarmeAtivo: true, somAlarme: "marimba", anotacao: "Blocos de montar no tapete da sala", imagem: FOTO_BRINCAR },
  { id: "seg-6", diaId: "seg", nome: "Descansar", icone: "descansar", hora: "17:00", periodo: "Tarde", alarmeAtivo: true, somAlarme: "harpa", anotacao: "Pausa silenciosa ou historinha ilustrada", imagem: FOTO_DESCANSAR },
  { id: "seg-7", diaId: "seg", nome: "Dormir", icone: "dormir", hora: "21:00", periodo: "Noite", alarmeAtivo: true, somAlarme: "harpa", anotacao: "Luz baixa e abraço de boa noite", imagem: FOTO_DORMIR },

  // Terça
  { id: "ter-1", diaId: "ter", nome: "Acordar", icone: "acordar", hora: "07:00", periodo: "Manhã", alarmeAtivo: true, somAlarme: "sininho", anotacao: "Despertar no ritmo tranquilo da criança", imagem: FOTO_ACORDAR },
  { id: "ter-2", diaId: "ter", nome: "Tomar café", icone: "cafe", hora: "07:30", periodo: "Manhã", alarmeAtivo: true, somAlarme: "marimba", anotacao: "Pãozinho e fruta picada", imagem: FOTO_TOMAR_CAFE },
  { id: "ter-3", diaId: "ter", nome: "Ir à escola", icone: "escola", hora: "08:15", periodo: "Manhã", alarmeAtivo: true, somAlarme: "sininho", anotacao: "Lancheira com maçã", imagem: FOTO_ESCOLA },
  { id: "ter-4", diaId: "ter", nome: "Participar de atendimentos", icone: "atendimentos", hora: "14:00", periodo: "Tarde", alarmeAtivo: true, somAlarme: "sininho", anotacao: "Levar brinquedo de transição favorito", imagem: FOTO_ATENDIMENTOS },
  { id: "ter-5", diaId: "ter", nome: "Brincar", icone: "brincar", hora: "16:00", periodo: "Tarde", alarmeAtivo: true, somAlarme: "marimba", anotacao: "Desenho livre com giz de cera", imagem: FOTO_BRINCAR },
  { id: "ter-6", diaId: "ter", nome: "Dormir", icone: "dormir", hora: "21:00", periodo: "Noite", alarmeAtivo: true, somAlarme: "harpa", anotacao: "Respiração calma e som relaxante", imagem: FOTO_DORMIR },

  // Quarta
  { id: "qua-1", diaId: "qua", nome: "Acordar", icone: "acordar", hora: "07:00", periodo: "Manhã", alarmeAtivo: true, somAlarme: "sininho", anotacao: "Bom dia com carinho", imagem: FOTO_ACORDAR },
  { id: "qua-2", diaId: "qua", nome: "Tomar café", icone: "cafe", hora: "07:30", periodo: "Manhã", alarmeAtivo: true, somAlarme: "marimba", anotacao: "Vitamina de banana e torrada", imagem: FOTO_TOMAR_CAFE },
  { id: "qua-3", diaId: "qua", nome: "Escovar os dentes", icone: "dentes", hora: "07:50", periodo: "Manhã", alarmeAtivo: true, somAlarme: "sininho", anotacao: "Escovação guiada com espelho", imagem: FOTO_ESCOVAR_DENTES },
  { id: "qua-4", diaId: "qua", nome: "Ir à escola", icone: "escola", hora: "08:15", periodo: "Manhã", alarmeAtivo: true, somAlarme: "sininho", anotacao: "Dia da aula de música", imagem: FOTO_ESCOLA },
  { id: "qua-5", diaId: "qua", nome: "Brincar", icone: "brincar", hora: "15:00", periodo: "Tarde", alarmeAtivo: true, somAlarme: "marimba", anotacao: "Brincadeiras no quintal ou parque", imagem: FOTO_BRINCAR },
  { id: "qua-6", diaId: "qua", nome: "Descansar", icone: "descansar", hora: "18:00", periodo: "Tarde", alarmeAtivo: true, somAlarme: "harpa", anotacao: "Ouvir música serena", imagem: FOTO_DESCANSAR },
  { id: "qua-7", diaId: "qua", nome: "Dormir", icone: "dormir", hora: "21:00", periodo: "Noite", alarmeAtivo: true, somAlarme: "harpa", anotacao: "Historinha antes de pegar no sono", imagem: FOTO_DORMIR },

  // Quinta
  { id: "qui-1", diaId: "qui", nome: "Acordar", icone: "acordar", hora: "07:00", periodo: "Manhã", alarmeAtivo: true, somAlarme: "sininho", anotacao: "Alongamento matinal leve", imagem: FOTO_ACORDAR },
  { id: "qui-2", diaId: "qui", nome: "Tomar café", icone: "cafe", hora: "07:30", periodo: "Manhã", alarmeAtivo: true, somAlarme: "marimba", anotacao: "Fruta preferida da semana", imagem: FOTO_TOMAR_CAFE },
  { id: "qui-3", diaId: "qui", nome: "Ir à escola", icone: "escola", hora: "08:15", periodo: "Manhã", alarmeAtivo: true, somAlarme: "sininho", anotacao: "Conferir agenda de recados", imagem: FOTO_ESCOLA },
  { id: "qui-4", diaId: "qui", nome: "Participar de atendimentos", icone: "atendimentos", hora: "14:30", periodo: "Tarde", alarmeAtivo: true, somAlarme: "sininho", anotacao: "Sessão lúdica com a equipe", imagem: FOTO_ATENDIMENTOS },
  { id: "qui-5", diaId: "qui", nome: "Brincar", icone: "brincar", hora: "16:30", periodo: "Tarde", alarmeAtivo: true, somAlarme: "marimba", anotacao: "Massinha de modelar colorida", imagem: FOTO_BRINCAR },
  { id: "qui-6", diaId: "qui", nome: "Dormir", icone: "dormir", hora: "21:00", periodo: "Noite", alarmeAtivo: true, somAlarme: "harpa", anotacao: "Cama aconchegante e cheirinho bom", imagem: FOTO_DORMIR },

  // Sexta
  { id: "sex-1", diaId: "sex", nome: "Acordar", icone: "acordar", hora: "07:00", periodo: "Manhã", alarmeAtivo: true, somAlarme: "sininho", anotacao: "Sexta-feira animada com sorriso", imagem: FOTO_ACORDAR },
  { id: "sex-2", diaId: "sex", nome: "Tomar café", icone: "cafe", hora: "07:30", periodo: "Manhã", alarmeAtivo: true, somAlarme: "marimba", anotacao: "Café da manhã especial", imagem: FOTO_TOMAR_CAFE },
  { id: "sex-3", diaId: "sex", nome: "Ir à escola", icone: "escola", hora: "08:15", periodo: "Manhã", alarmeAtivo: true, somAlarme: "sininho", anotacao: "Dia do brinquedo na escola", imagem: FOTO_ESCOLA },
  { id: "sex-4", diaId: "sex", nome: "Brincar", icone: "brincar", hora: "15:00", periodo: "Tarde", alarmeAtivo: true, somAlarme: "marimba", anotacao: "Montar cabaninha na sala", imagem: FOTO_BRINCAR },
  { id: "sex-5", diaId: "sex", nome: "Descansar", icone: "descansar", hora: "18:30", periodo: "Tarde", alarmeAtivo: true, somAlarme: "harpa", anotacao: "Filme em família com pipoca", imagem: FOTO_DESCANSAR },
  { id: "sex-6", diaId: "sex", nome: "Dormir", icone: "dormir", hora: "21:30", periodo: "Noite", alarmeAtivo: true, somAlarme: "harpa", anotacao: "Dormir relaxado para o fim de semana", imagem: FOTO_DORMIR },

  // Sábado
  { id: "sab-1", diaId: "sab", nome: "Acordar", icone: "acordar", hora: "08:30", periodo: "Manhã", alarmeAtivo: true, somAlarme: "sininho", anotacao: "Acordar sem pressa", imagem: FOTO_ACORDAR },
  { id: "sab-2", diaId: "sab", nome: "Tomar café", icone: "cafe", hora: "09:00", periodo: "Manhã", alarmeAtivo: true, somAlarme: "marimba", anotacao: "Piquenique ou mesa farta", imagem: FOTO_TOMAR_CAFE },
  { id: "sab-3", diaId: "sab", nome: "Brincar", icone: "brincar", hora: "10:30", periodo: "Manhã", alarmeAtivo: true, somAlarme: "marimba", anotacao: "Passeio ao ar livre com a família", imagem: FOTO_BRINCAR },
  { id: "sab-4", diaId: "sab", nome: "Descansar", icone: "descansar", hora: "14:00", periodo: "Tarde", alarmeAtivo: true, somAlarme: "harpa", anotacao: "Soneca gostosa da tarde", imagem: FOTO_DESCANSAR },
  { id: "sab-5", diaId: "sab", nome: "Brincar", icone: "brincar", hora: "16:00", periodo: "Tarde", alarmeAtivo: true, somAlarme: "marimba", anotacao: "Jogos de tabuleiro ou quebra-cabeça", imagem: FOTO_BRINCAR },
  { id: "sab-6", diaId: "sab", nome: "Dormir", icone: "dormir", hora: "21:30", periodo: "Noite", alarmeAtivo: true, somAlarme: "harpa", anotacao: "Noite de descanso e acolhimento", imagem: FOTO_DORMIR },

  // Domingo
  { id: "dom-1", diaId: "dom", nome: "Acordar", icone: "acordar", hora: "08:30", periodo: "Manhã", alarmeAtivo: true, somAlarme: "sininho", anotacao: "Manhã preguiçosa e gostosa", imagem: FOTO_ACORDAR },
  { id: "dom-2", diaId: "dom", nome: "Tomar café", icone: "cafe", hora: "09:00", periodo: "Manhã", alarmeAtivo: true, somAlarme: "marimba", anotacao: "Café reforçado e conversa boa", imagem: FOTO_TOMAR_CAFE },
  { id: "dom-3", diaId: "dom", nome: "Brincar", icone: "brincar", hora: "11:00", periodo: "Manhã", alarmeAtivo: true, somAlarme: "marimba", anotacao: "Passeio ou brincadeira em conjunto", imagem: FOTO_BRINCAR },
  { id: "dom-4", diaId: "dom", nome: "Descansar", icone: "descansar", hora: "15:00", periodo: "Tarde", alarmeAtivo: true, somAlarme: "harpa", anotacao: "Organizar juntos os cartões da próxima semana", imagem: FOTO_DESCANSAR },
  { id: "dom-5", diaId: "dom", nome: "Dormir", icone: "dormir", hora: "21:00", periodo: "Noite", alarmeAtivo: true, somAlarme: "harpa", anotacao: "Prontos para uma nova semana com carinho", imagem: FOTO_DORMIR },
];

const ATALHOS_HORA = ["07:00", "07:30", "08:00", "08:30", "12:00", "13:30", "15:00", "18:00", "19:30", "21:00"];

export function QuadroVisualInterativo() {
  const [tarefas, setTarefas] = useState<TarefaRotina[]>(TAREFAS_INICIAIS);
  const [diaSelecionado, setDiaSelecionado] = useState<string>("todos");
  const [tarefaEditando, setTarefaEditando] = useState<TarefaRotina | null>(null);
  const [horaTemp, setHoraTemp] = useState<string>("");
  const [alarmeTemp, setAlarmeTemp] = useState<boolean>(true);
  const [somTemp, setSomTemp] = useState<TipoAlarme>("sininho");
  const [anotacaoTemp, setAnotacaoTemp] = useState<string>("");
  const [replicarSemana, setReplicarSemana] = useState<boolean>(false);
  const [mensagemSucesso, setMensagemSucesso] = useState<string>("");

  // Estado geral de alarmes
  const [alarmesHabilitados, setAlarmesHabilitados] = useState<boolean>(true);
  const [horaRelogio, setHoraRelogio] = useState<string>(() => obterHoraMinutoAtual());
  const [alarmeDisparado, setAlarmeDisparado] = useState<TarefaRotina | null>(null);
  const ultimoAlarmeTocadoRef = useRef<string>("");

  // Atualiza o relógio a cada 3 segundos e checa se alguma atividade atingiu o horário programado
  useEffect(() => {
    const intervalo = setInterval(() => {
      const horaAtual = obterHoraMinutoAtual();
      const diaAtual = obterDiaSemanaAtual();
      setHoraRelogio(horaAtual);

      if (!alarmesHabilitados) return;

      const chaveDisparo = `${diaAtual}-${horaAtual}`;
      if (ultimoAlarmeTocadoRef.current === chaveDisparo) return;

      // Localiza tarefa do dia atual com o horário programado
      const tarefaParaDespertar = tarefas.find(
        (t) =>
          t.diaId === diaAtual &&
          t.hora === horaAtual &&
          t.alarmeAtivo !== false &&
          !t.feita
      );

      if (tarefaParaDespertar) {
        ultimoAlarmeTocadoRef.current = chaveDisparo;
        tocarAlarmeDelicado(tarefaParaDespertar.somAlarme || "sininho");
        setAlarmeDisparado(tarefaParaDespertar);
      }
    }, 3000);

    return () => clearInterval(intervalo);
  }, [alarmesHabilitados, tarefas]);

  const abrirProgramadorHora = (tarefa: TarefaRotina) => {
    setTarefaEditando(tarefa);
    setHoraTemp(tarefa.hora || "08:00");
    setAlarmeTemp(tarefa.alarmeAtivo !== false);
    setSomTemp(tarefa.somAlarme || "sininho");
    setAnotacaoTemp(tarefa.anotacao || "");
    setReplicarSemana(false);
  };

  const salvarHoraEAnotacao = () => {
    if (!tarefaEditando) return;
    const novaHora = horaTemp || "08:00";
    const novaAnotacao = anotacaoTemp.trim();

    setTarefas((prev) =>
      prev.map((t) => {
        if (t.id === tarefaEditando.id) {
          return {
            ...t,
            hora: novaHora,
            alarmeAtivo: alarmeTemp,
            somAlarme: somTemp,
            anotacao: novaAnotacao,
          };
        }
        // Se optou por replicar nos dias úteis para a mesma atividade
        if (
          replicarSemana &&
          t.nome === tarefaEditando.nome &&
          ["seg", "ter", "qua", "qui", "sex"].includes(t.diaId)
        ) {
          return {
            ...t,
            hora: novaHora,
            alarmeAtivo: alarmeTemp,
            somAlarme: somTemp,
            anotacao: novaAnotacao,
          };
        }
        return t;
      })
    );

    const nomeDia =
      DIAS_SEMANA.find((d) => d.id === tarefaEditando.diaId)?.nome || "";
    setMensagemSucesso(
      `Atividade "${tarefaEditando.nome}" atualizada para ${novaHora}${
        novaAnotacao ? " com anotação salva" : ""
      }${replicarSemana ? " (aplicado de segunda a sexta)" : ` em ${nomeDia}`}!`
    );

    setTimeout(() => {
      setMensagemSucesso("");
    }, 4000);

    setTarefaEditando(null);
  };

  const alternarConcluida = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTarefas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, feita: !t.feita } : t))
    );
  };

  const restaurarPadrao = () => {
    setTarefas(TAREFAS_INICIAIS);
    setMensagemSucesso("Horários, alarmes e anotações padrão restaurados com sucesso!");
    setTimeout(() => setMensagemSucesso(""), 3500);
  };

  // Testa o alarme imediatamente com som delicado
  const testarAlarmeAgora = (tarefaExemplo?: TarefaRotina) => {
    const alvo =
      tarefaExemplo ||
      tarefas.find((t) => t.diaId === obterDiaSemanaAtual()) ||
      tarefas[0];
    tocarAlarmeDelicado(alvo.somAlarme || "sininho");
    setAlarmeDisparado(alvo);
  };

  const adiarAlarme = (minutos: number) => {
    if (!alarmeDisparado) return;
    const [h, m] = alarmeDisparado.hora.split(":").map(Number);
    const data = new Date();
    data.setHours(h || 0, (m || 0) + minutos);
    const novaHora = `${String(data.getHours()).padStart(2, "0")}:${String(
      data.getMinutes()
    ).padStart(2, "0")}`;

    setTarefas((prev) =>
      prev.map((t) => (t.id === alarmeDisparado.id ? { ...t, hora: novaHora } : t))
    );

    setMensagemSucesso(
      `Alarme de "${alarmeDisparado.nome}" adiado em ${minutos} min (novo horário: ${novaHora})`
    );
    setTimeout(() => setMensagemSucesso(""), 3500);
    setAlarmeDisparado(null);
  };

  const diasParaExibir =
    diaSelecionado === "todos"
      ? DIAS_SEMANA
      : DIAS_SEMANA.filter((d) => d.id === diaSelecionado);

  return (
    <div
      className="p-4 sm:p-7 border"
      style={{
        borderRadius: "var(--raio-lg)",
        borderColor: "var(--cor-bege-escuro)",
        backgroundColor: "var(--cor-branco)",
        boxShadow: "var(--sombra)",
      }}
    >
      {/* Topo do Quadro com título amigável e controles */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b" style={{ borderColor: "var(--cor-bege-escuro)" }}>
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: "var(--cor-rosa-suave)", color: "var(--cor-rosa-escuro)" }}>
              <span aria-hidden="true">📝</span>
              <span>Horários, Alarmes & Anotações</span>
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold tabular-nums border" style={{ backgroundColor: "#FFFFFF", borderColor: "var(--cor-bege-escuro)", color: "var(--cor-texto)" }}>
              <span aria-hidden="true">⏱️</span>
              <span>Horário atual: <strong>{horaRelogio}</strong></span>
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold mb-1" style={{ fontFamily: "var(--fonte-titulo)", color: "var(--cor-texto)" }}>
            Personalize horários, alarmes e anotações de cada seguimento
          </h3>
          <p className="text-sm sm:text-base mb-0" style={{ color: "var(--cor-texto-suave)" }}>
            Toque nos cartões para programar o horário, escolher a melodia suave e registrar anotações ou combinados especiais da atividade.
          </p>
        </div>

        {/* Botões de controle */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
          <button
            type="button"
            onClick={() => testarAlarmeAgora()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-bold border cursor-pointer hover:bg-slate-50 transition-colors shadow-xs"
            style={{
              backgroundColor: "var(--cor-rosa-suave)",
              borderColor: "var(--cor-rosa)",
              color: "var(--cor-rosa-escuro)",
            }}
            title="Toca a melodia delicada de teste imediatamente"
          >
            <span aria-hidden="true">▶</span>
            <span>Testar Alarme Agora</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const novo = !alarmesHabilitados;
              setAlarmesHabilitados(novo);
              setMensagemSucesso(
                novo
                  ? "Alarmes sonoros ativados para todas as atividades programadas!"
                  : "Alarmes sonoros silenciados temporariamente."
              );
              setTimeout(() => setMensagemSucesso(""), 3500);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs sm:text-sm font-semibold border cursor-pointer transition-colors"
            style={{
              borderColor: "var(--cor-bege-escuro)",
              color: alarmesHabilitados ? "var(--cor-salvia-escuro)" : "var(--cor-texto-suave)",
              backgroundColor: alarmesHabilitados ? "#F3FAF2" : "#FFFFFF",
            }}
          >
            <span>{alarmesHabilitados ? "🔔 Som ativo" : "🔕 Mudo"}</span>
          </button>

          <button
            type="button"
            onClick={restaurarPadrao}
            className="px-3 py-2 rounded-full text-xs sm:text-sm font-semibold border cursor-pointer hover:bg-slate-50 transition-colors whitespace-nowrap"
            style={{
              borderColor: "var(--cor-bege-escuro)",
              color: "var(--cor-texto-suave)",
              backgroundColor: "#FFFFFF",
            }}
          >
            Restaurar
          </button>
        </div>
      </div>

      {/* Notificação amigável de status */}
      {mensagemSucesso && (
        <div
          role="status"
          className="my-4 px-4 py-3 rounded-xl border text-sm font-semibold flex items-center gap-2"
          style={{
            backgroundColor: "var(--cor-rosa-suave)",
            borderColor: "var(--cor-rosa)",
            color: "var(--cor-rosa-escuro)",
          }}
        >
          <span aria-hidden="true">✓</span>
          <span>{mensagemSucesso}</span>
        </div>
      )}

      {/* Barra de seleção de dias */}
      <div className="pt-5 pb-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-xs font-bold uppercase tracking-wide shrink-0 mr-1" style={{ color: "var(--cor-texto-suave)" }}>
          Visualizar:
        </span>
        <button
          type="button"
          onClick={() => setDiaSelecionado("todos")}
          className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold cursor-pointer transition-colors whitespace-nowrap shrink-0 border ${
            diaSelecionado === "todos"
              ? "text-white"
              : "hover:bg-slate-50"
          }`}
          style={{
            backgroundColor:
              diaSelecionado === "todos" ? "var(--cor-rosa-escuro)" : "#FFFFFF",
            borderColor: "var(--cor-bege-escuro)",
            color: diaSelecionado === "todos" ? "#FFFFFF" : "var(--cor-texto)",
          }}
        >
          Semana inteira
        </button>

        {DIAS_SEMANA.map((dia) => (
          <button
            key={dia.id}
            type="button"
            onClick={() => setDiaSelecionado(dia.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold cursor-pointer transition-colors whitespace-nowrap shrink-0 border ${
              diaSelecionado === dia.id ? "text-white" : "hover:bg-slate-50"
            }`}
            style={{
              backgroundColor:
                diaSelecionado === dia.id ? "var(--cor-salvia-escuro)" : "#FFFFFF",
              borderColor: "var(--cor-bege-escuro)",
              color: diaSelecionado === dia.id ? "#FFFFFF" : "var(--cor-texto)",
            }}
          >
            {dia.nome}
          </button>
        ))}
      </div>

      {/* Grade do Quadro Semanal com os botões interativos de cada tarefa */}
      <div
        className={`mt-4 grid gap-4 sm:gap-5 ${
          diaSelecionado === "todos"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-7"
            : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-4xl mx-auto"
        }`}
      >
        {diasParaExibir.map((dia) => {
          const tarefasDoDia = tarefas.filter((t) => t.diaId === dia.id);

          return (
            <div
              key={dia.id}
              className="flex flex-col p-3.5 sm:p-4 rounded-2xl border"
              style={{
                backgroundColor: "var(--cor-bege)",
                borderColor: "var(--cor-bege-escuro)",
              }}
            >
              {/* Cabeçalho do dia */}
              <div
                className="py-2 px-3 rounded-xl text-center mb-3.5 font-bold text-sm tracking-wide"
                style={{
                  backgroundColor:
                    dia.id === "sab" || dia.id === "dom"
                      ? "var(--cor-rosa-suave)"
                      : "var(--cor-salvia)",
                  color:
                    dia.id === "sab" || dia.id === "dom"
                      ? "var(--cor-rosa-escuro)"
                      : "var(--cor-branco)",
                  fontFamily: "var(--fonte-titulo)",
                }}
              >
                {diaSelecionado === "todos" ? dia.nome : dia.nomeCompleto}
              </div>

              {/* Lista de botões interativos das tarefas */}
              <div className="flex flex-col gap-2.5 flex-1">
                {tarefasDoDia.map((tarefa) => (
                  <button
                    key={tarefa.id}
                    type="button"
                    onClick={() => abrirProgramadorHora(tarefa)}
                    aria-label={`Programar horário, alarme e anotação para ${tarefa.nome} em ${dia.nome}. Horário: ${tarefa.hora}`}
                    className="group relative flex flex-col items-start p-3 rounded-xl border text-left cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.99] focus:outline-none focus-visible:ring-2"
                    style={{
                      backgroundColor: tarefa.feita ? "#F3FAF2" : "#FFFFFF",
                      borderColor: tarefa.feita
                        ? "var(--cor-salvia)"
                        : "var(--cor-bege-escuro)",
                      boxShadow: "0 2px 8px rgb(61 53 53 / 0.05)",
                    }}
                  >
                    {/* Topo do cartão: Ícone e Badges de Horário e Alarme */}
                    <div className="w-full flex items-center justify-between gap-1.5 mb-2">
                      <span
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border overflow-hidden"
                        style={{
                          backgroundColor: "var(--cor-bege)",
                          borderColor: "var(--cor-bege-escuro)",
                          color: "var(--cor-salvia-escuro)",
                        }}
                      >
                        {tarefa.imagem ? (
                          <img
                            src={tarefa.imagem}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <IconeAtividadeSvg icone={tarefa.icone} />
                        )}
                      </span>

                      {/* Horário programado com indicador do som delicado */}
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold tabular-nums"
                        style={{
                          backgroundColor: "var(--cor-rosa-suave)",
                          color: "var(--cor-rosa-escuro)",
                        }}
                      >
                        <span aria-hidden="true">
                          {tarefa.alarmeAtivo !== false ? "🔔" : "⏱️"}
                        </span>
                        <span>{tarefa.hora}</span>
                      </span>
                    </div>

                    {/* Pré-visualização do cartão ilustrado oficial se houver */}
                    {tarefa.imagem && (
                      <div
                        className="w-full mb-2 overflow-hidden rounded-lg border aspect-[4/5] bg-white shadow-xs"
                        style={{ borderColor: "var(--cor-bege-escuro)" }}
                      >
                        <img
                          src={tarefa.imagem}
                          alt={`Cartão ilustrado ${tarefa.nome}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Nome da atividade */}
                    <span
                      className={`text-sm font-bold leading-tight block mb-1 ${
                        tarefa.feita ? "line-through opacity-75" : ""
                      }`}
                      style={{ color: "var(--cor-texto)" }}
                    >
                      {tarefa.nome}
                    </span>

                    {/* Campo visual de anotação do seguimento */}
                    {tarefa.anotacao ? (
                      <div
                        className="w-full my-1.5 p-2 rounded-lg text-left text-[11px] leading-snug flex items-start gap-1.5 border"
                        style={{
                          backgroundColor: "#FFF9FA",
                          borderColor: "var(--cor-bege-escuro)",
                          color: "var(--cor-texto)",
                        }}
                      >
                        <span aria-hidden="true" className="shrink-0 text-xs">📝</span>
                        <span className="line-clamp-2 font-medium italic opacity-90">
                          {tarefa.anotacao}
                        </span>
                      </div>
                    ) : (
                      <div
                        className="w-full my-1.5 py-1 px-2 rounded-lg border border-dashed text-[11px] text-center font-medium opacity-70 group-hover:opacity-100 transition-opacity"
                        style={{
                          borderColor: "var(--cor-bege-escuro)",
                          color: "var(--cor-texto-suave)",
                          backgroundColor: "transparent",
                        }}
                      >
                        <span>+ Adicionar anotação</span>
                      </div>
                    )}

                    {/* Rodapé do botão */}
                    <div className="w-full mt-1 pt-1.5 border-t flex items-center justify-between text-[11px]" style={{ borderColor: "#F2E8E9", color: "var(--cor-texto-suave)" }}>
                      <span className="group-hover:underline flex items-center gap-1 font-semibold" style={{ color: "var(--cor-rosa-escuro)" }}>
                        <span>Editar</span>
                      </span>
                      <span
                        onClick={(e) => alternarConcluida(tarefa.id, e)}
                        className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                        style={{
                          backgroundColor: tarefa.feita ? "var(--cor-salvia)" : "var(--cor-bege)",
                          color: tarefa.feita ? "#FFFFFF" : "var(--cor-texto-suave)",
                        }}
                        title="Marcar como concluída nesta demonstração"
                      >
                        {tarefa.feita ? "✓ Concluída" : "Pendente"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal / Dialog para programar a hora, o som e anotação da tarefa clicada */}
      {tarefaEditando && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-titulo"
          onClick={() => setTarefaEditando(null)}
        >
          <div
            className="w-full max-w-md p-6 sm:p-7 rounded-3xl border shadow-2xl relative max-h-[92vh] overflow-y-auto"
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "var(--cor-bege-escuro)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão fechar modal */}
            <button
              type="button"
              onClick={() => setTarefaEditando(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center border text-lg cursor-pointer hover:bg-slate-100"
              style={{
                borderColor: "var(--cor-bege-escuro)",
                color: "var(--cor-texto-suave)",
              }}
              aria-label="Fechar janela"
            >
              ✕
            </button>

            {/* Cabeçalho do modal com ícone e nome */}
            <div className="flex items-center gap-3.5 mb-5">
              {tarefaEditando.imagem ? (
                <div
                  className="w-14 h-18 rounded-xl overflow-hidden border shrink-0 shadow-xs bg-white"
                  style={{ borderColor: "var(--cor-bege-escuro)" }}
                >
                  <img
                    src={tarefaEditando.imagem}
                    alt={tarefaEditando.nome}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <span
                  className="w-12 h-12 rounded-2xl flex items-center justify-center border"
                  style={{
                    backgroundColor: "var(--cor-rosa-suave)",
                    borderColor: "var(--cor-rosa)",
                    color: "var(--cor-rosa-escuro)",
                  }}
                >
                  <IconeAtividadeSvg icone={tarefaEditando.icone} />
                </span>
              )}
              <div>
                <p className="text-xs uppercase font-bold tracking-wider mb-0.5" style={{ color: "var(--cor-salvia-escuro)" }}>
                  Programar atividade
                </p>
                <h4 id="modal-titulo" className="text-xl font-bold mb-0" style={{ color: "var(--cor-texto)", fontFamily: "var(--fonte-titulo)" }}>
                  {tarefaEditando.nome}
                </h4>
              </div>
            </div>

            {/* Campo principal de hora */}
            <div className="mb-4">
              <label
                htmlFor="input-hora-tarefa"
                className="block text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: "var(--cor-texto)" }}
              >
                Horário da atividade (HH:MM):
              </label>
              <input
                id="input-hora-tarefa"
                type="time"
                value={horaTemp}
                onChange={(e) => setHoraTemp(e.target.value)}
                className="w-full px-4 py-3 text-2xl font-bold rounded-xl border text-center tabular-nums focus:outline-none focus:ring-2"
                style={{
                  borderColor: "var(--cor-rosa)",
                  backgroundColor: "var(--cor-rosa-claro)",
                  color: "var(--cor-texto)",
                }}
              />
            </div>

            {/* Atalhos rápidos de horário */}
            <div className="mb-5">
              <span className="block text-xs font-semibold mb-2" style={{ color: "var(--cor-texto-suave)" }}>
                Horários sugeridos:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ATALHOS_HORA.map((hora) => (
                  <button
                    key={hora}
                    type="button"
                    onClick={() => setHoraTemp(hora)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border cursor-pointer transition-colors tabular-nums ${
                      horaTemp === hora ? "text-white" : "hover:bg-slate-50"
                    }`}
                    style={{
                      backgroundColor:
                        horaTemp === hora ? "var(--cor-rosa-escuro)" : "#FFFFFF",
                      borderColor: "var(--cor-bege-escuro)",
                      color: horaTemp === hora ? "#FFFFFF" : "var(--cor-texto)",
                    }}
                  >
                    {hora}
                  </button>
                ))}
              </div>
            </div>

            {/* Campo de Anotações e Combinados do Seguimento */}
            <div className="mb-5 p-3.5 rounded-2xl border" style={{ backgroundColor: "var(--cor-bege)", borderColor: "var(--cor-bege-escuro)" }}>
              <label
                htmlFor="input-anotacao-tarefa"
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1.5"
                style={{ color: "var(--cor-texto)" }}
              >
                <span aria-hidden="true">📝</span>
                <span>Anotações e combinados deste seguimento:</span>
              </label>
              <textarea
                id="input-anotacao-tarefa"
                rows={3}
                value={anotacaoTemp}
                onChange={(e) => setAnotacaoTemp(e.target.value)}
                placeholder="Ex.: Levar estojo e garrafinha de água, escovar com escova macia, combinado de guardar os brinquedos no cesto..."
                className="w-full p-3 rounded-xl border text-sm leading-relaxed focus:outline-none focus:ring-2 resize-none"
                style={{
                  borderColor: "var(--cor-bege-escuro)",
                  backgroundColor: "#FFFFFF",
                  color: "var(--cor-texto)",
                }}
              />

              {/* Sugestões rápidas de anotação */}
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold mr-1" style={{ color: "var(--cor-texto-suave)" }}>
                  Ideias rápidas:
                </span>
                {[
                  "No ritmo da criança",
                  "Lancheira e garrafinha",
                  "Música relaxante",
                  "História de ninar",
                ].map((sugestao) => (
                  <button
                    key={sugestao}
                    type="button"
                    onClick={() =>
                      setAnotacaoTemp((prev) =>
                        prev ? `${prev} · ${sugestao}` : sugestao
                      )
                    }
                    className="px-2 py-0.5 rounded-full text-[10px] font-semibold border cursor-pointer hover:bg-slate-100 transition-colors"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "var(--cor-bege-escuro)",
                      color: "var(--cor-texto-suave)",
                    }}
                  >
                    + {sugestao}
                  </button>
                ))}
              </div>
            </div>

            {/* Configuração do Alarme Sonoro Delicado */}
            <div className="mb-5 p-3.5 rounded-2xl border" style={{ backgroundColor: "#FFFFFF", borderColor: "var(--cor-bege-escuro)" }}>
              <div className="flex items-center justify-between gap-2 mb-3">
                <label htmlFor="check-alarme-ativo" className="flex items-center gap-2 text-xs font-bold cursor-pointer" style={{ color: "var(--cor-texto)" }}>
                  <input
                    id="check-alarme-ativo"
                    type="checkbox"
                    checked={alarmeTemp}
                    onChange={(e) => setAlarmeTemp(e.target.checked)}
                    className="w-4 h-4 rounded cursor-pointer accent-[#8E3B46]"
                  />
                  <span>Despertar com som suave neste horário</span>
                </label>

                <button
                  type="button"
                  onClick={() => tocarAlarmeDelicado(somTemp)}
                  className="px-2.5 py-1 rounded-full text-xs font-bold border cursor-pointer hover:bg-slate-50 transition-colors"
                  style={{
                    backgroundColor: "var(--cor-rosa-suave)",
                    borderColor: "var(--cor-rosa)",
                    color: "var(--cor-rosa-escuro)",
                  }}
                  title="Ouvir demonstração da melodia"
                >
                  ▶ Ouvir som
                </button>
              </div>

              {alarmeTemp && (
                <div>
                  <span className="block text-[11px] font-semibold mb-1.5" style={{ color: "var(--cor-texto-suave)" }}>
                    Escolha a melodia delicada:
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {OPCOES_SONS.map((opcao) => (
                      <button
                        key={opcao.id}
                        type="button"
                        onClick={() => {
                          setSomTemp(opcao.id);
                          tocarAlarmeDelicado(opcao.id);
                        }}
                        className={`p-2 rounded-xl text-xs font-bold border cursor-pointer text-center transition-all ${
                          somTemp === opcao.id
                            ? "border-pink-800 shadow-xs"
                            : "hover:bg-slate-50"
                        }`}
                        style={{
                          backgroundColor:
                            somTemp === opcao.id ? "var(--cor-rosa-suave)" : "#FFFFFF",
                          borderColor:
                            somTemp === opcao.id ? "var(--cor-rosa-escuro)" : "var(--cor-bege-escuro)",
                          color:
                            somTemp === opcao.id ? "var(--cor-rosa-escuro)" : "var(--cor-texto)",
                        }}
                      >
                        <span className="block text-sm mb-0.5" aria-hidden="true">
                          {opcao.id === "sininho" ? "🔔" : opcao.id === "marimba" ? "🎵" : "✨"}
                        </span>
                        <span className="block leading-tight text-[11px]">{opcao.nome}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Opção para replicar em dias úteis */}
            <div className="mb-6 p-3 rounded-xl border flex items-center gap-3" style={{ backgroundColor: "#FFFFFF", borderColor: "var(--cor-bege-escuro)" }}>
              <input
                id="check-replicar"
                type="checkbox"
                checked={replicarSemana}
                onChange={(e) => setReplicarSemana(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer accent-[#8E3B46]"
              />
              <label
                htmlFor="check-replicar"
                className="text-xs font-medium cursor-pointer"
                style={{ color: "var(--cor-texto)" }}
              >
                Aplicar horário, alarme e anotação de Segunda a Sexta
              </label>
            </div>

            {/* Ações do modal */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setTarefaEditando(null)}
                className="flex-1 py-3 px-4 rounded-full border text-sm font-bold cursor-pointer hover:bg-slate-50"
                style={{
                  borderColor: "var(--cor-bege-escuro)",
                  color: "var(--cor-texto)",
                  backgroundColor: "#FFFFFF",
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={salvarHoraEAnotacao}
                className="flex-1 py-3 px-4 rounded-full text-sm font-bold text-white cursor-pointer transition-colors shadow-sm"
                style={{
                  backgroundColor: "var(--cor-rosa-escuro)",
                }}
              >
                Salvar atividade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal / Alerta de Alarme Disparado no Horário Programado */}
      {alarmeDisparado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="alarme-disparo-titulo"
        >
          <div
            className="w-full max-w-sm p-6 sm:p-7 rounded-3xl border shadow-2xl text-center relative"
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "var(--cor-rosa)",
            }}
          >
            {/* Ícone com animação de sino suave */}
            <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-4 border shadow-sm" style={{ backgroundColor: "var(--cor-rosa-suave)", borderColor: "var(--cor-rosa)", color: "var(--cor-rosa-escuro)" }}>
              <span className="text-4xl" aria-hidden="true">🔔</span>
            </div>

            <p className="text-xs uppercase font-bold tracking-wider mb-1" style={{ color: "var(--cor-salvia-escuro)" }}>
              Alerta de Rotina Suave
            </p>

            <h4 id="alarme-disparo-titulo" className="text-2xl font-bold mb-2" style={{ color: "var(--cor-texto)", fontFamily: "var(--fonte-titulo)" }}>
              Hora de {alarmeDisparado.nome}!
            </h4>

            <p className="text-sm mb-3" style={{ color: "var(--cor-texto-suave)" }}>
              Horário programado com carinho: <strong className="tabular-nums">{alarmeDisparado.hora}</strong>
            </p>

            {/* Anotação exibida no momento do alarme */}
            {alarmeDisparado.anotacao && (
              <div
                className="mb-4 p-3 rounded-2xl text-xs text-left flex items-start gap-2 border"
                style={{
                  backgroundColor: "var(--cor-bege)",
                  borderColor: "var(--cor-bege-escuro)",
                }}
              >
                <span className="text-base" aria-hidden="true">📝</span>
                <div>
                  <span className="font-bold block" style={{ color: "var(--cor-texto)" }}>
                    Anotação do momento:
                  </span>
                  <span style={{ color: "var(--cor-texto-suave)" }}>
                    {alarmeDisparado.anotacao}
                  </span>
                </div>
              </div>
            )}

            {/* Botão para ouvir a melodia de novo */}
            <div className="mb-5">
              <button
                type="button"
                onClick={() => tocarAlarmeDelicado(alarmeDisparado.somAlarme || "sininho")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer hover:bg-slate-50 transition-colors"
                style={{
                  backgroundColor: "var(--cor-bege)",
                  borderColor: "var(--cor-bege-escuro)",
                  color: "var(--cor-texto)",
                }}
              >
                <span>▶ Tocar som novamente</span>
              </button>
            </div>

            {/* Ações do alerta */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setAlarmeDisparado(null)}
                className="w-full py-3 px-4 rounded-full text-sm font-bold text-white cursor-pointer shadow-sm"
                style={{
                  backgroundColor: "var(--cor-rosa-escuro)",
                }}
              >
                Entendido com carinho
              </button>

              <button
                type="button"
                onClick={() => adiarAlarme(5)}
                className="w-full py-2.5 px-4 rounded-full border text-xs font-semibold cursor-pointer hover:bg-slate-50"
                style={{
                  borderColor: "var(--cor-bege-escuro)",
                  color: "var(--cor-texto-suave)",
                  backgroundColor: "#FFFFFF",
                }}
              >
                Lembrar novamente em 5 minutos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
