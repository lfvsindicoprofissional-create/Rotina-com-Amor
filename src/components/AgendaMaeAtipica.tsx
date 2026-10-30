import { useEffect, useRef, useState } from "react";
import { site } from "../data/site";
import {
  OPCOES_SONS,
  obterDiaSemanaAtual,
  obterHoraMinutoAtual,
  tocarAlarmeDelicado,
  type TipoAlarme,
} from "../lib/alarmes";
import { IconeAgendaSvg, type TipoIconeAgenda } from "./Icone";

export interface ItemAgendaMae {
  id: string;
  diaId: string;
  titulo: string;
  categoria: TipoIconeAgenda;
  profissionalOuLocal: string;
  hora: string; // "09:30"
  periodo: "Manhã" | "Tarde" | "Noite";
  alarmeAtivo: boolean;
  somAlarme: TipoAlarme;
  anotacao: string;
  concluido: boolean;
}

export const DIAS_AGENDA = [
  { id: "seg", nome: "Segunda", nomeCompleto: "Segunda-feira" },
  { id: "ter", nome: "Terça", nomeCompleto: "Terça-feira" },
  { id: "qua", nome: "Quarta", nomeCompleto: "Quarta-feira" },
  { id: "qui", nome: "Quinta", nomeCompleto: "Quinta-feira" },
  { id: "sex", nome: "Sexta", nomeCompleto: "Sexta-feira" },
  { id: "sab", nome: "Sábado", nomeCompleto: "Sábado" },
  { id: "dom", nome: "Domingo", nomeCompleto: "Domingo" },
] as const;

// Configurações do Calendário Oficial da Agenda (1900 a 2099)
export const ANO_INICIAL_CALENDARIO = 1900;
export const ANO_FINAL_CALENDARIO = 2099;

export const ANOS_CALENDARIO: number[] = Array.from(
  { length: ANO_FINAL_CALENDARIO - ANO_INICIAL_CALENDARIO + 1 },
  (_, i) => ANO_INICIAL_CALENDARIO + i
);

export const MESES_CALENDARIO = [
  { valor: 0, nome: "Janeiro", abrev: "Jan" },
  { valor: 1, nome: "Fevereiro", abrev: "Fev" },
  { valor: 2, nome: "Março", abrev: "Mar" },
  { valor: 3, nome: "Abril", abrev: "Abr" },
  { valor: 4, nome: "Maio", abrev: "Mai" },
  { valor: 5, nome: "Junho", abrev: "Jun" },
  { valor: 6, nome: "Julho", abrev: "Jul" },
  { valor: 7, nome: "Agosto", abrev: "Ago" },
  { valor: 8, nome: "Setembro", abrev: "Set" },
  { valor: 9, nome: "Outubro", abrev: "Out" },
  { valor: 10, nome: "Novembro", abrev: "Nov" },
  { valor: 11, nome: "Dezembro", abrev: "Dez" },
] as const;

export const DIAS_SEMANA_MAP: Record<number, { id: string; nomeCurto: string; nomeCompleto: string }> = {
  0: { id: "dom", nomeCurto: "Dom", nomeCompleto: "Domingo" },
  1: { id: "seg", nomeCurto: "Seg", nomeCompleto: "Segunda-feira" },
  2: { id: "ter", nomeCurto: "Ter", nomeCompleto: "Terça-feira" },
  3: { id: "qua", nomeCurto: "Qua", nomeCompleto: "Quarta-feira" },
  4: { id: "qui", nomeCurto: "Qui", nomeCompleto: "Quinta-feira" },
  5: { id: "sex", nomeCurto: "Sex", nomeCompleto: "Sexta-feira" },
  6: { id: "sab", nomeCurto: "Sáb", nomeCompleto: "Sábado" },
};

export function obterDiasNoMes(ano: number, mes: number): number {
  return new Date(ano, mes + 1, 0).getDate();
}

export function obterPrimeiroDiaSemanaMes(ano: number, mes: number): number {
  return new Date(ano, mes, 1).getDay();
}

export const CATEGORIAS_AGENDA: {
  id: TipoIconeAgenda;
  nome: string;
  corBg: string;
  corTexto: string;
}[] = [
  { id: "fono", nome: "Fonoaudiólogo", corBg: "#FDF0F2", corTexto: "var(--cor-rosa-escuro)" },
  { id: "terapia", nome: "Terapia", corBg: "#F0F6EC", corTexto: "var(--cor-salvia-escuro)" },
  { id: "fisio", nome: "Fisioterapia", corBg: "#EFF7F8", corTexto: "#2D6874" },
  { id: "medico", nome: "Consulta Médica", corBg: "#FFF3E8", corTexto: "#9B521D" },
  { id: "escola", nome: "Escola / Mediação", corBg: "#F7EEF8", corTexto: "#7B3B7E" },
  { id: "autocuidado", nome: "Autocuidado da Mãe", corBg: "var(--cor-rosa-suave)", corTexto: "var(--cor-rosa-escuro)" },
  { id: "medicacao", nome: "Medicação", corBg: "#F5EDE3", corTexto: "var(--cor-texto)" },
];

