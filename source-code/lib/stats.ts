// Stats locales persistées (localStorage) équivalent de GameStats (UserDefaults).

const PREFIX = "vg_";

function read(key: string): number {
  if (typeof window === "undefined") return 0;
  const v = window.localStorage.getItem(PREFIX + key);
  return v ? parseInt(v, 10) || 0 : 0;
}

function write(key: string, value: number): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PREFIX + key, String(value));
}

export const Stats = {
  bestScore(key: string): number {
    return read(key);
  },
  /** Enregistre si meilleur. Renvoie true si nouveau record. */
  recordScore(score: number, key: string): boolean {
    if (score > read(key)) {
      write(key, score);
      return true;
    }
    return false;
  },
  get gamesPlayed(): number {
    return read("games_played");
  },
  incrementGames(): void {
    write("games_played", read("games_played") + 1);
  },
  get soloBest(): number {
    return read("best_general");
  },
  /** Dernier score enregistré pour une clé (boucle « encore une »). */
  lastScore(key: string): number {
    return read(key + "_last");
  },
  setLastScore(score: number, key: string): void {
    write(key + "_last", score);
  },
  getPlayerName(): string {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem(PREFIX + "player_name") ?? "";
  },
  setPlayerName(name: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(PREFIX + "player_name", name);
  },
};
