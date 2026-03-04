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
  difficulty: {
    id: number;
    name: string;
  };
  school_class: {
    id: number;
    name: string;
  };
};

export type QuestionsResponse = {
  questions: QuestionApiItem[];
};

type GetQuestionsPayload = {
  class_id: string;
  difficulty_id: string;
  activity_type_id: string;
  quantity: string;
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