const ITENS_INICIAIS: ItemAgendaMae[] = [
  // Segunda
  {
    id: "seg-1",
    diaId: "seg",
    titulo: "Escola e Mediação",
    categoria: "escola",
    profissionalOuLocal: "Escola Municipal",
    hora: "08:00",
    periodo: "Manhã",
    alarmeAtivo: true,
    somAlarme: "sininho",
    anotacao: "Avisar a mediadora sobre noite agitada e conferir lancheira sem lactose",
    concluido: false,
  },
  {
    id: "seg-2",
    diaId: "seg",
    titulo: "Sessão com Fonoaudiólogo",
    categoria: "fono",
    profissionalOuLocal: "Dra. Camila - Clínica Conviver",
    hora: "10:30",
    periodo: "Manhã",
    alarmeAtivo: true,
    somAlarme: "marimba",
    anotacao: "Levar mordedor sensorial e pasta de comunicação alternativa (PECS)",
    concluido: false,
  },
  {
    id: "seg-3",
    diaId: "seg",
    titulo: "Terapia Ocupacional",
    categoria: "terapia",
    profissionalOuLocal: "Espaço Integrar",
    hora: "14:00",
    periodo: "Tarde",
    alarmeAtivo: true,
    somAlarme: "sininho",
    anotacao: "Trabalhar modulação sensorial tátil e planejamento práxico",
    concluido: false,
  },
  {
    id: "seg-4",
    diaId: "seg",
    titulo: "Pausa e Autocuidado da Mãe",
    categoria: "autocuidado",
    profissionalOuLocal: "Em casa",
    hora: "16:30",
    periodo: "Tarde",
    alarmeAtivo: true,
    somAlarme: "harpa",
    anotacao: "20 minutos para respirar, tomar um chá quentinho e desacelerar",
    concluido: false,
  },

  // Terça
  {
    id: "ter-1",
    diaId: "ter",
    titulo: "Escola e Adaptação",
    categoria: "escola",
    profissionalOuLocal: "Escola",
    hora: "08:00",
    periodo: "Manhã",
    alarmeAtivo: true,
    somAlarme: "sininho",
    anotacao: "Dia da atividade de artes com tinta atóxica",
    concluido: false,
  },
  {
    id: "ter-2",
    diaId: "ter",
    titulo: "Fisioterapia Motora",
    categoria: "fisio",
    profissionalOuLocal: "Dr. André - Centro Reabilitar",
    hora: "09:45",
    periodo: "Manhã",
    alarmeAtivo: true,
    somAlarme: "marimba",
    anotacao: "Exercícios de equilíbrio e fortalecimento na bola suíça",
    concluido: false,
  },
  {
    id: "ter-3",
    diaId: "ter",
    titulo: "Consulta Médica",
    categoria: "medico",
    profissionalOuLocal: "Neuropediatra - Consultório",
    hora: "15:00",
    periodo: "Tarde",
    alarmeAtivo: true,
    somAlarme: "sininho",
    anotacao: "Levar relatórios da escola, registros de sono e receitas para renovar",
    concluido: false,
  },

  // Quarta
  {
    id: "qua-1",
    diaId: "qua",
    titulo: "Escola",
    categoria: "escola",
    profissionalOuLocal: "Escola",
    hora: "08:00",
    periodo: "Manhã",
    alarmeAtivo: true,
    somAlarme: "sininho",
    anotacao: "Levar troca extra de roupa e fones de cancelamento de ruído",
    concluido: false,
  },
  {
    id: "qua-2",
    diaId: "qua",
    titulo: "Fonoaudiólogo - Comunicação",
    categoria: "fono",
    profissionalOuLocal: "Clínica",
    hora: "10:15",
    periodo: "Manhã",
    alarmeAtivo: true,
    somAlarme: "marimba",
    anotacao: "Acompanhar treino de apontar e novos cartões de escolha",
    concluido: false,
  },
  {
    id: "qua-3",
    diaId: "qua",
    titulo: "Psicoterapia / Terapia",
    categoria: "terapia",
    profissionalOuLocal: "Espaço Terapêutico",
    hora: "14:30",
    periodo: "Tarde",
    alarmeAtivo: true,
    somAlarme: "sininho",
    anotacao: "Lúdico com foco em regulação emocional e frustração",
    concluido: false,
  },

  // Quinta
  {
    id: "qui-1",
    diaId: "qui",
    titulo: "Escola",
    categoria: "escola",
    profissionalOuLocal: "Escola",
    hora: "08:00",
    periodo: "Manhã",
    alarmeAtivo: true,
    somAlarme: "sininho",
    anotacao: "Dia do parque: passar protetor solar antes de sair",
    concluido: false,
  },
  {
    id: "qui-2",
    diaId: "qui",
    titulo: "Fisioterapia",
    categoria: "fisio",
    profissionalOuLocal: "Clínica",
    hora: "09:30",
    periodo: "Manhã",
    alarmeAtivo: true,
    somAlarme: "marimba",
    anotacao: "Treino de marcha e dissociação de cinturas",
    concluido: false,
  },
  {
    id: "qui-3",
    diaId: "qui",
    titulo: "Terapia Ocupacional",
    categoria: "terapia",
    profissionalOuLocal: "Espaço Integrar",
    hora: "14:00",
    periodo: "Tarde",
    alarmeAtivo: true,
    somAlarme: "sininho",
    anotacao: "Treino de autonomia: abrir recipientes e calçar tênis",
    concluido: false,
  },

  // Sexta
  {
    id: "sex-1",
    diaId: "sex",
    titulo: "Escola e Reunião",
    categoria: "escola",
    profissionalOuLocal: "Coordenação Pedagógica",
    hora: "08:30",
    periodo: "Manhã",
    alarmeAtivo: true,
    somAlarme: "sininho",
    anotacao: "Alinhar adaptações do material didático e intervalos assistidos",
    concluido: false,
  },
  {
    id: "sex-2",
    diaId: "sex",
    titulo: "Autocuidado da Mãe",
    categoria: "autocuidado",
    profissionalOuLocal: "Momento pessoal",
    hora: "16:00",
    periodo: "Tarde",
    alarmeAtivo: true,
    somAlarme: "harpa",
    anotacao: "Caminhada leve e momento de silêncio para recarregar as energias",
    concluido: false,
  },

  // Sábado
  {
    id: "sab-1",
    diaId: "sab",
    titulo: "Atividade Aquática / Fisio",
    categoria: "fisio",
    profissionalOuLocal: "Piscina aquecida",
    hora: "09:30",
    periodo: "Manhã",
    alarmeAtivo: true,
    somAlarme: "marimba",
    anotacao: "Relaxamento aquático e estímulo de coordenação motora",
    concluido: false,
  },

  // Domingo
  {
    id: "dom-1",
    diaId: "dom",
    titulo: "Planejar a Semana Atípica",
    categoria: "autocuidado",
    profissionalOuLocal: "Em casa",
    hora: "16:00",
    periodo: "Tarde",
    alarmeAtivo: true,
    somAlarme: "harpa",
    anotacao: "Separar receitas, lancheiras e organizar o quadro visual da semana com a criança",
    concluido: false,
  },
];

const ATALHOS_HORA = [
  "07:30",
  "08:00",
  "09:30",
  "10:30",
  "13:30",
  "14:00",
  "15:00",
  "16:30",
  "18:00",
  "19:30",
];

interface AgendaMaeAtipicaProps {
  onVoltarParaInicio: () => void;
}

