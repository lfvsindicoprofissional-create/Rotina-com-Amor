import React, { useState, useEffect, useRef } from "react";
import { GameState, InactivityHintInfo, RoutineQuest, SensorySettings } from "./types";
import { ThreeCanvas } from "./ThreeCanvas";
import { sensoryAudio } from "./audio";

interface GameShellProps {
  onExitGame: () => void;
}

const INITIAL_QUESTS: RoutineQuest[] = [
  {
    id: "quest-manha",
    name: "Café da Manhã e Despertar",
    category: "manha",
    icon: "☀️",
    description: "Um despertar suave e café da manhã nutritivo para começar o dia com alegria.",
    color: "#ffb300",
    position: [0, 0, -10.5],
    collected: false,
  },
  {
    id: "quest-higiene",
    name: "Higiene e Escovar os Dentes",
    category: "higiene",
    icon: "🪥",
    description: "Cuidado com o corpinho, banho relaxante e dentes brilhando.",
    color: "#00bcd4",
    position: [10.0, 0, -3.2],
    collected: false,
  },
  {
    id: "quest-escola",
    name: "Escola e Atendimentos",
    category: "escola",
    icon: "🎒",
    description: "Momento de aprender, fono, terapias e novas descobertas no seu tempo.",
    color: "#ab47bc",
    position: [6.2, 0, 8.5],
    collected: false,
  },
  {
    id: "quest-brincar",
    name: "Brincar e Criar",
    category: "brincar",
    icon: "🎨",
    description: "Expressar a imaginação, blocos coloridos e diversão sem pressa.",
    color: "#4caf50",
    position: [-6.2, 0, 8.5],
    collected: false,
  },
  {
    id: "quest-sono",
    name: "Descanso e Soninho",
    category: "sono",
    icon: "🌙",
    description: "Luz suave, rotina de sono e uma noite acolhedora com lindos sonhos.",
    color: "#5c6bc0",
    position: [-10.0, 0, -3.2],
    collected: false,
  },
];

