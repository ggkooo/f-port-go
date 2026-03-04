import { useEffect, useMemo, useState } from "react";
import {
  getActivityTypes,
  getClasses,
  getDifficulties,
  type ActivityTypeOption,
  type ClassOption,
  type DifficultyOption,
} from "../../../services/catalogService";
import {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  type QuestionApiItem,
} from "../../../services/questionService";
import { getSession } from "../../../services/session";

const QUESTIONS_PER_PAGE = 5;

export function AdministrationQuestionsContent() {
  const [formValues, setFormValues] = useState({
    statement: "",
    alternative_a: "",
    alternative_b: "",
    alternative_c: "",
    alternative_d: "",
    correct_alternative: "" as "" | "a" | "b" | "c" | "d",
    tip: "",
    difficulty_id: "",
    class_id: "",
    activity_type_id: "",
  });
  const [activityTypes, setActivityTypes] = useState<ActivityTypeOption[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [difficulties, setDifficulties] = useState<DifficultyOption[]>([]);
  const [questions, setQuestions] = useState<QuestionApiItem[]>([]);
  const [questionsError, setQuestionsError] = useState<string | null>(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [loadingActivityTypes, setLoadingActivityTypes] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingDifficulties, setLoadingDifficulties] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [loadingEditingQuestion, setLoadingEditingQuestion] = useState(false);
  const [deletingQuestionId, setDeletingQuestionId] = useState<number | null>(null);

  useEffect(() => {
    const fetchActivityTypes = async () => {
      setLoadingActivityTypes(true);

      try {
        const response = await getActivityTypes();
        setActivityTypes(response.activity_types);
      } catch {
        setActivityTypes([]);
      } finally {
        setLoadingActivityTypes(false);
      }
    };

    fetchActivityTypes();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoadingClasses(true);

      try {
        const response = await getClasses();
        setClasses(response.classes);
      } catch {
        setClasses([]);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchDifficulties = async () => {
      setLoadingDifficulties(true);

      try {
        const response = await getDifficulties();
        setDifficulties(response.difficulties);
      } catch {
        setDifficulties([]);
      } finally {
        setLoadingDifficulties(false);
      }
    };

    fetchDifficulties();
  }, []);

  const fetchQuestions = async () => {
    setLoadingQuestions(true);
    setQuestionsError(null);

    try {
      const response = await getAllQuestions();
      setQuestions(response.questions);
    } catch (error) {
      setQuestions([]);
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível carregar as questões.";
      setQuestionsError(message);
    } finally {
      setLoadingQuestions(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleInputChange = (field: keyof typeof formValues, value: string) => {
    setFormValues((previousValues) => ({
      ...previousValues,
      [field]: value,
    }));
  };

  const handleLoadQuestionForEditing = async (questionId: number) => {
    setLoadingEditingQuestion(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const question = await getQuestionById(questionId);
      
      setFormValues({
        statement: question.statement,
        alternative_a: question.alternative_a,
        alternative_b: question.alternative_b,
        alternative_c: question.alternative_c,
        alternative_d: question.alternative_d,
        correct_alternative: question.correct_alternative,
        tip: question.tip || "",
        difficulty_id: String(question.difficulty_id),
        class_id: String(question.class_id),
        activity_type_id: String(question.activity_type_id),
      });

      setEditingQuestionId(questionId);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível carregar a questão.";
      setSubmitError(message);
    } finally {
      setLoadingEditingQuestion(false);
    }
  };

  const handleCancelEditing = () => {
    setEditingQuestionId(null);
    setFormValues({
      statement: "",
      alternative_a: "",
      alternative_b: "",
      alternative_c: "",
      alternative_d: "",
      correct_alternative: "",
      tip: "",
      difficulty_id: "",
      class_id: "",
      activity_type_id: "",
    });
  };

  const handleSaveQuestion = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSubmitting(true);

    try {
      const session = getSession();

      if (!session) {
        setSubmitError("Sessão inválida para salvar questão.");
        return;
      }

      if (!formValues.correct_alternative) {
        setSubmitError("Selecione a alternativa correta.");
        return;
      }

      const payload = {
        statement: formValues.statement.trim(),
        alternative_a: formValues.alternative_a.trim(),
        alternative_b: formValues.alternative_b.trim(),
        alternative_c: formValues.alternative_c.trim(),
        alternative_d: formValues.alternative_d.trim(),
        correct_alternative: formValues.correct_alternative,
        tip: formValues.tip.trim(),
        difficulty_id: formValues.difficulty_id,
        class_id: formValues.class_id,
        activity_type_id: formValues.activity_type_id,
      };

      if (editingQuestionId) {
        await updateQuestion(editingQuestionId, payload, session.token);
        setSubmitSuccess("Questão atualizada com sucesso.");
      } else {
        await createQuestion(payload, session.token);
        setSubmitSuccess("Questão cadastrada com sucesso.");
      }

      setFormValues({
        statement: "",
        alternative_a: "",
        alternative_b: "",
        alternative_c: "",
        alternative_d: "",
        correct_alternative: "",
        tip: "",
        difficulty_id: "",
        class_id: "",
        activity_type_id: "",
      });
      setEditingQuestionId(null);
      await fetchQuestions();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a questão.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    if (!window.confirm("Tem certeza que deseja deletar esta questão?")) {
      return;
    }

    setDeletingQuestionId(questionId);
    setSubmitError(null);

    try {
      const session = getSession();

      if (!session) {
        setSubmitError("Sessão inválida para deletar questão.");
        return;
      }

      await deleteQuestion(questionId, session.token);
      setSubmitSuccess("Questão deletada com sucesso.");
      await fetchQuestions();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível deletar a questão.";
      setSubmitError(message);
    } finally {
      setDeletingQuestionId(null);
    }
  };

  const filteredQuestions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return questions;
    }

    return questions.filter((question) =>
      question.statement.toLowerCase().includes(normalizedSearch),
    );
  }, [questions, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE));

  const paginatedQuestions = useMemo(() => {
    const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
    return filteredQuestions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
  }, [currentPage, filteredQuestions]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <main className="flex-1 min-h-0 p-4 pb-24 md:p-6 md:pb-6 lg:p-8 lg:pb-8 overflow-y-auto">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white mb-4 leading-tight">
          Questões
        </h1>

        <div className="bg-white dark:bg-neutral-800 p-5 md:p-6 rounded-large shadow-sm border border-neutral-100 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D4EAFC] dark:bg-blue-900/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-700 dark:text-blue-200">quiz</span>
            </div>
            <p className="text-neutral-500 dark:text-neutral-300 text-sm md:text-base">
              Cadastre novas questões e mantenha o banco de atividades atualizado.
            </p>
          </div>
        </div>
      </header>

      <section className="bg-white dark:bg-neutral-800 rounded-large shadow-sm border border-neutral-100 dark:border-neutral-700 p-4 md:p-6">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSaveQuestion}>
          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Enunciado</span>
            <textarea
              rows={4}
              value={formValues.statement}
              onChange={(event) => handleInputChange("statement", event.target.value)}
              placeholder="Digite o enunciado da questão..."
              required
              className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Alternativa A</span>
            <input
              type="text"
              value={formValues.alternative_a}
              onChange={(event) => handleInputChange("alternative_a", event.target.value)}
              placeholder="Digite a alternativa A"
              required
              className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Alternativa B</span>
            <input
              type="text"
              value={formValues.alternative_b}
              onChange={(event) => handleInputChange("alternative_b", event.target.value)}
              placeholder="Digite a alternativa B"
              required
              className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Alternativa C</span>
            <input
              type="text"
              value={formValues.alternative_c}
              onChange={(event) => handleInputChange("alternative_c", event.target.value)}
              placeholder="Digite a alternativa C"
              required
              className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Alternativa D</span>
            <input
              type="text"
              value={formValues.alternative_d}
              onChange={(event) => handleInputChange("alternative_d", event.target.value)}
              placeholder="Digite a alternativa D"
              required
              className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Turma</span>
            <select
              value={formValues.class_id}
              onChange={(event) => handleInputChange("class_id", event.target.value)}
              required
              className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">{loadingClasses ? "Carregando turmas..." : "Selecione a turma"}</option>
              {classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Dificuldade</span>
            <select
              value={formValues.difficulty_id}
              onChange={(event) => handleInputChange("difficulty_id", event.target.value)}
              required
              className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">{loadingDifficulties ? "Carregando dificuldades..." : "Selecione a dificuldade"}</option>
              {difficulties.map((difficulty) => (
                <option key={difficulty.id} value={difficulty.id}>
                  {difficulty.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Tipo de atividade</span>
            <select
              value={formValues.activity_type_id}
              onChange={(event) => handleInputChange("activity_type_id", event.target.value)}
              required
              className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">{loadingActivityTypes ? "Carregando tipos de atividade..." : "Selecione o tipo de atividade"}</option>
              {activityTypes.map((activityType) => (
                <option key={activityType.id} value={activityType.id}>
                  {activityType.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Alternativa correta</span>
            <select
              value={formValues.correct_alternative}
              onChange={(event) => handleInputChange("correct_alternative", event.target.value)}
              required
              className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Selecione</option>
              <option value="a">A</option>
              <option value="b">B</option>
              <option value="c">C</option>
              <option value="d">D</option>
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Dica *</span>
            <input
              type="text"
              value={formValues.tip}
              onChange={(event) => handleInputChange("tip", event.target.value)}
              placeholder="Ex.: revise regra de três simples"
              required
              className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </label>

          {submitError && (
            <p className="md:col-span-2 text-sm text-red-600 dark:text-red-300 font-semibold">{submitError}</p>
          )}

          {submitSuccess && (
            <p className="md:col-span-2 text-sm text-emerald-600 dark:text-emerald-300 font-semibold">{submitSuccess}</p>
          )}

          <div className="md:col-span-2 flex gap-3 justify-end">
            {editingQuestionId && (
              <button
                type="button"
                onClick={handleCancelEditing}
                disabled={isSubmitting || loadingEditingQuestion}
                className="px-5 py-3 rounded-full bg-neutral-300 dark:bg-neutral-600 text-neutral-900 dark:text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting || loadingEditingQuestion}
              className="px-5 py-3 rounded-full bg-neutral-900 dark:bg-blue-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Salvando..." : editingQuestionId ? "Editar questão" : "Salvar questão"}
            </button>
          </div>
        </form>
      </section>

      <section className="bg-white dark:bg-neutral-800 rounded-large shadow-sm border border-neutral-100 dark:border-neutral-700 p-4 md:p-6 mt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#D4EAFC] dark:bg-blue-900/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-700 dark:text-blue-200">format_list_bulleted</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white">Questões cadastradas</h2>
        </div>

        <div className="mb-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Buscar por enunciado</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Digite parte do enunciado para filtrar..."
              className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-2">ID</th>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-2">Enunciado</th>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-2">Turma</th>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-2">Dificuldade</th>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-2">Correta</th>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-2">Ações</th>
              </tr>
            </thead>

            <tbody>
              {loadingQuestions && (
                <tr className="bg-neutral-100 dark:bg-neutral-700">
                  <td colSpan={6} className="px-4 py-4 rounded-2xl text-sm text-neutral-600 dark:text-neutral-200">
                    Carregando questões...
                  </td>
                </tr>
              )}

              {questionsError && !loadingQuestions && (
                <tr className="bg-red-50 dark:bg-red-900/20">
                  <td colSpan={6} className="px-4 py-4 rounded-2xl text-sm text-red-700 dark:text-red-200">
                    {questionsError}
                  </td>
                </tr>
              )}

              {!loadingQuestions && !questionsError && paginatedQuestions.length === 0 && (
                <tr className="bg-neutral-100 dark:bg-neutral-700">
                  <td colSpan={6} className="px-4 py-4 rounded-2xl text-sm text-neutral-600 dark:text-neutral-200">
                    Nenhuma questão encontrada para o filtro informado.
                  </td>
                </tr>
              )}

              {!loadingQuestions && !questionsError && paginatedQuestions.map((question) => (
                <tr key={question.id} className="bg-neutral-100 dark:bg-neutral-700">
                  <td className="px-4 py-3 rounded-l-2xl font-bold text-neutral-900 dark:text-white">#{question.id}</td>
                  <td className="px-4 py-3 text-neutral-800 dark:text-neutral-100 max-w-[380px] truncate" title={question.statement}>
                    {question.statement}
                  </td>
                  <td className="px-4 py-3 text-neutral-700 dark:text-neutral-200">{question.school_class.name}</td>
                  <td className="px-4 py-3 text-neutral-700 dark:text-neutral-200">{question.difficulty.name}</td>
                  <td className="px-4 py-3 text-neutral-900 dark:text-white font-semibold">{question.correct_alternative.toUpperCase()}</td>
                  <td className="px-4 py-3 rounded-r-2xl">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleLoadQuestionForEditing(question.id)}
                        disabled={loadingEditingQuestion || deletingQuestionId === question.id}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#D4EAFC] dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {loadingEditingQuestion && editingQuestionId === question.id ? "Carregando..." : "Editar"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(question.id)}
                        disabled={isSubmitting || deletingQuestionId === question.id}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200 hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {deletingQuestionId === question.id ? "Deletando..." : "Excluir"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loadingQuestions && !questionsError && filteredQuestions.length > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              Mostrando {(currentPage - 1) * QUESTIONS_PER_PAGE + 1}-{Math.min(currentPage * QUESTIONS_PER_PAGE, filteredQuestions.length)} de {filteredQuestions.length}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((previous) => Math.max(1, previous - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-full text-sm font-semibold bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200 px-2">
                Página {currentPage} de {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((previous) => Math.min(totalPages, previous + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-full text-sm font-semibold bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}