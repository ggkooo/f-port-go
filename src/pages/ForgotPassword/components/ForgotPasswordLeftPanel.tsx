export function ForgotPasswordLeftPanel() {
  return (
    <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#D4EAFC] via-[#E9F3FF] to-[#F1F9F3] dark:from-neutral-800 dark:to-neutral-900 p-16 flex-col justify-between relative overflow-hidden">
      {/* Logo and Title */}
      <div className="z-10">
        <div className="flex items-center gap-3 mb-20">
          <div className="bg-neutral-900 dark:bg-white w-10 h-10 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-white dark:text-neutral-900 text-xl">
              school
            </span>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            PortGO
          </span>
        </div>

        {/* Welcome Message */}
        <div className="max-w-md">
          <h2 className="text-5xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-[1.15] mb-8">
            Recupere sua <br />
            <span className="text-blue-600 dark:text-blue-400">senha</span>
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-xl leading-relaxed font-medium">
            Não se preocupe, acontece com os melhores! Vamos te ajudar a voltar aos estudos.
          </p>
        </div>
      </div>

      {/* Card with Info */}
      <div className="z-10 glass-card dark:bg-neutral-800/40 p-6 rounded-3xl shadow-xl w-fit">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white dark:bg-neutral-800 rounded-2xl flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-emerald-500 text-2xl">
              sentiment_satisfied
            </span>
          </div>
          <div>
            <p className="text-sm font-extrabold text-neutral-900 dark:text-white uppercase tracking-wider">
              Tudo sob controle!
            </p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium mt-0.5">
              Sua conta e progresso estão seguros conosco.
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Blobs */}
      <div className="absolute top-[20%] right-[-10%] w-64 h-64 bg-white/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-80 h-80 bg-blue-200/40 rounded-full blur-3xl"></div>
    </div>
  );
}
