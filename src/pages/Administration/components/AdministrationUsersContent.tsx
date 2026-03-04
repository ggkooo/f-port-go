const recentStudents = [
  { id: 1, name: "Ana Souza", schoolClass: "8º Ano A", status: "Ativo", streak: 12 },
  { id: 2, name: "Pedro Lima", schoolClass: "8º Ano A", status: "Ativo", streak: 8 },
  { id: 3, name: "Marina Alves", schoolClass: "9º Ano B", status: "Pendente", streak: 0 },
  { id: 4, name: "Lucas Araújo", schoolClass: "9º Ano B", status: "Ativo", streak: 15 },
  { id: 5, name: "Beatriz Costa", schoolClass: "7º Ano C", status: "Inativo", streak: 0 },
];

function getStatusClass(status: string): string {
  if (status === "Ativo") {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
  }

  if (status === "Pendente") {
    return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
  }

  return "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200";
}

export function AdministrationUsersContent() {
  return (
    <main className="flex-1 min-h-0 p-4 pb-24 md:p-6 md:pb-6 lg:p-8 lg:pb-8 overflow-y-auto">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white mb-4 leading-tight">
          Usuários
        </h1>

        <div className="bg-white dark:bg-neutral-800 p-5 md:p-6 rounded-large shadow-sm border border-neutral-100 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D4EAFC] dark:bg-blue-900/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-700 dark:text-blue-200">groups</span>
            </div>
            <p className="text-neutral-500 dark:text-neutral-300 text-sm md:text-base">
              Visualize os alunos cadastrados, status de acesso e ofensiva atual.
            </p>
          </div>
        </div>
      </header>

      <section className="bg-white dark:bg-neutral-800 rounded-large shadow-sm border border-neutral-100 dark:border-neutral-700 p-4 md:p-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-2">Aluno</th>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-2">Turma</th>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-2">Status</th>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-2">Ofensiva</th>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-2">Ações</th>
              </tr>
            </thead>

            <tbody>
              {recentStudents.map((student) => (
                <tr key={student.id} className="bg-neutral-100 dark:bg-neutral-700">
                  <td className="px-4 py-3 rounded-l-2xl font-semibold text-neutral-900 dark:text-white">{student.name}</td>
                  <td className="px-4 py-3 text-neutral-700 dark:text-neutral-200">{student.schoolClass}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusClass(student.status)}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-700 dark:text-neutral-200">{student.streak} dias</td>
                  <td className="px-4 py-3 rounded-r-2xl">
                    <button
                      type="button"
                      className="text-sm font-semibold text-blue-700 dark:text-blue-300 hover:underline"
                    >
                      Ver perfil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}