export type ActivityKey = "grammar" | "reading";
export type DifficultyKey = number;
export type AnswerResult = "correct" | "wrong";

export interface QuizQuestion {
  id: number;
  statement: string;
  options: string[];
  correctOptionIndex: number;
  tip?: string | null;
}

export interface DifficultyOption {
  key: DifficultyKey;
  label: string;
  xp: number;
  containerClass: string;
  textClass: string;
  badgeClass: string;
}

export interface OptionStyle {
  containerClass: string;
  textClass: string;
  activeBorderClass: string;
  radioClass: string;
  dotClass: string;
}

export interface HelpAction {
  key: "hint" | "removeTwo" | "skipQuestion";
  title: string;
  icon: string;
  containerClass: string;
  iconClass: string;
  textClass: string;
}