export const GameShell: React.FC<GameShellProps> = ({ onExitGame }) => {
  const [gameState, setGameState] = useState<GameState>("title");
  const [quests, setQuests] = useState<RoutineQuest[]>(INITIAL_QUESTS);
  const [nearCategory, setNearCategory] = useState<RoutineQuest["category"] | null>(null);
  const [settings, setSettings] = useState<SensorySettings>({
    soundEnabled: true,
    gentleMode: false,
    highContrast: false,
    freePlay: false,
  });

  // 10-second inactivity hint state & external click-to-move target
  const [hintInfo, setHintInfo] = useState<InactivityHintInfo>({
    active: false,
    targetQuestId: null,
    targetQuestName: null,
    targetCategory: null,
    targetPosition: null,
  });

  const [moveToTarget, setMoveToTarget] = useState<{
    x: number;
    z: number;
    timestamp: number;
  } | null>(null);

  // Touch virtual controls
  const [touchInput, setTouchInput] = useState<{ x: number; y: number; action: boolean }>({
    x: 0,
    y: 0,
    action: false,
  });

  const joystickOrigin = useRef<{ x: number; y: number } | null>(null);

  const collectedCount = quests.filter((q) => q.collected).length;
  const allCollected = collectedCount === quests.length;

  // Keyboard navigation for Game Shell (Space / Enter to Start, Esc to Pause)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (gameState === "playing") setGameState("paused");
        else if (gameState === "paused") setGameState("playing");
      }
      if (gameState === "title" && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        startGame();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameState]);

  // Audio mute sync
  useEffect(() => {
    sensoryAudio.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  const startGame = () => {
    setGameState("playing");
    sensoryAudio.playSoftClick();
  };

  const handleCollectQuest = (questId: string) => {
    setQuests((prev) => {
      const updated = prev.map((q) => (q.id === questId ? { ...q, collected: true } : q));
      const newlyAllDone = updated.every((q) => q.collected);
      if (newlyAllDone) {
        setTimeout(() => {
          setGameState("victory");
          sensoryAudio.playVictoryFanfare();
        }, 600);
      }
      return updated;
    });
  };

  const restartGame = () => {
    setQuests(INITIAL_QUESTS.map((q) => ({ ...q, collected: false })));
    setGameState("playing");
    sensoryAudio.playSoftClick();
  };

  const currentNearQuest = quests.find((q) => q.category === nearCategory);

  return (
    <div className="fixed inset-0 w-screen h-screen z-50 bg-[#f6ede2] text-[#2d2424] overflow-hidden select-none font-sans">
      {/* 3D WebGL Canvas Viewport */}
      <ThreeCanvas
        gameState={gameState}
        quests={quests}
        onCollectQuest={handleCollectQuest}
        onNearStation={setNearCategory}
        onHintChange={setHintInfo}
        moveToTarget={moveToTarget}
        settings={settings}
        touchInput={touchInput}
      />

      {/* 1. TITLE SCREEN OVERLAY */}
      {gameState === "title" && (
        <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-12 z-20 pointer-events-none">
          {/* Top Title Lockup with inline bespoke SVG */}
          <div className="max-w-xl pointer-events-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#e0cfbe] text-xs font-bold text-[#b85a73] mb-4 shadow-sm">
              <span>🌈</span>
              <span>Espaço Sensorial Acolhedor</span>
            </div>

            <div className="flex items-center gap-3">
              <svg
                viewBox="0 0 48 48"
                className="w-12 h-12 shrink-0 drop-shadow-sm text-[#d4728c]"
                fill="currentColor"
              >
                <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 6c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm-8 12c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm16 0c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm-8 16c-4.41 0-8-3.59-8-8h16c0 4.41-3.59 8-8 8z" />
              </svg>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#3b2d2f]">
                  Aventura da Rotina 3D
                </h1>
                <p className="text-sm sm:text-base text-[#6d5b54] font-medium">
                  Com Lino, o Ursinho do Carinho
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm sm:text-base text-[#5c4a45] leading-relaxed bg-white/85 p-4 rounded-2xl border border-[#e8d7c8] shadow-sm">
              Um ambiente 3D interativo, calmo e seguro para a criança explorar os 5 momentos
              principais da rotina diária no seu próprio ritmo, sem pressão ou sobrecarga sensorial.
            </p>
          </div>

          {/* Bottom Call to Action and Control Hint */}
          <div className="max-w-md pointer-events-auto">
            <button
              type="button"
              onClick={startGame}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-lg font-bold text-white shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-3"
              style={{ backgroundColor: "var(--cor-rosa-escuro, #d4728c)" }}
            >
              <span>Começar Aventura</span>
              <span className="text-xl">✨</span>
            </button>

            <div className="mt-3 text-xs sm:text-sm text-[#6d5b54] font-medium flex items-center gap-2">
              <span className="inline-block px-2 py-0.5 rounded bg-white/80 border border-[#e8d7c8] text-[11px] font-mono">
                Espaço / Enter
              </span>
              <span>para iniciar ou clique no botão</span>
            </div>

            <div className="mt-4 pt-3 border-t border-[#dfcebf]/60 flex items-center justify-between text-xs text-[#7d6860]">
              <span>WASD / Toque Move · Espaço Pula · Esc Pausa</span>
              <button
                type="button"
                onClick={onExitGame}
                className="font-bold underline hover:text-[#b85a73] cursor-pointer"
              >
                Voltar ao site
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. PLAYING LOW-OCCLUSION HUD (>=85% Unobstructed Playfield) */}
      {gameState === "playing" && (
        <div className="absolute inset-0 pointer-events-none p-4 sm:p-6 flex flex-col justify-between z-20">
          {/* Top Perimeter Status Cluster */}
          <div className="flex items-start justify-between gap-4">
            {/* Quest Progress Tracker */}
            <div className="pointer-events-auto bg-[#ffffff]/90 border border-[#e0cfbe] rounded-2xl p-3 shadow-md">
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-xs font-bold text-[#6d5b54] tracking-wide uppercase">
                  Rotinas Conquistadas
                </span>
                <span className="text-sm font-extrabold text-[#b85a73] tabular-nums">
                  {collectedCount} / {quests.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {quests.map((q) => {
                  const isHintTarget = hintInfo.active && hintInfo.targetQuestId === q.id;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => {
                        if (!q.collected) {
                          setMoveToTarget({
                            x: q.position[0],
                            z: q.position[2],
                            timestamp: Date.now(),
                          });
                          sensoryAudio.playSoftClick();
                        }
                      }}
                      title={
                        isHintTarget
                          ? `💡 Dica: Estação ${q.name}! Clique para caminhar até lá`
                          : q.name
                      }
                      className={`relative w-9 h-9 rounded-xl flex items-center justify-center text-lg border transition-all cursor-pointer ${
                        q.collected
                          ? "bg-[#ffeb3b]/30 border-[#ffc107] scale-105 shadow-xs"
                          : isHintTarget
                          ? "bg-amber-100 border-[#ffc107] ring-4 ring-amber-300 ring-offset-2 scale-110 shadow-md animate-pulse"
                          : "bg-white border-[#e0cfbe] opacity-50 grayscale hover:opacity-80"
                      }`}
                    >
                      <span>{q.icon}</span>
                      {isHintTarget && (
                        <span className="absolute -top-1.5 -right-1.5 text-xs animate-bounce">
                          ✨
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Action Dock: Pause, Sound, Exit */}
            <div className="pointer-events-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }))
                }
                title={settings.soundEnabled ? "Silenciar sons" : "Ativar sons"}
                className="w-10 h-10 rounded-xl bg-white/90 border border-[#e0cfbe] flex items-center justify-center text-base shadow-sm hover:bg-white cursor-pointer"
              >
                {settings.soundEnabled ? "🔊" : "🔇"}
              </button>
              <button
                type="button"
                onClick={() =>
                  setSettings((s) => ({ ...s, gentleMode: !s.gentleMode }))
                }
                title={settings.gentleMode ? "Velocidade normal" : "Modo super calmo"}
                className={`px-3 h-10 rounded-xl border flex items-center gap-1.5 text-xs font-bold shadow-sm cursor-pointer ${
                  settings.gentleMode
                    ? "bg-[#e8f5e9] border-[#81c784] text-[#2e7d32]"
                    : "bg-white/90 border-[#e0cfbe] text-[#6d5b54]"
                }`}
              >
                <span>🍃</span>
                <span className="hidden sm:inline">Modo Calmo</span>
              </button>
              <button
                type="button"
                onClick={() => setGameState("paused")}
                className="px-3 h-10 rounded-xl bg-white/90 border border-[#e0cfbe] flex items-center gap-1.5 text-xs font-bold text-[#6d5b54] shadow-sm hover:bg-white cursor-pointer"
              >
                <span>⏸️</span>
                <span className="hidden sm:inline">Pausar</span>
              </button>
              <button
                type="button"
                onClick={onExitGame}
                className="px-3 h-10 rounded-xl bg-white/90 border border-[#e0cfbe] flex items-center gap-1 text-xs font-bold text-[#b85a73] shadow-sm hover:bg-white cursor-pointer"
              >
                <span>✕</span>
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>

          {/* Gentle Inactivity Visual Hint Card (glows softly after 10s of child inactivity) */}
          {hintInfo.active && hintInfo.targetQuestName && !currentNearQuest && (
            <div className="self-center pointer-events-auto max-w-md w-full bg-gradient-to-r from-[#fffde7]/95 via-[#fff8e1]/95 to-[#fff3e0]/95 border-2 border-[#ffb300] rounded-2xl p-4 shadow-xl text-center animate-fade-in transition-all">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <span className="text-2xl animate-bounce">💡</span>
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#b85a73] bg-white/90 px-3 py-0.5 rounded-full border border-[#ffe082] shadow-xs">
                  Dica de Rotina (Lino te ajuda!)
                </span>
                <span className="text-2xl animate-pulse">✨</span>
              </div>
              <h3 className="text-base font-bold text-[#3b2d2f]">
                Próxima estação:{" "}
                <span className="text-[#b85a73]">{hintInfo.targetQuestName}</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#6d5b54] mt-1">
                Ela está brilhando suavemente no jardim! Clique nela ou no botão abaixo para o Lino caminhar até lá com você.
              </p>
              <div className="mt-3 flex items-center justify-center gap-2.5">
                {hintInfo.targetPosition && (
                  <button
                    type="button"
                    onClick={() => {
                      if (hintInfo.targetPosition) {
                        setMoveToTarget({
                          x: hintInfo.targetPosition[0],
                          z: hintInfo.targetPosition[2],
                          timestamp: Date.now(),
                        });
                        sensoryAudio.playSoftClick();
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-[#b85a73] hover:bg-[#a04860] active:scale-95 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Caminhar até lá</span>
                    <span>🐾</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setHintInfo((h) => ({ ...h, active: false }));
                    sensoryAudio.playSoftClick();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white/90 hover:bg-white text-[#6d5b54] border border-[#e0cfbe] font-bold text-xs transition-all cursor-pointer"
                >
                  Entendi 👍
                </button>
              </div>
            </div>
          )}

          {/* Near Station Gentle Guidance Toast */}
          {currentNearQuest && (
            <div className="self-center pointer-events-auto max-w-md w-full bg-white/95 border-2 border-[#d4728c] rounded-2xl p-4 shadow-xl text-center animate-fade-in">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-2xl">{currentNearQuest.icon}</span>
                <h3 className="text-base font-bold text-[#3b2d2f]">
                  {currentNearQuest.name}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#6d5b54]">
                {currentNearQuest.description}
              </p>
              <div className="mt-2 text-[11px] font-bold text-[#d4728c]">
                {currentNearQuest.collected
                  ? "✓ Estrela desta rotina já conquistada!"
                  : "✨ Aproxime-se para coletar a estrela da rotina!"}
              </div>
            </div>
          )}

          {/* Bottom On-Screen Touch Controls (shown on touch/mobile or for accessibility) */}
          <div className="flex items-end justify-between w-full pointer-events-none pb-2">
            {/* Virtual D-Pad / Movement Direction Buttons */}
            <div className="pointer-events-auto grid grid-cols-3 gap-1.5 w-36 h-36 bg-white/80 p-2 rounded-3xl border border-[#e0cfbe] shadow-lg">
              <div />
              <button
                type="button"
                onPointerDown={() => {
                  setHintInfo((h) => ({ ...h, active: false }));
                  setTouchInput((t) => ({ ...t, y: -1 }));
                }}
                onPointerUp={() => setTouchInput((t) => ({ ...t, y: 0 }))}
                className="rounded-xl bg-[#fdf5eb] border border-[#e0cfbe] active:bg-[#d4728c] active:text-white flex items-center justify-center font-bold text-lg cursor-pointer"
              >
                ▲
              </button>
              <div />
              <button
                type="button"
                onPointerDown={() => {
                  setHintInfo((h) => ({ ...h, active: false }));
                  setTouchInput((t) => ({ ...t, x: -1 }));
                }}
                onPointerUp={() => setTouchInput((t) => ({ ...t, x: 0 }))}
                className="rounded-xl bg-[#fdf5eb] border border-[#e0cfbe] active:bg-[#d4728c] active:text-white flex items-center justify-center font-bold text-lg cursor-pointer"
              >
                ◀
              </button>
              <div className="flex items-center justify-center text-xs opacity-50">
                🐾
              </div>
              <button
                type="button"
                onPointerDown={() => {
                  setHintInfo((h) => ({ ...h, active: false }));
                  setTouchInput((t) => ({ ...t, x: 1 }));
                }}
                onPointerUp={() => setTouchInput((t) => ({ ...t, x: 0 }))}
                className="rounded-xl bg-[#fdf5eb] border border-[#e0cfbe] active:bg-[#d4728c] active:text-white flex items-center justify-center font-bold text-lg cursor-pointer"
              >
                ▶
              </button>
              <div />
              <button
                type="button"
                onPointerDown={() => {
                  setHintInfo((h) => ({ ...h, active: false }));
                  setTouchInput((t) => ({ ...t, y: 1 }));
                }}
                onPointerUp={() => setTouchInput((t) => ({ ...t, y: 0 }))}
                className="rounded-xl bg-[#fdf5eb] border border-[#e0cfbe] active:bg-[#d4728c] active:text-white flex items-center justify-center font-bold text-lg cursor-pointer"
              >
                ▼
              </button>
              <div />
            </div>

            {/* Jump / Bounce Button */}
            <div className="pointer-events-auto">
              <button
                type="button"
                onPointerDown={() => {
                  setHintInfo((h) => ({ ...h, active: false }));
                  setTouchInput((t) => ({ ...t, action: true }));
                }}
                onPointerUp={() => setTouchInput((t) => ({ ...t, action: false }))}
                className="w-20 h-20 rounded-3xl bg-[#b85a73] text-white active:bg-[#96455b] flex flex-col items-center justify-center font-bold text-xs shadow-xl active:scale-95 transition-transform cursor-pointer border-2 border-white/60"
              >
                <span className="text-2xl mb-0.5">🍄</span>
                <span>Pular</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. PAUSE MODAL */}
      {gameState === "paused" && (
        <div className="absolute inset-0 bg-black/40 z-30 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#e0cfbe] text-center">
            <span className="text-4xl mb-2 inline-block">🌸</span>
            <h2 className="text-2xl font-bold text-[#3b2d2f]">Jogo Pausado</h2>
            <p className="text-sm text-[#6d5b54] mt-1 mb-6">
              Respire fundo. O jogo espera pelo tempo da sua criança.
            </p>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setGameState("playing")}
                className="w-full py-3.5 rounded-2xl text-base font-bold text-white shadow-md cursor-pointer hover:opacity-95"
                style={{ backgroundColor: "var(--cor-rosa-escuro, #d4728c)" }}
              >
                Continuar Brincando ▶
              </button>
              <button
                type="button"
                onClick={restartGame}
                className="w-full py-3 rounded-2xl text-sm font-bold text-[#6d5b54] bg-[#fdf5eb] border border-[#e0cfbe] cursor-pointer hover:bg-black/5"
              >
                Recomeçar Exploração 🔄
              </button>
              <button
                type="button"
                onClick={onExitGame}
                className="w-full py-3 rounded-2xl text-sm font-bold text-[#b85a73] hover:underline cursor-pointer"
              >
                Sair para o Site
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. VICTORY / CONQUISTAS MODAL */}
      {gameState === "victory" && (
        <div className="absolute inset-0 bg-black/45 z-30 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-[#ffeb3b] text-center">
            <div className="w-16 h-16 rounded-full bg-[#ffeb3b]/30 border-2 border-[#ffc107] flex items-center justify-center text-3xl mx-auto mb-3 shadow-sm">
              🏆
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3b2d2f]">
              Parabéns! Dia Concluído!
            </h2>
            <p className="text-sm sm:text-base text-[#6d5b54] mt-2 mb-6">
              Você ajudou o Lino a passar por todas as etapas da rotina com muito carinho,
              autonomia e respeito ao tempo!
            </p>

            {/* Collected badges */}
            <div className="grid grid-cols-5 gap-2 mb-6 p-4 rounded-2xl bg-[#fdf5eb] border border-[#e0cfbe]">
              {quests.map((q) => (
                <div key={q.id} className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-2xl bg-white border border-[#ffc107] flex items-center justify-center text-xl shadow-xs">
                    {q.icon}
                  </div>
                  <span className="text-[10px] font-bold text-[#6d5b54] mt-1 line-clamp-1">
                    {q.name.split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={restartGame}
                className="flex-1 py-3.5 rounded-2xl text-base font-bold text-white shadow-md cursor-pointer hover:opacity-95"
                style={{ backgroundColor: "var(--cor-rosa-escuro, #d4728c)" }}
              >
                Brincar Novamente 🌟
              </button>
              <button
                type="button"
                onClick={onExitGame}
                className="py-3.5 px-6 rounded-2xl text-sm font-bold text-[#6d5b54] bg-[#fdf5eb] border border-[#e0cfbe] cursor-pointer hover:bg-black/5"
              >
                Voltar ao Site
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
