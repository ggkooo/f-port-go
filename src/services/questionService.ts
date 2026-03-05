import { AUTH_API_BASE_URL, AUTH_API_KEY, requestJson } from "./apiClient";

export type QuestionApiItem = {
  id: number;
  statement: string;
  alternative_a: string;
  alternative_b: string;
  alternative_c: string;
  alternative_d: string;
  correct_alternative: "a" | "b" | "c" | "d";
  tip: string | null;
  difficulty_id: number;
  class_id: number;
  activity_type_id: number;
  difficulty: {
    id: number;
    name: string;
  };
  school_class: {
    id: number;
    name: string;
  };
  activity_type: {
    id: number;
    name: string;
    slug: string;
  };
};

export type QuestionsResponse = {
  questions: QuestionApiItem[];
};

export type SingleQuestionResponse = {
  question: QuestionApiItem;
};

type GetQuestionsPayload = {
  class_id: string;
  difficulty_id: string;
  activity_type_id: string;
  quantity: string;
};

export type CreateQuestionPayload = {
  statement: string;
  alternative_a: string;
  alternative_b: string;
  alternative_c: string;
  alternative_d: string;
  correct_alternative: "a" | "b" | "c" | "d";
  tip: string;
  difficulty_id: string;
  class_id: string;
  activity_type_id: string;
};

export async function getQuestions(payload: GetQuestionsPayload): Promise<QuestionsResponse> {
  const query = new URLSearchParams({
    class_id: payload.class_id,
    difficulty_id: payload.difficulty_id,
    activity_type_id: payload.activity_type_id,
    quantity: payload.quantity,
  });

  const body = await requestJson<QuestionsResponse>(
    `${AUTH_API_BASE_URL}/questions?${query.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-API-KEY": AUTH_API_KEY,
      },
    },
    "Não foi possível carregar as questões.",
  );

  return body ?? { questions: [] };
}

export async function getAllQuestions(): Promise<QuestionsResponse> {
  const body = await requestJson<QuestionsResponse>(
    `${AUTH_API_BASE_URL}/questions`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-API-KEY": AUTH_API_KEY,
      },
    },
    "Não foi possível carregar as questões.",
  );

  return body ?? { questions: [] };
}

export async function getQuestionById(id: number): Promise<QuestionApiItem> {
  const body = await requestJson<SingleQuestionResponse>(
    `${AUTH_API_BASE_URL}/questions/${id}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-API-KEY": AUTH_API_KEY,
      },
    },
    "Não foi possível carregar a questão.",
  );

  if (!body || !body.question) {
    throw new Error("Questão não encontrada");
  }

  return body.question;
}

export async function createQuestion(payload: CreateQuestionPayload, token: string): Promise<void> {
  await requestJson<Record<string, unknown>>(
    `${AUTH_API_BASE_URL}/questions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-API-KEY": AUTH_API_KEY,
      },
      body: JSON.stringify(payload),
    },
    "Não foi possível cadastrar a questão.",
  );
}

export async function updateQuestion(
  id: number,
  payload: CreateQuestionPayload,
  token: string,
): Promise<void> {
  await requestJson<Record<string, unknown>>(
    `${AUTH_API_BASE_URL}/questions/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-API-KEY": AUTH_API_KEY,
      },
      body: JSON.stringify(payload),
    },
    "Não foi possível atualizar a questão.",
  );
}

export async function deleteQuestion(id: number, token: string): Promise<void> {
  await requestJson<Record<string, unknown>>(
    `${AUTH_API_BASE_URL}/questions/${id}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-API-KEY": AUTH_API_KEY,
      },
    },
    "Não foi possível deletar a questão.",
  );
}