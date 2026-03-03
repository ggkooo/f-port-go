import { useEffect, useMemo, useState } from "react";

const personalFields = [
  { id: "firstName", label: "Nome", type: "text", value: "Giordano" },
  { id: "lastName", label: "Sobrenome", type: "text", value: "Berwig" },
  { id: "phone", label: "Telefone", type: "tel", value: "(51) 99999-9999" },
  { id: "email", label: "E-mail", type: "email", value: "giordano@email.com" },
];

const academicFields = [
  { id: "school", label: "Escola", type: "text", value: "Escola Estadual PortGO" },
  { id: "class", label: "Turma", type: "text", value: "3º Ano A" },
];

const shiftOptions = [
  { value: "manhã", label: "Manhã" },
  { value: "tarde", label: "Tarde" },
  { value: "integral", label: "Integral" },
];

interface IbgeState {
  id: number;
  nome: string;
  sigla: string;
}

interface IbgeCity {
  id: number;
  nome: string;
}

export function SettingsMainContent() {
  const [states, setStates] = useState<IbgeState[]>([]);
  const [cities, setCities] = useState<IbgeCity[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedShift, setSelectedShift] = useState("manhã");
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    const fetchStates = async () => {
      setLoadingStates(true);

      try {
        const response = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome");
        const data = (await response.json()) as IbgeState[];
        setStates(data);
      } catch {
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, []);

  const isStateValid = useMemo(
    () => states.some((stateItem) => stateItem.sigla === selectedState),
    [selectedState, states],
  );

  useEffect(() => {
    const fetchCities = async () => {
      if (!isStateValid) {
        setCities([]);
        setSelectedCity("");
        return;
      }

      setLoadingCities(true);

      try {
        const response = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`,
        );
        const data = (await response.json()) as IbgeCity[];
        setCities(data);
      } catch {
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [isStateValid, selectedState]);

  return (
    <main className="flex-1 min-h-0 p-4 pb-24 md:p-6 md:pb-6 lg:p-8 lg:pb-8 overflow-y-auto">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white mb-2 leading-tight">
          Configurações do Perfil
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base">
          Atualize suas informações pessoais e acadêmicas.
        </p>
      </header>

      <form className="bg-white dark:bg-neutral-800 p-5 md:p-6 rounded-large shadow-sm border border-neutral-100 dark:border-neutral-700">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#D4EAFC] dark:bg-blue-900/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-700 dark:text-blue-200">person</span>
            </div>
            <div>
              <h2 className="font-bold text-neutral-900 dark:text-white">Informações pessoais</h2>
              <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400">
                Nome, contato e dados básicos do usuário.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {personalFields.map((field) => (
              <label key={field.id} className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">{field.label}</span>
                <input
                  id={field.id}
                  defaultValue={field.value}
                  type={field.type}
                  readOnly={field.id === "firstName" || field.id === "lastName"}
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#A3E4A1]/70 dark:bg-emerald-900/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-700 dark:text-emerald-200">school</span>
            </div>
            <div>
              <h2 className="font-bold text-neutral-900 dark:text-white">Informações acadêmicas</h2>
              <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400">
                Escola, turma e dados escolares.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Estado</span>
              <select
                id="state"
                value={selectedState}
                onChange={(event) => setSelectedState(event.target.value)}
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{loadingStates ? "Carregando estados..." : "Selecione um estado"}</option>
                {states.map((stateItem) => (
                  <option key={stateItem.id} value={stateItem.sigla}>
                    {stateItem.nome}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Cidade</span>
              <select
                id="city"
                value={selectedCity}
                onChange={(event) => setSelectedCity(event.target.value)}
                disabled={!isStateValid || loadingCities}
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="">
                  {!isStateValid
                    ? "Selecione um estado válido"
                    : loadingCities
                      ? "Carregando cidades..."
                      : "Selecione uma cidade"}
                </option>
                {cities.map((cityItem) => (
                  <option key={cityItem.id} value={cityItem.nome}>
                    {cityItem.nome}
                  </option>
                ))}
              </select>
            </label>

            {academicFields.map((field) => (
              <label key={field.id} className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">{field.label}</span>
                <input
                  id={field.id}
                  defaultValue={field.value}
                  type={field.type}
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
            ))}

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Turno</span>
              <select
                id="shift"
                value={selectedShift}
                onChange={(event) => setSelectedShift(event.target.value)}
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {shiftOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="mt-8">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Sobre você</span>
            <textarea
              id="about"
              defaultValue="Sou estudante do 3º ano e gosto de aprender programação e inglês no PortGO."
              rows={4}
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </label>
        </section>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            className="px-5 py-2.5 rounded-xl bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 font-semibold"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-blue-500 text-white font-semibold"
          >
            Salvar alterações
          </button>
        </div>
      </form>
    </main>
  );
}
