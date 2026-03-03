interface PasswordInputProps {
  id: string;
  placeholder: string;
}

export function PasswordInput({ id, placeholder }: PasswordInputProps) {
  return (
    <div className="group">
      <label
        htmlFor={id}
        className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2.5 ml-1 transition-colors group-focus-within:text-blue-600"
      >
        Senha
      </label>
      <input
        id={id}
        name={id}
        type="password"
        placeholder={placeholder}
        required
        className="w-full px-6 py-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-400 outline-none transition-all dark:text-white text-base placeholder:text-neutral-400"
      />
    </div>
  );
}
