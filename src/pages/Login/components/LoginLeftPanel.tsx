export function LoginLeftPanel() {
  return (
    <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#D4EAFC] via-[#E9F3FF] to-[#F1F9F3] dark:from-neutral-800 dark:to-neutral-900 p-8 lg:p-10 xl:p-12 flex-col justify-between relative overflow-hidden h-full">
      {/* Logo and Title */}
      <div className="z-10">
        <div className="flex items-center gap-3 mb-10 lg:mb-12">
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
          <h2 className="text-4xl xl:text-5xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-[1.15] mb-6">
            Bem-vindo de <br />
            <span className="text-blue-600 dark:text-blue-400">volta!</span>
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg xl:text-xl leading-relaxed font-medium">
            Estamos felizes em ver você novamente. Pronto para continuar sua jornada no aprendizado de Português?
          </p>
        </div>
      </div>

      {/* Decorative Blobs */}
      <div className="absolute top-[20%] right-[-10%] w-64 h-64 bg-white/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-80 h-80 bg-blue-200/40 rounded-full blur-3xl"></div>
    </div>
  );
}
