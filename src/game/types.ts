export type GameState = "title" | "playing" | "paused" | "victory";

export interface RoutineQuest {
  id: string;
  name: string;
  category: "manha" | "higiene" | "escola" | "brincar" | "sono";
  icon: string;
  description: string;
  color: string;
  position: [number, number, number];
  collected: boolean;
}

export interface SensorySettings {
  soundEnabled: boolean;
  gentleMode: boolean; // slower speed, zero sudden movements
  highContrast: boolean;
  freePlay: boolean; // free exploration without target pressure
}

export interface InactivityHintInfo {
  active: boolean;
  targetQuestId: string | null;
  targetQuestName: string | null;
  targetCategory: RoutineQuest["category"] | null;
  targetPosition: [number, number, number] | null;
}
