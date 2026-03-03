export function BrowserHeader() {
  const { pathname } = window.location;
  const normalizedPath = pathname.replace(/\/+$/, "");
  const currentUrl = `www.portgo.com.br${normalizedPath}`;

  return (
    <div className="h-12 bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 flex items-center px-6 gap-2">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-red-400"></div>
        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
      </div>
      <div className="mx-auto bg-white dark:bg-neutral-900 px-8 py-1 rounded-full text-[10px] text-neutral-400 border border-neutral-200 dark:border-neutral-700 w-1/3 text-center">
        {currentUrl}
      </div>
    </div>
  );
}
