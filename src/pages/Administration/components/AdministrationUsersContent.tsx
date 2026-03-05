import { useEffect, useState } from "react";
import { ConfirmationModal } from "../../../components/ConfirmationModal";
import { getSession } from "../../../services/session";
import {
  createUser,
  deleteUser,
  getAllUsers,
  promoteUserToAdmin,
  removeUserAdmin,
  updateUser,
  type UserApiItem,
} from "../../../services/userService";

export function AdministrationUsersContent() {
  const [users, setUsers] = useState<UserApiItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [activeActionUserId, setActiveActionUserId] = useState<string | null>(null);
  const [userPendingDeletion, setUserPendingDeletion] = useState<UserApiItem | null>(null);

  const resetForm = () => {
    setFormValues({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    });
    setEditingUserId(null);
  };

  const getUserIdentifier = (user: UserApiItem): string => {
    if (user.uuid && user.uuid.trim()) {
      return user.uuid;
    }

    return String(user.id);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const session = getSession();

      if (!session) {
        setUsers([]);
        setUsersError("Sessão inválida para carregar usuários.");
        return;
      }

      setLoadingUsers(true);
      setUsersError(null);

      try {
        const response = await getAllUsers(session.uuid);
        setUsers(response.users);
      } catch (error) {
        setUsers([]);
        const message =
          error instanceof Error ? error.message : "Não foi possível carregar os usuários.";
        setUsersError(message);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (field: keyof typeof formValues, value: string) => {
    setFormValues((previousValues) => ({
      ...previousValues,
      [field]: value,
    }));
  };

  const fetchUsers = async () => {
    const session = getSession();

    if (!session) {
      setUsers([]);
      setUsersError("Sessão inválida para carregar usuários.");
      return;
    }

    setLoadingUsers(true);
    setUsersError(null);

    try {
      const response = await getAllUsers(session.uuid);
      setUsers(response.users);
    } catch (error) {
      setUsers([]);
      const message =
        error instanceof Error ? error.message : "Não foi possível carregar os usuários.";
      setUsersError(message);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSubmitUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    const session = getSession();
    if (!session) {
      setSubmitError("Sessão inválida para salvar usuário.");
      return;
    }

    if (!formValues.first_name.trim() || !formValues.last_name.trim() || !formValues.email.trim()) {
      setSubmitError("Preencha nome, sobrenome e email.");
      return;
    }

    if (!editingUserId && !formValues.password.trim()) {
      setSubmitError("Preencha a senha para criar o usuário.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingUserId) {
        await updateUser(session.uuid, editingUserId, {
          first_name: formValues.first_name.trim(),
          last_name: formValues.last_name.trim(),
          email: formValues.email.trim(),
          ...(formValues.password.trim() ? { password: formValues.password.trim() } : {}),
        });
        setSubmitSuccess("Usuário atualizado com sucesso.");
      } else {
        await createUser(session.uuid, {
          first_name: formValues.first_name.trim(),
          last_name: formValues.last_name.trim(),
          email: formValues.email.trim(),
          password: formValues.password.trim(),
        });
        setSubmitSuccess("Usuário adicionado com sucesso.");
      }

      resetForm();
      await fetchUsers();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Não foi possível salvar o usuário.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (user: UserApiItem) => {
    setSubmitError(null);
    setSubmitSuccess(null);
    setEditingUserId(getUserIdentifier(user));
    setFormValues({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: "",
    });
  };

  const handleDeleteUser = async (user: UserApiItem) => {
    const session = getSession();
    if (!session) {
      setUsersError("Sessão inválida para deletar usuário.");
      return;
    }

    const userId = getUserIdentifier(user);
    setActiveActionUserId(userId);
    setUsersError(null);
    setSubmitSuccess(null);

    try {
      await deleteUser(session.uuid, userId);
      setSubmitSuccess("Usuário deletado com sucesso.");
      setUserPendingDeletion(null);

      if (editingUserId === userId) {
        resetForm();
      }

      await fetchUsers();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Não foi possível deletar o usuário.";
      setUsersError(message);
    } finally {
      setActiveActionUserId(null);
    }
  };

  const handleToggleAdmin = async (user: UserApiItem) => {
    const session = getSession();
    if (!session) {
      setUsersError("Sessão inválida para alterar permissões.");
      return;
    }

    const userId = getUserIdentifier(user);
    setActiveActionUserId(userId);
    setUsersError(null);
    setSubmitSuccess(null);

    try {
      if (user.is_admin) {
        await removeUserAdmin(session.uuid, userId);
        setSubmitSuccess("Permissão de administrador removida com sucesso.");
      } else {
        await promoteUserToAdmin(session.uuid, userId);
        setSubmitSuccess("Usuário promovido a administrador com sucesso.");
      }

      await fetchUsers();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Não foi possível alterar permissões do usuário.";
      setUsersError(message);
    } finally {
      setActiveActionUserId(null);
    }
  };

  return (
    <main className="flex-1 min-h-0 p-4 pb-24 md:p-6 md:pb-6 lg:p-8 lg:pb-8 overflow-y-auto">
      <header className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white leading-tight">
            Usuários
          </h1>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-5 md:p-6 rounded-large shadow-sm border border-neutral-100 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D4EAFC] dark:bg-blue-900/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-700 dark:text-blue-200">
                groups
              </span>
            </div>
            <p className="text-neutral-500 dark:text-neutral-300 text-sm md:text-base">
              Lista de usuários do sistema.
            </p>
          </div>
        </div>
      </header>

      <section className="bg-white dark:bg-neutral-800 rounded-large shadow-sm border border-neutral-100 dark:border-neutral-700 p-4 md:p-6 mb-6">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
          {editingUserId ? "Editar usuário" : "Adicionar usuário"}
        </h2>

        <form onSubmit={handleSubmitUser} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200 mb-2">
                Nome
              </label>
              <input
                type="text"
                value={formValues.first_name}
                onChange={(event) => handleInputChange("first_name", event.target.value)}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200 mb-2">
                Sobrenome
              </label>
              <input
                type="text"
                value={formValues.last_name}
                onChange={(event) => handleInputChange("last_name", event.target.value)}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Sobrenome"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formValues.email}
                onChange={(event) => handleInputChange("email", event.target.value)}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@exemplo.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200 mb-2">
                Senha
              </label>
              <input
                type="password"
                value={formValues.password}
                onChange={(event) => handleInputChange("password", event.target.value)}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={editingUserId ? "Deixe em branco para não alterar" : "Senha"}
                required={!editingUserId}
              />
            </div>
          </div>

          {submitError ? (
            <p className="text-sm text-red-600 dark:text-red-300">{submitError}</p>
          ) : null}
          {submitSuccess ? (
            <p className="text-sm text-green-600 dark:text-green-300">{submitSuccess}</p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Salvando..."
                : editingUserId
                  ? "Salvar alterações"
                  : "Adicionar usuário"}
            </button>

            {editingUserId ? (
              <button
                type="button"
                onClick={resetForm}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar edição
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="bg-white dark:bg-neutral-800 rounded-large shadow-sm border border-neutral-100 dark:border-neutral-700 p-4 md:p-6">
        {loadingUsers ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-neutral-600 dark:text-neutral-400">Carregando usuários...</div>
          </div>
        ) : usersError ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-red-600 dark:text-red-300">{usersError}</div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-neutral-600 dark:text-neutral-400">
              Nenhum usuário encontrado.
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-2">
                    Nome
                  </th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-2">
                    Email
                  </th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-2">
                    Função
                  </th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-2">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="bg-neutral-100 dark:bg-neutral-700"
                  >
                    <td className="px-4 py-3 rounded-l-2xl font-semibold text-neutral-900 dark:text-white">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="px-4 py-3 text-neutral-700 dark:text-neutral-200">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 rounded-r-2xl">
                      {user.is_admin ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                          Administrador
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-neutral-200 text-neutral-700 dark:bg-neutral-600 dark:text-neutral-200">
                          Usuário
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(user)}
                          disabled={activeActionUserId === getUserIdentifier(user) || isSubmitting}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleAdmin(user)}
                          disabled={activeActionUserId === getUserIdentifier(user) || isSubmitting}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {user.is_admin ? "Remover admin" : "Tornar admin"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setUserPendingDeletion(user)}
                          disabled={activeActionUserId === getUserIdentifier(user) || isSubmitting}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Deletar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ConfirmationModal
        isOpen={userPendingDeletion !== null}
        title="Confirmar exclusão"
        description="Tem certeza que deseja deletar este usuário? Esta ação não poderá ser desfeita."
        confirmLabel="Deletar usuário"
        cancelLabel="Cancelar"
        onCancel={() => setUserPendingDeletion(null)}
        onConfirm={() => {
          if (!userPendingDeletion) {
            return;
          }

          handleDeleteUser(userPendingDeletion);
        }}
        isLoading={
          userPendingDeletion !== null &&
          activeActionUserId === getUserIdentifier(userPendingDeletion)
        }
      />
    </main>
  );
}