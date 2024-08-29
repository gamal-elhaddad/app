import { FormEvent } from "react";

export interface registerType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

export interface loginType {
  title?: string | any
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

export interface signInType {
  title?: string;
}
