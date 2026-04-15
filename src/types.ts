export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export type GamePhase = 'start' | 'memorize' | 'tune' | 'result' | '_finishing' | 'final';

export interface GameState {
  round: number;
  scores: number[];
  target: HSL | null;
  phase: GamePhase;
}

export interface ScoreEntry {
  score: number;
  date: number;
}
