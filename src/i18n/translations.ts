import { en } from "./en";
import { fr } from "./fr";
import { pt } from "./pt";

interface Translation {
  [key: string]: {
    [key: string]: string;
  };
}

export const translations: Translation = {
  en,
  pt,
  fr,
};
