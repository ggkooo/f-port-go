import type { ActivityKey, DifficultyOption, HelpAction, OptionStyle } from "./types";

interface LegacyQuizQuestion {
  id: number;
  statement: string;
  options: string[];
  correctOptionIndex: number;
}

export const ACTIVITY_LABELS: Record<ActivityKey, string> = {
  grammar: "Gramática",
  reading: "Interpretação Textual",
};

export const GRADE_OPTIONS = ["6º Ano", "7º Ano", "8º Ano", "9º Ano", "1º Ano EM", "2º Ano EM", "3º Ano EM"];
export const RECOMMENDED_GRADE = "3º Ano EM";

const DIFFICULTY_META_BY_NAME: Record<string, Omit<DifficultyOption, "key" | "label">> = {
  "fácil": {
    xp: 15,
    containerClass: "bg-[#D4EAFC] dark:bg-blue-900/30",
    textClass: "text-blue-900 dark:text-blue-100",
    badgeClass: "text-blue-700 dark:text-blue-200",
  },
  "médio": {
    xp: 25,
    containerClass: "bg-[#FDE68A] dark:bg-amber-900/30",
    textClass: "text-amber-900 dark:text-amber-100",
    badgeClass: "text-amber-700 dark:text-amber-200",
  },
  "difícil": {
    xp: 40,
    containerClass: "bg-[#A3E4A1]/60 dark:bg-emerald-900/30",
    textClass: "text-emerald-900 dark:text-emerald-100",
    badgeClass: "text-emerald-700 dark:text-emerald-200",
  },
};

const DEFAULT_DIFFICULTY_META: Omit<DifficultyOption, "key" | "label"> = {
  xp: 25,
  containerClass: "bg-neutral-100 dark:bg-neutral-700",
  textClass: "text-neutral-900 dark:text-neutral-100",
  badgeClass: "text-neutral-700 dark:text-neutral-200",
};

function normalizeDifficultyName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const XP_BY_DIFFICULTY_NAME: Record<string, number> = {
  facil: 15,
  easy: 15,
  medio: 25,
  medium: 25,
  dificil: 40,
  hard: 40,
};

const XP_BY_DIFFICULTY_ID: Record<number, number> = {
  1: 15,
  2: 25,
  3: 40,
};

export function getDifficultyMeta(name: string): Omit<DifficultyOption, "key" | "label"> {
  return DIFFICULTY_META_BY_NAME[name.trim().toLowerCase()] ?? DEFAULT_DIFFICULTY_META;
}

export function resolveDifficultyXp(difficultyId: number, difficultyName: string): number {
  const xpById = XP_BY_DIFFICULTY_ID[difficultyId];
  if (typeof xpById === "number") {
    return xpById;
  }

  const normalizedName = normalizeDifficultyName(difficultyName);
  const xpByName = XP_BY_DIFFICULTY_NAME[normalizedName];

  return typeof xpByName === "number" ? xpByName : DEFAULT_DIFFICULTY_META.xp;
}

