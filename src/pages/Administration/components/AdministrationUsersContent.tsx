export function AdministrationUsersContent() {
  const users = [
    {
      id: "1",
      first_name: "João",
      last_name: "Silva",
      email: "joao.silva@example.com",
      is_admin: true,
    },
    {
      id: "2",
      first_name: "Maria",
      last_name: "Santos",
      email: "maria.santos@example.com",
      is_admin: false,
    },
    {
      id: "3",
      first_name: "Pedro",
      last_name: "Oliveira",
      email: "pedro.oliveira@example.com",
      is_admin: false,
    },
    {
      id: "4",
      first_name: "Ana",
      last_name: "Costa",
      email: "ana.costa@example.com",
      is_admin: false,
    },
    {
      id: "5",
      first_name: "Carlos",
      last_name: "Ferreira",
      email: "carlos.ferreira@example.com",
      is_admin: true,
    },
  ];

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

      {/* Tabela de Usuários */}
      <section className="bg-white dark:bg-neutral-800 rounded-large shadow-sm border border-neutral-100 dark:border-neutral-700 p-4 md:p-6">
        {users.length === 0 ? (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}