export function AgendaMaeAtipica({ onVoltarParaInicio }: AgendaMaeAtipicaProps) {
  const [itens, setItens] = useState<ItemAgendaMae[]>(ITENS_INICIAIS);
  const [diaSelecionado, setDiaSelecionado] = useState<string>("todos");
  const [itemEditando, setItemEditando] = useState<ItemAgendaMae | null>(null);

  // Campos temporários do formulário de edição
  const [tituloTemp, setTituloTemp] = useState("");
  const [categoriaTemp, setCategoriaTemp] = useState<TipoIconeAgenda>("terapia");
  const [profissionalTemp, setProfissionalTemp] = useState("");
  const [horaTemp, setHoraTemp] = useState("09:00");
  const [alarmeTemp, setAlarmeTemp] = useState(true);
  const [somTemp, setSomTemp] = useState<TipoAlarme>("sininho");
  const [anotacaoTemp, setAnotacaoTemp] = useState("");
  const [diaTemp, setDiaTemp] = useState("seg");
  const [replicarSemana, setReplicarSemana] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  // Estados do Calendário da Mãe Atípica (iniciando em 1900 e terminando em 2099)
  const [anoCalendario, setAnoCalendario] = useState<number>(() => {
    const hoje = new Date();
    return Math.min(ANO_FINAL_CALENDARIO, Math.max(ANO_INICIAL_CALENDARIO, hoje.getFullYear()));
  });
  const [mesCalendario, setMesCalendario] = useState<number>(() => new Date().getMonth());
  const [diaCalendario, setDiaCalendario] = useState<number>(() => new Date().getDate());
  const [gradeVisivel, setGradeVisivel] = useState<boolean>(true);
  const [anotacoesPorData, setAnotacoesPorData] = useState<Record<string, string>>(() => {
    if (typeof window !== "undefined") {
      try {
        const salvo = localStorage.getItem("rotina_agenda_mae_notas_datas");
        if (salvo) return JSON.parse(salvo);
      } catch {
        // ignora
      }
    }
    return {};
  });
  const [textoNotaData, setTextoNotaData] = useState<string>("");

  const chaveDataAtual = `${anoCalendario}-${String(mesCalendario + 1).padStart(2, "0")}-${String(diaCalendario).padStart(2, "0")}`;

  useEffect(() => {
    setTextoNotaData(anotacoesPorData[chaveDataAtual] || "");
  }, [chaveDataAtual, anotacoesPorData]);

  const mudarAno = (novoAno: number) => {
    const anoAjustado = Math.min(ANO_FINAL_CALENDARIO, Math.max(ANO_INICIAL_CALENDARIO, novoAno));
    setAnoCalendario(anoAjustado);
    const maxDias = obterDiasNoMes(anoAjustado, mesCalendario);
    if (diaCalendario > maxDias) {
      setDiaCalendario(maxDias);
    }
  };

  const mudarMes = (novoMes: number) => {
    const mesAjustado = Math.min(11, Math.max(0, novoMes));
    setMesCalendario(mesAjustado);
    const maxDias = obterDiasNoMes(anoCalendario, mesAjustado);
    if (diaCalendario > maxDias) {
      setDiaCalendario(maxDias);
    }
  };

  const mudarDia = (novoDia: number) => {
    const maxDias = obterDiasNoMes(anoCalendario, mesCalendario);
    const diaAjustado = Math.min(maxDias, Math.max(1, novoDia));
    setDiaCalendario(diaAjustado);
  };

  const irParaHoje = () => {
    const hoje = new Date();
    const a = Math.min(ANO_FINAL_CALENDARIO, Math.max(ANO_INICIAL_CALENDARIO, hoje.getFullYear()));
    const m = hoje.getMonth();
    const d = hoje.getDate();
    setAnoCalendario(a);
    setMesCalendario(m);
    setDiaCalendario(d);
    setMensagemSucesso(`Data ajustada para hoje: ${d} de ${MESES_CALENDARIO[m].nome} de ${a}`);
    setTimeout(() => setMensagemSucesso(""), 3000);
  };

  const irParaDiaAnterior = () => {
    if (diaCalendario > 1) {
      setDiaCalendario(diaCalendario - 1);
    } else {
      if (mesCalendario > 0) {
        const novoMes = mesCalendario - 1;
        const maxDias = obterDiasNoMes(anoCalendario, novoMes);
        setMesCalendario(novoMes);
        setDiaCalendario(maxDias);
      } else if (anoCalendario > ANO_INICIAL_CALENDARIO) {
        const novoAno = anoCalendario - 1;
        const novoMes = 11;
        const maxDias = obterDiasNoMes(novoAno, novoMes);
        setAnoCalendario(novoAno);
        setMesCalendario(novoMes);
        setDiaCalendario(maxDias);
      }
    }
  };

  const irParaProximoDia = () => {
    const maxDias = obterDiasNoMes(anoCalendario, mesCalendario);
    if (diaCalendario < maxDias) {
      setDiaCalendario(diaCalendario + 1);
    } else {
      if (mesCalendario < 11) {
        setMesCalendario(mesCalendario + 1);
        setDiaCalendario(1);
      } else if (anoCalendario < ANO_FINAL_CALENDARIO) {
        setAnoCalendario(anoCalendario + 1);
        setMesCalendario(0);
        setDiaCalendario(1);
      }
    }
  };

  const irParaMesAnterior = () => {
    if (mesCalendario > 0) {
      mudarMes(mesCalendario - 1);
    } else if (anoCalendario > ANO_INICIAL_CALENDARIO) {
      mudarAno(anoCalendario - 1);
      mudarMes(11);
    }
  };

  const irParaProximoMes = () => {
    if (mesCalendario < 11) {
      mudarMes(mesCalendario + 1);
    } else if (anoCalendario < ANO_FINAL_CALENDARIO) {
      mudarAno(anoCalendario + 1);
      mudarMes(0);
    }
  };

  const salvarNotaDataAtual = () => {
    const atualizado = {
      ...anotacoesPorData,
      [chaveDataAtual]: textoNotaData.trim(),
    };
    setAnotacoesPorData(atualizado);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("rotina_agenda_mae_notas_datas", JSON.stringify(atualizado));
      } catch {
        // ignora
      }
    }
    setMensagemSucesso(`Anotação de ${diaCalendario}/${mesCalendario + 1}/${anoCalendario} salva com carinho!`);
    setTimeout(() => setMensagemSucesso(""), 3000);
  };

  // Sistema de som e alarme em tempo real
  const [alarmesHabilitados, setAlarmesHabilitados] = useState(true);
  const [horaRelogio, setHoraRelogio] = useState(() => obterHoraMinutoAtual());
  const [alarmeDisparado, setAlarmeDisparado] = useState<ItemAgendaMae | null>(null);
  const ultimoAlarmeTocadoRef = useRef("");

  useEffect(() => {
    const intervalo = setInterval(() => {
      const horaAtual = obterHoraMinutoAtual();
      const diaAtual = obterDiaSemanaAtual();
      setHoraRelogio(horaAtual);

      if (!alarmesHabilitados) return;

      const chave = `agenda-${diaAtual}-${horaAtual}`;
      if (ultimoAlarmeTocadoRef.current === chave) return;

      const itemDisparar = itens.find(
        (i) =>
          i.diaId === diaAtual &&
          i.hora === horaAtual &&
          i.alarmeAtivo &&
          !i.concluido
      );

      if (itemDisparar) {
        ultimoAlarmeTocadoRef.current = chave;
        tocarAlarmeDelicado(itemDisparar.somAlarme || "sininho");
        setAlarmeDisparado(itemDisparar);
      }
    }, 3000);

    return () => clearInterval(intervalo);
  }, [alarmesHabilitados, itens]);

  const abrirEditor = (item: ItemAgendaMae) => {
    setItemEditando(item);
    setTituloTemp(item.titulo);
    setCategoriaTemp(item.categoria);
    setProfissionalTemp(item.profissionalOuLocal);
    setHoraTemp(item.hora);
    setAlarmeTemp(item.alarmeAtivo);
    setSomTemp(item.somAlarme);
    setAnotacaoTemp(item.anotacao || "");
    setDiaTemp(item.diaId);
    setReplicarSemana(false);
  };

  const criarNovoCompromisso = (diaPredefinido?: string | React.MouseEvent<HTMLButtonElement>) => {
    const novoDia =
      typeof diaPredefinido === "string"
        ? diaPredefinido
        : diaSelecionado === "todos"
        ? "seg"
        : diaSelecionado;
    const novo: ItemAgendaMae = {
      id: `custom-${Date.now()}`,
      diaId: novoDia,
      titulo: "Novo Compromisso",
      categoria: "terapia",
      profissionalOuLocal: "Clínica ou Escola",
      hora: "10:00",
      periodo: "Manhã",
      alarmeAtivo: true,
      somAlarme: "sininho",
      anotacao: "",
      concluido: false,
    };
    abrirEditor(novo);
  };

  const salvarCompromisso = () => {
    if (!itemEditando) return;
    const horaFinal = horaTemp || "09:00";
    const anotacaoFinal = anotacaoTemp.trim();
    const tituloFinal = tituloTemp.trim() || "Compromisso";

    setItens((prev) => {
      const existe = prev.some((i) => i.id === itemEditando.id);
      if (!existe) {
        // Inserção de novo compromisso
        const novoItem: ItemAgendaMae = {
          ...itemEditando,
          titulo: tituloFinal,
          categoria: categoriaTemp,
          profissionalOuLocal: profissionalTemp.trim(),
          hora: horaFinal,
          alarmeAtivo: alarmeTemp,
          somAlarme: somTemp,
          anotacao: anotacaoFinal,
          diaId: diaTemp,
        };
        return [...prev, novoItem];
      }

      return prev.map((i) => {
        if (i.id === itemEditando.id) {
          return {
            ...i,
            titulo: tituloFinal,
            categoria: categoriaTemp,
            profissionalOuLocal: profissionalTemp.trim(),
            hora: horaFinal,
            alarmeAtivo: alarmeTemp,
            somAlarme: somTemp,
            anotacao: anotacaoFinal,
            diaId: diaTemp,
          };
        }
        if (
          replicarSemana &&
          i.titulo === itemEditando.titulo &&
          ["seg", "ter", "qua", "qui", "sex"].includes(i.diaId)
        ) {
          return {
            ...i,
            categoria: categoriaTemp,
            profissionalOuLocal: profissionalTemp.trim(),
            hora: horaFinal,
            alarmeAtivo: alarmeTemp,
            somAlarme: somTemp,
            anotacao: anotacaoFinal,
          };
        }
        return i;
      });
    });

    setMensagemSucesso(`Compromisso "${tituloFinal}" programado com sucesso!`);
    setTimeout(() => setMensagemSucesso(""), 3500);
    setItemEditando(null);
  };

  const excluirCompromisso = (id: string) => {
    setItens((prev) => prev.filter((i) => i.id !== id));
    setMensagemSucesso("Compromisso removido da agenda.");
    setTimeout(() => setMensagemSucesso(""), 3000);
    setItemEditando(null);
  };

  const alternarConcluido = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItens((prev) =>
      prev.map((i) => (i.id === id ? { ...i, concluido: !i.concluido } : i))
    );
  };

  const restaurarPadrao = () => {
    setItens(ITENS_INICIAIS);
    setMensagemSucesso("Agenda padrão da mãe atípica restaurada com sucesso!");
    setTimeout(() => setMensagemSucesso(""), 3500);
  };

  const testarAlarmeAgora = () => {
    const alvo = itens[0];
    tocarAlarmeDelicado(alvo?.somAlarme || "sininho");
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

    setItens((prev) =>
      prev.map((i) => (i.id === alarmeDisparado.id ? { ...i, hora: novaHora } : i))
    );

    setMensagemSucesso(
      `Alarme de "${alarmeDisparado.titulo}" adiado em ${minutos} min (novo horário: ${novaHora})`
    );
    setTimeout(() => setMensagemSucesso(""), 3500);
    setAlarmeDisparado(null);
  };

  const diasParaExibir =
    diaSelecionado === "todos"
      ? DIAS_AGENDA
      : DIAS_AGENDA.filter((d) => d.id === diaSelecionado);

  const diasNoMesAtual = obterDiasNoMes(anoCalendario, mesCalendario);
  const primeiroDiaSemana = obterPrimeiroDiaSemanaMes(anoCalendario, mesCalendario);
  const dataObjetoAtual = new Date(anoCalendario, mesCalendario, diaCalendario);
  const infoDiaSemana = DIAS_SEMANA_MAP[dataObjetoAtual.getDay()] || DIAS_SEMANA_MAP[1];
  const nomeMesAtual = MESES_CALENDARIO[mesCalendario]?.nome || "Mês";
  const hojeReal = new Date();
  const eAnoReal = hojeReal.getFullYear() === anoCalendario;
  const eMesReal = hojeReal.getMonth() === mesCalendario;
  const diaReal = hojeReal.getDate();

  return (
    <div className="secao-padrao secao-branca">
      <div className="container-site">
        {/* Navegação de retorno */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onVoltarParaInicio}
            className="inline-flex items-center gap-2 text-sm sm:text-base font-bold cursor-pointer hover:underline"
            style={{ color: "var(--cor-rosa-escuro)" }}
          >
            <span aria-hidden="true">←</span>
            <span>Voltar para o Quadro da Família</span>
          </button>

          <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-white" style={{ borderColor: "var(--cor-bege-escuro)", color: "var(--cor-texto-suave)" }}>
            Agenda Oficial Rotina com Carinho
          </span>
        </div>

        {/* Cabeçalho acolhedor da página */}
        <div
          className="p-6 sm:p-9 rounded-3xl border mb-8"
          style={{
            backgroundColor: "var(--cor-bege)",
            borderColor: "var(--cor-bege-escuro)",
            boxShadow: "var(--sombra)",
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3" style={{ backgroundColor: "var(--cor-rosa-suave)", color: "var(--cor-rosa-escuro)" }}>
                <span aria-hidden="true">📋</span>
                <span>Apoio à Maternidade Atípica</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold mb-3" style={{ color: "var(--cor-texto)" }}>
                Agenda Diária da Mãe Atípica
              </h1>

              <p className="text-base sm:text-lg leading-relaxed mb-4" style={{ color: "var(--cor-texto-suave)" }}>
                Organize consultas médicas, sessões de fonoaudiólogo, fisioterapia, terapias, escola e momentos de pausa. Em cada compromisso, programe o horário exato, anote combinados para a equipe e desperte com alertas sonoros suaves e delicados.
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tabular-nums border bg-white" style={{ borderColor: "var(--cor-bege-escuro)", color: "var(--cor-texto)" }}>
                  <span aria-hidden="true">⏱️</span>
                  <span>Hora atual: {horaRelogio}</span>
                </span>
                <span className="text-xs font-medium" style={{ color: "var(--cor-salvia-escuro)" }}>
                  • Sininhos e melodias delicadas em tempo real
                </span>
              </div>
            </div>

            {/* Ações principais do topo da agenda */}
            <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
              <button
                type="button"
                onClick={criarNovoCompromisso}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold text-white cursor-pointer shadow-sm hover:opacity-95 transition-opacity"
                style={{ backgroundColor: "var(--cor-rosa-escuro)" }}
              >
                <span>+ Novo Compromisso</span>
              </button>

              <button
                type="button"
                onClick={testarAlarmeAgora}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold border cursor-pointer hover:bg-slate-50 transition-colors bg-white"
                style={{
                  borderColor: "var(--cor-rosa)",
                  color: "var(--cor-rosa-escuro)",
                }}
              >
                <span aria-hidden="true">▶</span>
                <span>Testar Alarme</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const novo = !alarmesHabilitados;
                  setAlarmesHabilitados(novo);
                  setMensagemSucesso(
                    novo
                      ? "Alarmes sonoros ativados para todas as terapias e compromissos!"
                      : "Alarmes sonoros silenciados temporariamente."
                  );
                  setTimeout(() => setMensagemSucesso(""), 3500);
                }}
                className="px-3.5 py-2.5 rounded-full text-sm font-semibold border cursor-pointer transition-colors bg-white"
                style={{
                  borderColor: "var(--cor-bege-escuro)",
                  color: alarmesHabilitados ? "var(--cor-salvia-escuro)" : "var(--cor-texto-suave)",
                }}
              >
                {alarmesHabilitados ? "🔔 Sons Ativos" : "🔕 Mudo"}
              </button>

              <button
                type="button"
                onClick={restaurarPadrao}
                className="px-3 py-2.5 rounded-full text-xs font-semibold border cursor-pointer hover:bg-slate-50 transition-colors bg-white text-slate-600"
                style={{ borderColor: "var(--cor-bege-escuro)" }}
                title="Restaura os compromissos iniciais de exemplo"
              >
                Restaurar
              </button>
            </div>
          </div>

          {/* Divisor elegante */}
          <div className="my-6 sm:my-8 border-t" style={{ borderColor: "var(--cor-bege-escuro)" }} />

          {/* Calendário da Mãe Atípica (Dia, Mês, Ano 1900 a 2099) */}
          <div className="rounded-2xl bg-white/95 border p-4 sm:p-6" style={{ borderColor: "var(--cor-bege-escuro)" }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-dashed" style={{ borderColor: "var(--cor-bege-escuro)" }}>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-1" style={{ backgroundColor: "var(--cor-rosa-suave)", color: "var(--cor-rosa-escuro)" }}>
                  <span aria-hidden="true">🗓️</span>
                  <span>Calendário Oficial (1900 – 2099)</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold" style={{ color: "var(--cor-texto)" }}>
                  Calendário da Família e Rotina
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Consulte qualquer data de 1900 a 2099, veja o dia da semana correspondente, filtre seus compromissos e guarde anotações diárias.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={irParaHoje}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border cursor-pointer hover:bg-rose-50 transition-colors bg-white"
                  style={{ borderColor: "var(--cor-rosa)", color: "var(--cor-rosa-escuro)" }}
                  title="Voltar para a data de hoje"
                >
                  <span aria-hidden="true">📍</span>
                  <span>Ir para Hoje</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGradeVisivel(!gradeVisivel)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border cursor-pointer hover:bg-slate-50 transition-colors bg-white text-slate-700"
                  style={{ borderColor: "var(--cor-bege-escuro)" }}
                >
                  <span aria-hidden="true">{gradeVisivel ? "▤" : "▦"}</span>
                  <span>{gradeVisivel ? "Ocultar Grade do Mês" : "Exibir Grade do Mês"}</span>
                </button>
              </div>
            </div>

            {/* Controles de Seleção: DIA, MÊS e ANO (iniciando em 1900 e terminando em 2099) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5">
              {/* Seleção do DIA */}
              <div className="p-3 sm:p-3.5 rounded-2xl border bg-slate-50/70" style={{ borderColor: "var(--cor-bege-escuro)" }}>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="calendario-dia-select" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Dia (1 a {diasNoMesAtual})
                  </label>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {diaCalendario} de {nomeMesAtual}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={irParaDiaAnterior}
                    aria-label="Dia anterior"
                    className="w-8 h-9 rounded-lg border bg-white flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 cursor-pointer text-sm"
                    style={{ borderColor: "var(--cor-bege-escuro)" }}
                    title="Dia anterior"
                  >
                    ‹
                  </button>
                  <select
                    id="calendario-dia-select"
                    value={diaCalendario}
                    onChange={(e) => mudarDia(Number(e.target.value))}
                    className="flex-1 h-9 px-2.5 rounded-lg border bg-white text-sm font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-300"
                    style={{ borderColor: "var(--cor-bege-escuro)", color: "var(--cor-texto)" }}
                  >
                    {Array.from({ length: diasNoMesAtual }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>
                        Dia {d}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={irParaProximoDia}
                    aria-label="Próximo dia"
                    className="w-8 h-9 rounded-lg border bg-white flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 cursor-pointer text-sm"
                    style={{ borderColor: "var(--cor-bege-escuro)" }}
                    title="Próximo dia"
                  >
                    ›
                  </button>
                </div>
              </div>

              {/* Seleção do MÊS */}
              <div className="p-3 sm:p-3.5 rounded-2xl border bg-slate-50/70" style={{ borderColor: "var(--cor-bege-escuro)" }}>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="calendario-mes-select" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Mês (12 meses)
                  </label>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Mês {mesCalendario + 1}/12
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={irParaMesAnterior}
                    aria-label="Mês anterior"
                    className="w-8 h-9 rounded-lg border bg-white flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 cursor-pointer text-sm"
                    style={{ borderColor: "var(--cor-bege-escuro)" }}
                    title="Mês anterior"
                  >
                    ‹
                  </button>
                  <select
                    id="calendario-mes-select"
                    value={mesCalendario}
                    onChange={(e) => mudarMes(Number(e.target.value))}
                    className="flex-1 h-9 px-2.5 rounded-lg border bg-white text-sm font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-300"
                    style={{ borderColor: "var(--cor-bege-escuro)", color: "var(--cor-texto)" }}
                  >
                    {MESES_CALENDARIO.map((m) => (
                      <option key={m.valor} value={m.valor}>
                        {m.nome}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={irParaProximoMes}
                    aria-label="Próximo mês"
                    className="w-8 h-9 rounded-lg border bg-white flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 cursor-pointer text-sm"
                    style={{ borderColor: "var(--cor-bege-escuro)" }}
                    title="Próximo mês"
                  >
                    ›
                  </button>
                </div>
              </div>

              {/* Seleção do ANO (iniciando em 1900 e terminando em 2099) */}
              <div className="p-3 sm:p-3.5 rounded-2xl border bg-slate-50/70" style={{ borderColor: "var(--cor-bege-escuro)" }}>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="calendario-ano-select" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Ano (1900 a 2099)
                  </label>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Faixa: 1900–2099
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => mudarAno(anoCalendario - 1)}
                    disabled={anoCalendario <= ANO_INICIAL_CALENDARIO}
                    aria-label="Ano anterior"
                    className="w-8 h-9 rounded-lg border bg-white flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-sm"
                    style={{ borderColor: "var(--cor-bege-escuro)" }}
                    title="Ano anterior"
                  >
                    ‹
                  </button>
                  <select
                    id="calendario-ano-select"
                    value={anoCalendario}
                    onChange={(e) => mudarAno(Number(e.target.value))}
                    className="flex-1 h-9 px-2.5 rounded-lg border bg-white text-sm font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-300"
                    style={{ borderColor: "var(--cor-bege-escuro)", color: "var(--cor-texto)" }}
                  >
                    {ANOS_CALENDARIO.map((ano) => (
                      <option key={ano} value={ano}>
                        {ano}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => mudarAno(anoCalendario + 1)}
                    disabled={anoCalendario >= ANO_FINAL_CALENDARIO}
                    aria-label="Próximo ano"
                    className="w-8 h-9 rounded-lg border bg-white flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-sm"
                    style={{ borderColor: "var(--cor-bege-escuro)" }}
                    title="Próximo ano"
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>

            {/* Cartão de data selecionada + Sincronização com a Agenda */}
            <div
              className="p-4 sm:p-5 rounded-2xl border mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              style={{
                backgroundColor: "var(--cor-rosa-suave)",
                borderColor: "var(--cor-rosa)",
              }}
            >
              <div>
                <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--cor-rosa-escuro)" }}>
                  Data em Destaque no Calendário
                </div>
                <div className="text-lg sm:text-2xl font-bold flex flex-wrap items-center gap-2" style={{ color: "var(--cor-texto)" }}>
                  <span aria-hidden="true">📅</span>
                  <span>{infoDiaSemana.nomeCompleto}, {diaCalendario} de {nomeMesAtual} de {anoCalendario}</span>
                  {eAnoReal && eMesReal && diaReal === diaCalendario && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-white font-bold border" style={{ borderColor: "var(--cor-rosa)", color: "var(--cor-rosa-escuro)" }}>
                      Hoje
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 mt-1">
                  Correspondência semanal: <strong>{infoDiaSemana.nomeCompleto} ({infoDiaSemana.id.toUpperCase()})</strong>.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDiaSelecionado(infoDiaSemana.id);
                    setMensagemSucesso(`Filtro da agenda direcionado para ${infoDiaSemana.nomeCompleto}!`);
                    setTimeout(() => setMensagemSucesso(""), 3000);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white cursor-pointer hover:opacity-95 shadow-sm transition-opacity"
                  style={{ backgroundColor: "var(--cor-rosa-escuro)" }}
                >
                  <span>Ver Compromissos de {infoDiaSemana.nomeCurto}</span>
                </button>

                <button
                  type="button"
                  onClick={() => criarNovoCompromisso(infoDiaSemana.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border bg-white cursor-pointer hover:bg-slate-50 transition-colors"
                  style={{ borderColor: "var(--cor-bege-escuro)", color: "var(--cor-texto)" }}
                >
                  <span>+ Novo para {infoDiaSemana.nomeCurto}</span>
                </button>
              </div>
            </div>

            {/* Grade Visual Mensal (Dom a Sáb) */}
            {gradeVisivel && (
              <div className="mb-5 p-3 sm:p-4 rounded-2xl border bg-white" style={{ borderColor: "var(--cor-bege-escuro)" }}>
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Grade do Mês: {nomeMesAtual} de {anoCalendario}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Clique em um dia para selecioná-lo
                  </span>
                </div>

                {/* Cabeçalho dos dias da semana */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center text-xs font-bold text-slate-600">
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((diaNome, idx) => (
                    <div
                      key={diaNome}
                      className={`py-1.5 rounded-lg ${
                        idx === 0 || idx === 6 ? "bg-slate-100 text-slate-500" : "bg-slate-50 text-slate-700"
                      }`}
                    >
                      {diaNome}
                    </div>
                  ))}
                </div>

                {/* Células de dias do mês */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {/* Espaços vazios do início do mês */}
                  {Array.from({ length: primeiroDiaSemana }).map((_, i) => (
                    <div key={`vazio-${i}`} className="h-9 sm:h-11 rounded-xl bg-slate-50/50" />
                  ))}

                  {/* Dias válidos */}
                  {Array.from({ length: diasNoMesAtual }, (_, i) => i + 1).map((d) => {
                    const eSelecionado = d === diaCalendario;
                    const eHoje = eAnoReal && eMesReal && d === diaReal;
                    const chaveDataD = `${anoCalendario}-${String(mesCalendario + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                    const temNota = Boolean(anotacoesPorData[chaveDataD]);

                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDiaCalendario(d)}
                        className={`relative h-9 sm:h-11 rounded-xl flex flex-col items-center justify-center font-bold text-xs sm:text-sm cursor-pointer transition-all border ${
                          eSelecionado
                            ? "text-white shadow-md scale-105 z-10"
                            : eHoje
                            ? "bg-rose-50 border-rose-300 text-slate-900 hover:bg-rose-100"
                            : "bg-white border-slate-200 text-slate-800 hover:bg-slate-100"
                        }`}
                        style={{
                          backgroundColor: eSelecionado ? "var(--cor-rosa-escuro)" : undefined,
                          borderColor: eSelecionado ? "var(--cor-rosa-escuro)" : undefined,
                        }}
                        title={`Dia ${d} de ${nomeMesAtual} de ${anoCalendario}`}
                      >
                        <span>{d}</span>
                        {temNota && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full -mt-0.5 ${
                              eSelecionado ? "bg-white" : "bg-rose-500"
                            }`}
                            title="Há anotações registradas para esta data"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bloco de Anotações da Mãe para a Data Selecionada */}
            <div className="p-4 rounded-2xl border bg-slate-50" style={{ borderColor: "var(--cor-bege-escuro)" }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <label htmlFor="calendario-anotacao-data" className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span aria-hidden="true">📝</span>
                  <span>Anotação da Mãe para {diaCalendario}/{mesCalendario + 1}/{anoCalendario} ({infoDiaSemana.nomeCompleto})</span>
                </label>
                <span className="text-[11px] text-slate-500">
                  Salve observações de sono, medicações, intercorrências ou recados médicos
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  id="calendario-anotacao-data"
                  type="text"
                  value={textoNotaData}
                  onChange={(e) => setTextoNotaData(e.target.value)}
                  placeholder="Ex: Consulta às 14h com Dr. André; noite tranquila; levar laudo fonoaudiológico..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  style={{ borderColor: "var(--cor-bege-escuro)", color: "var(--cor-texto)" }}
                />
                <button
                  type="button"
                  onClick={salvarNotaDataAtual}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white cursor-pointer hover:opacity-95 transition-opacity shrink-0"
                  style={{ backgroundColor: "var(--cor-salvia-escuro)" }}
                >
                  Salvar Observação
                </button>
              </div>
              {anotacoesPorData[chaveDataAtual] && (
                <p className="mt-2 text-xs font-medium text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  ✓ Registro ativo para esta data: &quot;{anotacoesPorData[chaveDataAtual]}&quot;
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Mensagem de status */}
        {mensagemSucesso && (
          <div
            role="status"
            className="mb-6 px-4 py-3 rounded-2xl border text-sm font-semibold flex items-center gap-2"
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

        {/* Filtros de Dias da Semana */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <span className="text-xs font-bold uppercase tracking-wider shrink-0 mr-1" style={{ color: "var(--cor-texto-suave)" }}>
            Visualizar dia:
          </span>
          <button
            type="button"
            onClick={() => setDiaSelecionado("todos")}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold cursor-pointer transition-colors whitespace-nowrap shrink-0 border ${
              diaSelecionado === "todos" ? "text-white" : "hover:bg-slate-50"
            }`}
            style={{
              backgroundColor: diaSelecionado === "todos" ? "var(--cor-rosa-escuro)" : "#FFFFFF",
              borderColor: "var(--cor-bege-escuro)",
              color: diaSelecionado === "todos" ? "#FFFFFF" : "var(--cor-texto)",
            }}
          >
            Semana Completa
          </button>

          {DIAS_AGENDA.map((dia) => (
            <button
              key={dia.id}
              type="button"
              onClick={() => setDiaSelecionado(dia.id)}
              className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-bold cursor-pointer transition-colors whitespace-nowrap shrink-0 border ${
                diaSelecionado === dia.id ? "text-white" : "hover:bg-slate-50"
              }`}
              style={{
                backgroundColor: diaSelecionado === dia.id ? "var(--cor-salvia-escuro)" : "#FFFFFF",
                borderColor: "var(--cor-bege-escuro)",
                color: diaSelecionado === dia.id ? "#FFFFFF" : "var(--cor-texto)",
              }}
            >
              {dia.nome}
            </button>
          ))}
        </div>

        {/* Grade semanal de compromissos da mãe atípica */}
        <div
          className={`grid gap-5 ${
            diaSelecionado === "todos"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-7"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto"
          }`}
        >
          {diasParaExibir.map((dia) => {
            const itensDoDia = itens.filter((i) => i.diaId === dia.id);

            return (
              <div
                key={dia.id}
                className="flex flex-col p-4 rounded-2xl border"
                style={{
                  backgroundColor: "var(--cor-bege)",
                  borderColor: "var(--cor-bege-escuro)",
                }}
              >
                {/* Título do dia */}
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
                        : "#FFFFFF",
                    fontFamily: "var(--fonte-titulo)",
                  }}
                >
                  {diaSelecionado === "todos" ? dia.nome : dia.nomeCompleto}
                </div>

                {/* Lista de cartões de compromisso */}
                <div className="flex flex-col gap-3 flex-1">
                  {itensDoDia.length === 0 ? (
                    <div className="py-6 px-3 text-center rounded-xl border border-dashed text-xs" style={{ borderColor: "var(--cor-bege-escuro)", color: "var(--cor-texto-suave)" }}>
                      Nenhum compromisso marcado para este dia.
                      <button
                        type="button"
                        onClick={criarNovoCompromisso}
                        className="block mt-2 mx-auto text-xs font-bold underline"
                        style={{ color: "var(--cor-rosa-escuro)" }}
                      >
                        + Adicionar
                      </button>
                    </div>
                  ) : (
                    itensDoDia.map((item) => {
                      const categoriaMeta =
                        CATEGORIAS_AGENDA.find((c) => c.id === item.categoria) ||
                        CATEGORIAS_AGENDA[0];

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => abrirEditor(item)}
                          aria-label={`Editar ${item.titulo} às ${item.hora}. Toque para programar horas, alarme e anotações.`}
                          className="group relative flex flex-col items-start p-3.5 rounded-xl border text-left cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus-visible:ring-2"
                          style={{
                            backgroundColor: item.concluido ? "#F3FAF2" : "#FFFFFF",
                            borderColor: item.concluido ? "var(--cor-salvia)" : "var(--cor-bege-escuro)",
                            boxShadow: "0 2px 8px rgb(61 53 53 / 0.05)",
                          }}
                        >
                          {/* Topo do cartão: Categoria e Badge de Horário Programado */}
                          <div className="w-full flex items-center justify-between gap-1.5 mb-2">
                            <span
                              className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1"
                              style={{
                                backgroundColor: categoriaMeta.corBg,
                                color: categoriaMeta.corTexto,
                              }}
                            >
                              <IconeAgendaSvg icone={item.categoria} className="w-3.5 h-3.5" />
                              <span>{categoriaMeta.nome}</span>
                            </span>

                            {/* Badge de Horário e Alarme */}
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold tabular-nums"
                              style={{
                                backgroundColor: "var(--cor-rosa-suave)",
                                color: "var(--cor-rosa-escuro)",
                              }}
                            >
                              <span aria-hidden="true">{item.alarmeAtivo ? "🔔" : "⏱️"}</span>
                              <span>{item.hora}</span>
                            </span>
                          </div>

                          {/* Título do compromisso */}
                          <span
                            className={`text-sm font-bold leading-tight block mb-0.5 ${
                              item.concluido ? "line-through opacity-75" : ""
                            }`}
                            style={{ color: "var(--cor-texto)" }}
                          >
                            {item.titulo}
                          </span>

                          {/* Profissional ou local */}
                          {item.profissionalOuLocal && (
                            <span className="text-[11px] block mb-1.5 font-medium" style={{ color: "var(--cor-salvia-escuro)" }}>
                              📍 {item.profissionalOuLocal}
                            </span>
                          )}

                          {/* Campo de Anotações do Seguimento */}
                          {item.anotacao ? (
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
                                {item.anotacao}
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
                              <span>+ Anotação do atendimento</span>
                            </div>
                          )}

                          {/* Rodapé do botão */}
                          <div className="w-full mt-1 pt-1.5 border-t flex items-center justify-between text-[11px]" style={{ borderColor: "#F2E8E9", color: "var(--cor-texto-suave)" }}>
                            <span className="group-hover:underline font-semibold" style={{ color: "var(--cor-rosa-escuro)" }}>
                              Programar
                            </span>

                            <span
                              onClick={(e) => alternarConcluido(item.id, e)}
                              className="px-2 py-0.5 rounded text-[10px] font-bold"
                              style={{
                                backgroundColor: item.concluido ? "var(--cor-salvia)" : "var(--cor-bege)",
                                color: item.concluido ? "#FFFFFF" : "var(--cor-texto-suave)",
                              }}
                              title="Marcar como realizado"
                            >
                              {item.concluido ? "✓ Realizado" : "Pendente"}
                            </span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal interativo para programar horário, alarme e anotação */}
        {itemEditando && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-agenda-titulo"
            onClick={() => setItemEditando(null)}
          >
            <div
              className="w-full max-w-lg p-6 sm:p-7 rounded-3xl border shadow-2xl relative max-h-[92vh] overflow-y-auto"
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: "var(--cor-bege-escuro)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setItemEditando(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center border text-lg cursor-pointer hover:bg-slate-100"
                style={{
                  borderColor: "var(--cor-bege-escuro)",
                  color: "var(--cor-texto-suave)",
                }}
                aria-label="Fechar janela"
              >
                ✕
              </button>

              <div className="flex items-center gap-3.5 mb-5">
                <span
                  className="w-12 h-12 rounded-2xl flex items-center justify-center border"
                  style={{
                    backgroundColor: "var(--cor-rosa-suave)",
                    borderColor: "var(--cor-rosa)",
                    color: "var(--cor-rosa-escuro)",
                  }}
                >
                  <IconeAgendaSvg icone={categoriaTemp} className="w-6 h-6" />
                </span>
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider mb-0.5" style={{ color: "var(--cor-salvia-escuro)" }}>
                    Programação do compromisso
                  </p>
                  <h4 id="modal-agenda-titulo" className="text-xl font-bold mb-0" style={{ color: "var(--cor-texto)", fontFamily: "var(--fonte-titulo)" }}>
                    {tituloTemp || "Novo Compromisso"}
                  </h4>
                </div>
              </div>

              {/* Título do compromisso */}
              <div className="mb-4">
                <label htmlFor="input-agenda-titulo" className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--cor-texto)" }}>
                  Nome da atividade ou compromisso:
                </label>
                <input
                  id="input-agenda-titulo"
                  type="text"
                  value={tituloTemp}
                  onChange={(e) => setTituloTemp(e.target.value)}
                  placeholder="Ex.: Fonoaudiólogo, Fisioterapia, Neuropediatra, Escola..."
                  className="w-full px-3.5 py-2.5 rounded-xl border text-base font-semibold focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--cor-bege-escuro)",
                    backgroundColor: "var(--cor-rosa-claro)",
                    color: "var(--cor-texto)",
                  }}
                />
              </div>

              {/* Seleção de Categoria */}
              <div className="mb-4">
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--cor-texto)" }}>
                  Seguimento / Especialidade:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {CATEGORIAS_AGENDA.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoriaTemp(cat.id)}
                      className={`p-2 rounded-xl text-xs font-bold border cursor-pointer text-left flex items-center gap-1.5 transition-all ${
                        categoriaTemp === cat.id ? "shadow-xs ring-2 ring-[#8E3B46]" : "hover:bg-slate-50"
                      }`}
                      style={{
                        backgroundColor: categoriaTemp === cat.id ? cat.corBg : "#FFFFFF",
                        borderColor: "var(--cor-bege-escuro)",
                        color: cat.corTexto,
                      }}
                    >
                      <IconeAgendaSvg icone={cat.id} className="w-4 h-4 shrink-0" />
                      <span className="truncate">{cat.nome}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Profissional ou local */}
              <div className="mb-4">
                <label htmlFor="input-agenda-prof" className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--cor-texto)" }}>
                  Profissional ou local de atendimento:
                </label>
                <input
                  id="input-agenda-prof"
                  type="text"
                  value={profissionalTemp}
                  onChange={(e) => setProfissionalTemp(e.target.value)}
                  placeholder="Ex.: Dra. Camila, Clínica Reabilitar, Escola Municipal..."
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--cor-bege-escuro)",
                    backgroundColor: "var(--cor-rosa-claro)",
                    color: "var(--cor-texto)",
                  }}
                />
              </div>

              {/* Dia da semana e Horário */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="select-agenda-dia" className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--cor-texto)" }}>
                    Dia da semana:
                  </label>
                  <select
                    id="select-agenda-dia"
                    value={diaTemp}
                    onChange={(e) => setDiaTemp(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm font-bold focus:outline-none focus:ring-2"
                    style={{
                      borderColor: "var(--cor-bege-escuro)",
                      backgroundColor: "var(--cor-rosa-claro)",
                      color: "var(--cor-texto)",
                    }}
                  >
                    {DIAS_AGENDA.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nomeCompleto}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="input-agenda-hora" className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--cor-texto)" }}>
                    Horário (HH:MM):
                  </label>
                  <input
                    id="input-agenda-hora"
                    type="time"
                    value={horaTemp}
                    onChange={(e) => setHoraTemp(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xl font-bold text-center tabular-nums focus:outline-none focus:ring-2"
                    style={{
                      borderColor: "var(--cor-rosa)",
                      backgroundColor: "var(--cor-rosa-claro)",
                      color: "var(--cor-texto)",
                    }}
                  />
                </div>
              </div>

              {/* Atalhos rápidos de horário */}
              <div className="mb-4">
                <span className="block text-xs font-semibold mb-1.5" style={{ color: "var(--cor-texto-suave)" }}>
                  Horários comuns de atendimento:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {ATALHOS_HORA.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHoraTemp(h)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg border cursor-pointer transition-colors tabular-nums ${
                        horaTemp === h ? "text-white" : "hover:bg-slate-50"
                      }`}
                      style={{
                        backgroundColor: horaTemp === h ? "var(--cor-rosa-escuro)" : "#FFFFFF",
                        borderColor: "var(--cor-bege-escuro)",
                        color: horaTemp === h ? "#FFFFFF" : "var(--cor-texto)",
                      }}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              {/* Campo de Anotações do Seguimento */}
              <div className="mb-5 p-3.5 rounded-2xl border" style={{ backgroundColor: "var(--cor-bege)", borderColor: "var(--cor-bege-escuro)" }}>
                <label
                  htmlFor="textarea-agenda-anotacao"
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1.5"
                  style={{ color: "var(--cor-texto)" }}
                >
                  <span aria-hidden="true">📝</span>
                  <span>Anotações e preparativos para este seguimento:</span>
                </label>
                <textarea
                  id="textarea-agenda-anotacao"
                  rows={3}
                  value={anotacaoTemp}
                  onChange={(e) => setAnotacaoTemp(e.target.value)}
                  placeholder="Ex.: Levar pasta de comunicação alternativa, mordedor sensorial, pedir relatório atualizado para a escola..."
                  className="w-full p-3 rounded-xl border text-sm leading-relaxed focus:outline-none focus:ring-2 resize-none bg-white"
                  style={{
                    borderColor: "var(--cor-bege-escuro)",
                    color: "var(--cor-texto)",
                  }}
                />

                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-semibold mr-1" style={{ color: "var(--cor-texto-suave)" }}>
                    Lembretes rápidos:
                  </span>
                  {[
                    "Levar relatório anterior",
                    "Anotar dúvidas para o profissional",
                    "Levar lanche e brinquedo de transição",
                    "Avisar sobre noite mal dormida",
                  ].map((sugestao) => (
                    <button
                      key={sugestao}
                      type="button"
                      onClick={() =>
                        setAnotacaoTemp((prev) =>
                          prev ? `${prev} · ${sugestao}` : sugestao
                        )
                      }
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold border cursor-pointer hover:bg-slate-100 transition-colors bg-white"
                      style={{
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
              <div className="mb-5 p-3.5 rounded-2xl border bg-white" style={{ borderColor: "var(--cor-bege-escuro)" }}>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <label htmlFor="check-alarme-agenda" className="flex items-center gap-2 text-xs font-bold cursor-pointer" style={{ color: "var(--cor-texto)" }}>
                    <input
                      id="check-alarme-agenda"
                      type="checkbox"
                      checked={alarmeTemp}
                      onChange={(e) => setAlarmeTemp(e.target.checked)}
                      className="w-4 h-4 rounded cursor-pointer accent-[#8E3B46]"
                    />
                    <span>Despertar com melodia delicada no horário</span>
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
                  >
                    ▶ Ouvir som
                  </button>
                </div>

                {alarmeTemp && (
                  <div>
                    <span className="block text-[11px] font-semibold mb-1.5" style={{ color: "var(--cor-texto-suave)" }}>
                      Escolha a melodia suave:
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
                            somTemp === opcao.id ? "ring-2 ring-[#8E3B46]" : "hover:bg-slate-50"
                          }`}
                          style={{
                            backgroundColor: somTemp === opcao.id ? "var(--cor-rosa-suave)" : "#FFFFFF",
                            borderColor: somTemp === opcao.id ? "var(--cor-rosa-escuro)" : "var(--cor-bege-escuro)",
                            color: somTemp === opcao.id ? "var(--cor-rosa-escuro)" : "var(--cor-texto)",
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
              <div className="mb-6 p-3 rounded-xl border flex items-center gap-3 bg-white" style={{ borderColor: "var(--cor-bege-escuro)" }}>
                <input
                  id="check-replicar-agenda"
                  type="checkbox"
                  checked={replicarSemana}
                  onChange={(e) => setReplicarSemana(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer accent-[#8E3B46]"
                />
                <label
                  htmlFor="check-replicar-agenda"
                  className="text-xs font-medium cursor-pointer"
                  style={{ color: "var(--cor-texto)" }}
                >
                  Aplicar este compromisso e alarme de Segunda a Sexta
                </label>
              </div>

              {/* Botões de Ação */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => excluirCompromisso(itemEditando.id)}
                  className="py-3 px-4 rounded-full border text-xs font-bold cursor-pointer text-red-700 hover:bg-red-50"
                  style={{ borderColor: "#F2D2D5" }}
                >
                  Excluir
                </button>
                <button
                  type="button"
                  onClick={() => setItemEditando(null)}
                  className="flex-1 py-3 px-4 rounded-full border text-sm font-bold cursor-pointer hover:bg-slate-50 bg-white"
                  style={{ borderColor: "var(--cor-bege-escuro)", color: "var(--cor-texto)" }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={salvarCompromisso}
                  className="flex-1 py-3 px-4 rounded-full text-sm font-bold text-white cursor-pointer transition-colors shadow-sm"
                  style={{ backgroundColor: "var(--cor-rosa-escuro)" }}
                >
                  Salvar compromisso
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Alarme Disparado */}
        {alarmeDisparado && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="alarme-agenda-disparo"
          >
            <div
              className="w-full max-w-sm p-6 sm:p-7 rounded-3xl border shadow-2xl text-center relative bg-white"
              style={{ borderColor: "var(--cor-rosa)" }}
            >
              <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-4 border shadow-sm" style={{ backgroundColor: "var(--cor-rosa-suave)", borderColor: "var(--cor-rosa)", color: "var(--cor-rosa-escuro)" }}>
                <span className="text-4xl" aria-hidden="true">🔔</span>
              </div>

              <p className="text-xs uppercase font-bold tracking-wider mb-1" style={{ color: "var(--cor-salvia-escuro)" }}>
                Alerta da Agenda da Mãe
              </p>

              <h4 id="alarme-agenda-disparo" className="text-2xl font-bold mb-1" style={{ color: "var(--cor-texto)", fontFamily: "var(--fonte-titulo)" }}>
                Hora de {alarmeDisparado.titulo}!
              </h4>

              {alarmeDisparado.profissionalOuLocal && (
                <p className="text-xs font-semibold mb-2" style={{ color: "var(--cor-salvia-escuro)" }}>
                  📍 {alarmeDisparado.profissionalOuLocal}
                </p>
              )}

              <p className="text-sm mb-3" style={{ color: "var(--cor-texto-suave)" }}>
                Horário programado com carinho: <strong className="tabular-nums">{alarmeDisparado.hora}</strong>
              </p>

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
                      Lembretes do seguimento:
                    </span>
                    <span style={{ color: "var(--cor-texto-suave)" }}>
                      {alarmeDisparado.anotacao}
                    </span>
                  </div>
                </div>
              )}

              <div className="mb-4">
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
                  <span>▶ Tocar melodia suave</span>
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setAlarmeDisparado(null)}
                  className="w-full py-3 px-4 rounded-full text-sm font-bold text-white cursor-pointer shadow-sm"
                  style={{ backgroundColor: "var(--cor-rosa-escuro)" }}
                >
                  Entendido com carinho
                </button>

                <button
                  type="button"
                  onClick={() => adiarAlarme(5)}
                  className="w-full py-2.5 px-4 rounded-full border text-xs font-semibold cursor-pointer hover:bg-slate-50 bg-white"
                  style={{
                    borderColor: "var(--cor-bege-escuro)",
                    color: "var(--cor-texto-suave)",
                  }}
                >
                  Lembrar novamente em 5 minutos
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
