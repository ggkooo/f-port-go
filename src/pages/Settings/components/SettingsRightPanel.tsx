const profileCompletion = [
  { label: "Dados pessoais", value: "100%" },
  { label: "Contato", value: "100%" },
  { label: "Dados escolares", value: "85%" },
];

const suggestions = [
  "Adicione seu número de WhatsApp para receber lembretes.",
  "Revise o nome da escola e da turma para manter os dados atualizados.",
  "Complete a seção 'Sobre você' para personalizar recomendações.",
];

export function SettingsRightPanel() {
  return (
    <aside className="w-80 bg-neutral-100 dark:bg-neutral-800 m-3 rounded-[2rem] p-5 flex-col gap-5 hidden 2xl:flex">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white">
          <span className="material-symbols-outlined text-xl">manage_accounts</span>
          Meu Perfil
        </div>
        <button type="button" className="w-8 h-8 flex items-center justify-center text-neutral-500">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>

      <div className="bg-white dark:bg-neutral-700 rounded-2xl p-4 shadow-sm">
        <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">
          Progresso do cadastro
        </h2>

        <ul className="space-y-3">
          {profileCompletion.map((item) => (
            <li key={item.label} className="flex items-center justify-between text-sm">
              <span className="text-neutral-700 dark:text-neutral-200">{item.label}</span>
              <span className="font-bold text-neutral-900 dark:text-white">{item.value}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-[#D4EAFC] dark:bg-blue-900/30 rounded-2xl p-4">
        <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-3">Sugestões rápidas</h3>
        <ul className="space-y-3">
          {suggestions.map((suggestion) => (
            <li key={suggestion} className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
              • {suggestion}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
