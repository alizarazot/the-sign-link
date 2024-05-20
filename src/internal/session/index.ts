import iconAccountCircle from "@material-symbols/svg-400/rounded/account_circle-fill.svg";

export interface Session {
  readonly nickname: string;
  readonly photo: string;
}

export function currentSession(): Session {
  // TODO(alizarazot): Use Firebase here.
  return {
    nickname: "Invitado",
    photo: iconAccountCircle,
  };
}