export const QUIZ_BY_ACTIVITY: Record<ActivityKey, LegacyQuizQuestion[]> = {
  grammar: [
    { id: 1, statement: 'No período "O menino correu para casa", a palavra "correu" é um:', options: ["Verbo", "Substantivo", "Adjetivo", "Pronome"], correctOptionIndex: 0 },
    { id: 2, statement: 'Na frase "Ela estava muito feliz", a palavra "feliz" é classificada como:', options: ["Verbo", "Adjetivo", "Advérbio", "Artigo"], correctOptionIndex: 1 },
    { id: 3, statement: "Qual alternativa contém um pronome pessoal do caso reto?", options: ["me", "te", "eu", "lhe"], correctOptionIndex: 2 },
    { id: 4, statement: "Em qual opção há um substantivo próprio?", options: ["cidade", "escola", "Brasil", "carro"], correctOptionIndex: 2 },
    { id: 5, statement: 'A palavra "rapidamente" pertence à classe dos:', options: ["Advérbios", "Substantivos", "Verbos", "Pronomes"], correctOptionIndex: 0 },
    { id: 6, statement: "Em qual alternativa o artigo está corretamente identificado?", options: ["caderno (artigo)", "o (artigo)", "escrever (artigo)", "rápido (artigo)"], correctOptionIndex: 1 },
    { id: 7, statement: "Na frase 'Nós estudamos ontem', a palavra 'ontem' indica:", options: ["Pessoa", "Lugar", "Tempo", "Modo"], correctOptionIndex: 2 },
    { id: 8, statement: "Qual palavra é um verbo no infinitivo?", options: ["cantou", "cantará", "cantar", "cantando"], correctOptionIndex: 2 },
    { id: 9, statement: "Em 'A menina inteligente venceu', 'inteligente' é:", options: ["Substantivo", "Adjetivo", "Pronome", "Advérbio"], correctOptionIndex: 1 },
    { id: 10, statement: "Qual alternativa apresenta apenas pronomes?", options: ["eu, tu, nós", "casa, escola, livro", "bom, ruim, alto", "andar, correr, pular"], correctOptionIndex: 0 },
  ],
  reading: [
    { id: 1, statement: "Ao ler um texto narrativo, identificar o conflito principal ajuda a entender:", options: ["A fonte usada no título", "O problema central da história", "A quantidade de parágrafos", "A pontuação do autor"], correctOptionIndex: 1 },
    { id: 2, statement: "Quando o autor diz algo sem afirmar diretamente, ele está trabalhando com:", options: ["Informação explícita", "Inferência", "Ortografia", "Rima"], correctOptionIndex: 1 },
    { id: 3, statement: "A ideia principal de um parágrafo costuma ser identificada por:", options: ["Detalhes secundários", "Exemplos isolados", "Mensagem central defendida", "Quantidade de linhas"], correctOptionIndex: 2 },
    { id: 4, statement: "Ler o título e subtítulo antes do texto ajuda principalmente a:", options: ["Decorar o conteúdo", "Antecipar o tema", "Corrigir gramática", "Ignorar contexto"], correctOptionIndex: 1 },
    { id: 5, statement: 'Palavras como "portanto" e "porém" são importantes porque:', options: ["Decoram o texto", "Mudam o tamanho da frase", "Indicam relações de sentido", "Substituem o título"], correctOptionIndex: 2 },
    { id: 6, statement: "Ao identificar a opinião do autor, o leitor está focando em:", options: ["Ponto de vista", "Número de sílabas", "Margem do texto", "Tipo de papel"], correctOptionIndex: 0 },
    { id: 7, statement: "Uma conclusão bem construída normalmente:", options: ["Introduz tema aleatório", "Retoma as ideias principais", "Ignora os argumentos", "Apaga a tese"], correctOptionIndex: 1 },
    { id: 8, statement: "Palavras desconhecidas podem ser compreendidas melhor por meio de:", options: ["Contexto da frase", "Cor da capa", "Tamanho da fonte", "Quantidade de páginas"], correctOptionIndex: 0 },
    { id: 9, statement: "Comparar dois textos sobre o mesmo tema ajuda a perceber:", options: ["Somente erros ortográficos", "Diferenças de abordagem", "Apenas o título", "Só o autor"], correctOptionIndex: 1 },
    { id: 10, statement: "A leitura crítica de um texto exige principalmente:", options: ["Aceitar tudo sem questionar", "Relacionar ideias e avaliar argumentos", "Ler apenas o início", "Memorizar frases"], correctOptionIndex: 1 },
  ],
};

export const OPTION_STYLE_BY_INDEX: OptionStyle[] = [
  {
    containerClass: "bg-[#D4EAFC] dark:bg-blue-900/30",
    textClass: "text-blue-900 dark:text-blue-100",
    activeBorderClass: "border-blue-500",
    radioClass: "border-blue-500",
    dotClass: "bg-blue-500",
  },
  {
    containerClass: "bg-[#A3E4A1]/60 dark:bg-emerald-900/30",
    textClass: "text-emerald-900 dark:text-emerald-100",
    activeBorderClass: "border-emerald-500",
    radioClass: "border-emerald-500",
    dotClass: "bg-emerald-500",
  },
  {
    containerClass: "bg-[#FDE68A] dark:bg-amber-900/30",
    textClass: "text-amber-900 dark:text-amber-100",
    activeBorderClass: "border-amber-500",
    radioClass: "border-amber-500",
    dotClass: "bg-amber-500",
  },
  {
    containerClass: "bg-neutral-100 dark:bg-neutral-700",
    textClass: "text-neutral-900 dark:text-neutral-100",
    activeBorderClass: "border-neutral-500",
    radioClass: "border-neutral-500",
    dotClass: "bg-neutral-700 dark:bg-neutral-200",
  },
];

export const HELP_ACTIONS: HelpAction[] = [
  {
    key: "hint",
    title: "DICA",
    icon: "lightbulb",
    containerClass: "bg-[#D4EAFC] dark:bg-blue-900/30",
    iconClass: "text-blue-600 dark:text-blue-200",
    textClass: "text-blue-900 dark:text-blue-100",
  },
  {
    key: "removeTwo",
    title: "REMOVER 2 ALTERNATIVAS",
    icon: "filter_2",
    containerClass: "bg-[#FDE68A] dark:bg-amber-900/30",
    iconClass: "text-amber-600 dark:text-amber-200",
    textClass: "text-amber-900 dark:text-amber-100",
  },
  {
    key: "skipQuestion",
    title: "PULAR QUESTÃO",
    icon: "double_arrow",
    containerClass: "bg-[#A3E4A1]/70 dark:bg-emerald-900/30",
    iconClass: "text-emerald-600 dark:text-emerald-200",
    textClass: "text-emerald-900 dark:text-emerald-100",
  },
];
