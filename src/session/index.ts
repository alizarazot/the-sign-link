import iconAccountCircle from "@material-symbols/svg-400/rounded/account_circle-fill.svg";

export interface Session {
  readonly nickname: string;
  readonly photo: string;

  getPoints(id: string): number;
  setPoints(id: string, points: number): void;
  listPoints(): { [id: string]: number };

  isMotivated(): boolean;
  setMotivated(): void;
}

export function currentSession(): Session {
  // TODO(alizarazot): Use Firebase here.
  return new LocalSession();
}

class LocalSession {
  nickname = "Invitado";
  photo = iconAccountCircle;

  private _data: {
    points?: { [id: string]: number };
    motivated?: boolean;
  };

  private static readonly _key = "localGuestSession";

  constructor() {
    this._data = JSON.parse(localStorage.getItem(LocalSession._key) ?? "{}");
  }

  private _save() {
    localStorage.setItem(LocalSession._key, JSON.stringify(this._data));
  }

  listPoints(): { [id: string]: number } {
    return this._data.points ?? {};
  }

  getPoints(id: string): number {
    return this.listPoints()[id] ?? 0;
  }

  setPoints(id: string, points: number): void {
    if (this._data.points == null) {
      this._data.points = {};
    }

    this._data.points[id] = points;
    this._save();
  }

  isMotivated(): boolean {
    return this._data.motivated ?? false;
  }

  setMotivated() {
    this._data.motivated = true;
    this._save();
  }
}
