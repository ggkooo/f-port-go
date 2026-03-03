interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2 mb-6 text-xs md:text-sm font-semibold text-neutral-500 dark:text-neutral-300">
      <span className={currentStep >= 1 ? "text-neutral-900 dark:text-white" : ""}>1. Série</span>
      <span>•</span>
      <span className={currentStep >= 2 ? "text-neutral-900 dark:text-white" : ""}>2. Dificuldade</span>
      <span>•</span>
      <span className={currentStep >= 3 ? "text-neutral-900 dark:text-white" : ""}>3. Questionário</span>
    </div>
  );
}
