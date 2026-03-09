type ConfirmationModalProps = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  isLoading?: boolean;
  footer?: React.ReactNode;
  children?: React.ReactNode;
};

export function ConfirmationModal({
  isOpen,
  title,
  description,
  confirmLabel = "Confirmar",
  onConfirm,
  isLoading = false,
  footer,
  children,
}: ConfirmationModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-700 dark:bg-neutral-900 flex flex-col">
        <h2 className="text-xl font-extrabold text-neutral-900 dark:text-white">{title}</h2>
        <p className="mt-3 text-sm font-medium text-neutral-600 dark:text-neutral-300">{description}</p>
        {children && <div className="mt-4">{children}</div>}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processando..." : confirmLabel}
          </button>
        </div>
        {footer && <div className="mt-4 text-xs text-neutral-400 text-right">{footer}</div>}
      </div>
    </div>
  );
}