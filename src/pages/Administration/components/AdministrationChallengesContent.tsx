import { useEffect, useMemo, useState } from "react";
import {
  createChallenge,
  getAllChallenges,
  getChallengeById,
  updateChallenge,
  deleteChallenge,
  getChallengeTypes,
  type ChallengeItem,
  type ChallengeType,
} from "../../../services/dailyChallengeService";
import { getSession } from "../../../services/session";

const CHALLENGES_PER_PAGE = 5;

export function AdministrationChallengesContent() {
  const [formValues, setFormValues] = useState({
    name: "",
    unit: "",
    target_value: "",
    xp_reward: "",
    is_active: true,
  });
  const [challenges, setChallenges] = useState<ChallengeItem[]>([]);
  const [challengesError, setChallengesError] = useState<string | null>(null);
  const [loadingChallenges, setLoadingChallenges] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [editingChallengeId, setEditingChallengeId] = useState<number | null>(null);
  const [loadingEditingChallenge, setLoadingEditingChallenge] = useState(false);
  const [deletingChallengeId, setDeletingChallengeId] = useState<number | null>(null);
  const [challengeTypes, setChallengeTypes] = useState<ChallengeType[]>([]);
  const [loadingChallengeTypes, setLoadingChallengeTypes] = useState(false);
  const [challengeTypesError, setChallengeTypesError] = useState<string | null>(null);

  const fetchChallenges = async () => {
    setLoadingChallenges(true);
    setChallengesError(null);

    try {
      const response = await getAllChallenges();
      setChallenges(response.challenges);
    } catch (error) {
      setChallenges([]);
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os desafios.";
      setChallengesError(message);
    } finally {
      setLoadingChallenges(false);
    }
  };

  const fetchChallengeTypesData = async () => {
    setLoadingChallengeTypes(true);
    setChallengeTypesError(null);

    try {
      const types = await getChallengeTypes();
      setChallengeTypes(types);
    } catch (error) {
      setChallengeTypes([]);
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os tipos de desafio.";
      setChallengeTypesError(message);
    } finally {
      setLoadingChallengeTypes(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
    fetchChallengeTypesData();
  }, []);

  const handleInputChange = (field: keyof typeof formValues, value: string) => {
    setFormValues((previousValues) => ({
      ...previousValues,
      [field]: value,
    }));
  };

  const handleLoadChallengeForEditing = async (challengeId: number) => {
    setLoadingEditingChallenge(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const challenge = await getChallengeById(challengeId);

      setFormValues({
        name: challenge.name,
        unit: challenge.unit,
        target_value: String(challenge.target_value),
        xp_reward: String(challenge.xp_reward),
        is_active: challenge.is_active,
      });

      setEditingChallengeId(challengeId);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível carregar o desafio.";
      setSubmitError(message);
    } finally {
      setLoadingEditingChallenge(false);
    }
  };

  const handleCancelEditing = () => {
    setEditingChallengeId(null);
    setFormValues({
      name: "",
      unit: "",
      target_value: "",
      xp_reward: "",
      is_active: true,
    });
  };

  const handleSaveChallenge = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSubmitting(true);

    try {
      const session = getSession();

      if (!session) {
        setSubmitError("Sessão inválida para salvar desafio.");
        return;
      }

      const payload = {
        name: formValues.name.trim(),
        unit: formValues.unit.trim(),
        target_value: Number(formValues.target_value),
        xp_reward: Number(formValues.xp_reward),
        is_active: formValues.is_active,
      };

      if (editingChallengeId) {
        await updateChallenge(editingChallengeId, payload, session.token);
        setSubmitSuccess("Desafio atualizado com sucesso.");
      } else {
        await createChallenge(payload, session.token);
        setSubmitSuccess("Desafio cadastrado com sucesso.");
      }

      setFormValues({
        name: "",
        unit: "",
        target_value: "",
        xp_reward: "",
        is_active: true,
      });
      setEditingChallengeId(null);
      await fetchChallenges();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o desafio.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteChallenge = async (challengeId: number) => {
    if (!window.confirm("Tem certeza que deseja deletar este desafio?")) {
      return;
    }

    setDeletingChallengeId(challengeId);
    setSubmitError(null);

    try {
      const session = getSession();

      if (!session) {
        setSubmitError("Sessão inválida para deletar desafio.");
        return;
      }

      await deleteChallenge(challengeId, session.token);
      setSubmitSuccess("Desafio deletado com sucesso.");
      await fetchChallenges();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível deletar o desafio.";
      setSubmitError(message);
    } finally {
      setDeletingChallengeId(null);
    }
  };

  const filteredChallenges = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return challenges;
    }

    return challenges.filter((challenge) =>
      challenge.name.toLowerCase().includes(normalizedSearch),
    );
  }, [challenges, searchTerm]);

  const totalPages = Math.max(1, Math.ceil((filteredChallenges?.length ?? 0) / CHALLENGES_PER_PAGE));

  const paginatedChallenges = useMemo(() => {
    const startIndex = (currentPage - 1) * CHALLENGES_PER_PAGE;
    return (filteredChallenges ?? []).slice(startIndex, startIndex + CHALLENGES_PER_PAGE);
  }, [currentPage, filteredChallenges]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

  return (
    <main className="flex-1 min-h-0 p-4 pb-24 md:p-6 md:pb-6 lg:p-8 lg:pb-8 overflow-y-auto">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white mb-4 leading-tight">
          Desafios
        </h1>

        <div className="bg-white dark:bg-neutral-800 p-5 md:p-6 rounded-large shadow-sm border border-neutral-100 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D4EAFC] dark:bg-blue-900/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-700 dark:text-blue-200">sports_score</span>
            </div>
            <p className="text-neutral-500 dark:text-neutral-300 text-sm md:text-base">
              Defina metas, unidades e recompensas dos desafios.
            </p>
          </div>
        </div>
      </header>

      <section className="bg-white dark:bg-neutral-800 rounded-large shadow-sm border border-neutral-100 dark:border-neutral-700 p-4 md:p-6">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSaveChallenge}>
          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Nome</span>
            <input
              type="text"
              value={formValues.name}
              onChange={(event) => handleInputChange("name", event.target.value)}
              placeholder="Ex: Enviar mensagens"
              required
              className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Unidade</span>
            <select
              value={formValues.unit}
              onChange={(event) => handleInputChange("unit", event.target.value)}
              required
              disabled={loadingChallengeTypes}
              className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="">
                {loadingChallengeTypes ? "Carregando tipos..." : "Selecione um tipo"}
              </option>
              {challengeTypes.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
            {challengeTypesError && (
              <p className="text-xs text-red-600 dark:text-red-300 font-semibold">{challengeTypesError}</p>
            )}
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Valor-alvo</span>
            <input
              type="number"
              value={formValues.target_value}
              onChange={(event) => handleInputChange("target_value", event.target.value)}
              placeholder="Ex: 10"
              required
              min="1"
              className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Recompensa (XP)</span>
            <input
              type="number"
              value={formValues.xp_reward}
              onChange={(event) => handleInputChange("xp_reward", event.target.value)}
              placeholder="Ex: 30"
              required
              min="1"
              className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </label>

          <label className="flex items-center gap-3 md:col-span-2">
            <input
              type="checkbox"
              checked={formValues.is_active}
              onChange={(event) => setFormValues((prev) => ({ ...prev, is_active: event.target.checked }))}
              className="w-5 h-5 rounded border border-neutral-200 dark:border-neutral-600 accent-blue-500 cursor-pointer"
            />
            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Ativo</span>
          </label>

          {submitError && (
            <p className="md:col-span-2 text-sm text-red-600 dark:text-red-300 font-semibold">{submitError}</p>
          )}

          {submitSuccess && (
            <p className="md:col-span-2 text-sm text-emerald-600 dark:text-emerald-300 font-semibold">{submitSuccess}</p>
          )}

          <div className="md:col-span-2 flex gap-3 justify-end">
            {editingChallengeId && (
              <button
                type="button"
                onClick={handleCancelEditing}
                disabled={isSubmitting || loadingEditingChallenge}
                className="px-5 py-3 rounded-full bg-neutral-300 dark:bg-neutral-600 text-neutral-900 dark:text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting || loadingEditingChallenge}
              className="px-5 py-3 rounded-full bg-neutral-900 dark:bg-blue-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Salvando..." : editingChallengeId ? "Editar desafio" : "Salvar desafio"}
            </button>
          </div>
        </form>
      </section>

      <section className="bg-white dark:bg-neutral-800 rounded-large shadow-sm border border-neutral-100 dark:border-neutral-700 p-4 md:p-6 mt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#D4EAFC] dark:bg-blue-900/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-700 dark:text-blue-200">format_list_bulleted</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white">Desafios cadastrados</h2>
        </div>

        <div className="mb-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Buscar por nome</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Digite parte do nome para filtrar..."
              className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-2">ID</th>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-2">Nome</th>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-2">Unidade</th>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-2">Valor-alvo</th>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-2">XP</th>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-2">Ativo</th>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-2">Ações</th>
              </tr>
            </thead>

            <tbody>
              {loadingChallenges && (
                <tr className="bg-neutral-100 dark:bg-neutral-700">
                  <td colSpan={7} className="px-4 py-4 rounded-2xl text-sm text-neutral-600 dark:text-neutral-200">
                    Carregando desafios...
                  </td>
                </tr>
              )}

              {challengesError && !loadingChallenges && (
                <tr className="bg-red-50 dark:bg-red-900/20">
                  <td colSpan={7} className="px-4 py-4 rounded-2xl text-sm text-red-700 dark:text-red-200">
                    {challengesError}
                  </td>
                </tr>
              )}

              {!loadingChallenges && !challengesError && paginatedChallenges.length === 0 && (
                <tr className="bg-neutral-100 dark:bg-neutral-700">
                  <td colSpan={7} className="px-4 py-4 rounded-2xl text-sm text-neutral-600 dark:text-neutral-200">
                    Nenhum desafio encontrado para o filtro informado.
                  </td>
                </tr>
              )}

              {!loadingChallenges && !challengesError && paginatedChallenges.map((challenge) => (
                <tr key={challenge.id} className="bg-neutral-100 dark:bg-neutral-700">
                  <td className="px-4 py-3 rounded-l-2xl font-bold text-neutral-900 dark:text-white">#{challenge.id}</td>
                  <td className="px-4 py-3 text-neutral-800 dark:text-neutral-100 max-w-[380px] truncate" title={challenge.name}>
                    {challenge.name}
                  </td>
                  <td className="px-4 py-3 text-neutral-700 dark:text-neutral-200">{challenge.unit}</td>
                  <td className="px-4 py-3 text-neutral-700 dark:text-neutral-200">{challenge.target_value}</td>
                  <td className="px-4 py-3 text-neutral-900 dark:text-white font-semibold">{challenge.xp_reward} XP</td>
                  <td className="px-4 py-3 text-neutral-700 dark:text-neutral-200">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                      challenge.is_active
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200"
                        : "bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                    }`}>
                      {challenge.is_active ? "Sim" : "Não"}
                    </span>
                  </td>
                  <td className="px-4 py-3 rounded-r-2xl">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleLoadChallengeForEditing(challenge.id)}
                        disabled={loadingEditingChallenge || deletingChallengeId === challenge.id}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#D4EAFC] dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {loadingEditingChallenge && editingChallengeId === challenge.id ? "Carregando..." : "Editar"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteChallenge(challenge.id)}
                        disabled={isSubmitting || deletingChallengeId === challenge.id}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200 hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {deletingChallengeId === challenge.id ? "Deletando..." : "Excluir"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loadingChallenges && !challengesError && (filteredChallenges?.length ?? 0) > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-neutral-500 dark:text-neutral-300">
              Mostrando {(currentPage - 1) * CHALLENGES_PER_PAGE + 1}-{Math.min(currentPage * CHALLENGES_PER_PAGE, filteredChallenges?.length ?? 0)} de {filteredChallenges?.length ?? 0}
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