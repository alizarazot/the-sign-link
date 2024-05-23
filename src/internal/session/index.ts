import iconAccountCircle from "@material-symbols/svg-400/rounded/account_circle-fill.svg";

export interface Session {
  readonly nickname: string;
  readonly photo: string;

  getPoints(id: string): number;
  setPoints(id: string, points: number): void;
  listPoints(): { [id: string]: number };
}

export function currentSession(): Session {
  // TODO(alizarazot): Use Firebase here.
  return new LocalSession();
}

class LocalSession {
  nickname = "Invitado";
  photo = iconAccountCircle;

  private static readonly _key = "localGuestSession";

  constructor() {}

  listPoints(): { [id: string]: number } {
    return JSON.parse(localStorage.getItem(LocalSession._key) ?? "{}");
  }

  getPoints(id: string): number {
    return this.listPoints()[id] ?? 0;
  }

  setPoints(id: string, points: number): void {
    let data = this.listPoints();
    data[id] = points;
    localStorage.setItem(LocalSession._key, JSON.stringify(data));
  }
}
