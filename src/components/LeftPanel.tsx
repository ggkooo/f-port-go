interface LeftPanelProps {
  title: string;
  titleHighlight: string;
  description: string;
  variant?: "default" | "register";
  cardIcon?: string;
  cardTitle?: string;
  cardDescription?: string;
}

export function LeftPanel({
  title,
  titleHighlight,
  description,
  variant = "default",
  cardIcon,
  cardTitle,
  cardDescription,
}: LeftPanelProps) {
  const gradientClass =
    variant === "register"
      ? "from-[#D4EAFC] via-[#E9F3FF] to-[#E3F4E6]"
      : "from-[#D4EAFC] via-[#E9F3FF] to-[#F1F9F3]";

  return (
    <div
      className={`hidden md:flex md:w-1/2 bg-gradient-to-br ${gradientClass} dark:from-neutral-800 dark:to-neutral-900 p-8 lg:p-10 xl:p-12 flex-col justify-between relative overflow-hidden h-full`}
    >
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

        <div className="max-w-md">
          <h2 className="text-4xl xl:text-5xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-[1.15] mb-6">
            {title}
            <br />
            <span className="text-blue-600 dark:text-blue-400">{titleHighlight}</span>
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg xl:text-xl leading-relaxed font-medium">
            {description}
          </p>
        </div>
      </div>

      {cardIcon && cardTitle && cardDescription && (
        <div className="z-10 glass-card dark:bg-neutral-800/40 p-6 rounded-3xl shadow-xl w-fit">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white dark:bg-neutral-800 rounded-2xl flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-2xl" style={{ color: getIconColor(cardIcon) }}>
                {cardIcon}
              </span>
            </div>
            <div>
              <p className="text-sm font-extrabold text-neutral-900 dark:text-white uppercase tracking-wider">
                {cardTitle}
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium mt-0.5">
                {cardDescription}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-[20%] right-[-10%] w-64 h-64 bg-white/30 dark:bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-80 h-80 bg-blue-200/40 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
    </div>
  );
}

function getIconColor(icon: string): string {
  const colorMap: { [key: string]: string } = {
    group: "rgb(59, 130, 246)", // blue-500
    sentiment_satisfied: "rgb(16, 185, 129)", // emerald-500
  };
  return colorMap[icon] || "rgb(59, 130, 246)";
}
