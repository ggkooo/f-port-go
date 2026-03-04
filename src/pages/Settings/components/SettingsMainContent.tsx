import { useEffect, useMemo, useState } from "react";
import {
  getClasses,
  getShifts,
  type ClassOption,
  type ShiftOption,
} from "../../../services/catalogService";
import {
  getProfile,
  updateProfile,
} from "../../../services/profileService";
import { getSession, updateSession } from "../../../services/session";

const personalFields = [
  { id: "firstName", label: "Nome", type: "text", field: "firstName", readOnly: true, required: false },
  { id: "lastName", label: "Sobrenome", type: "text", field: "lastName", readOnly: true, required: false },
  { id: "phone", label: "Telefone", type: "tel", field: "phone", readOnly: false, required: true },
  { id: "email", label: "E-mail", type: "email", field: "email", readOnly: false, required: true },
] as const;

const academicFields = [
  { id: "school", label: "Escola", type: "text", field: "school", required: true },
] as const;

interface IbgeState {
  id: number;
  nome: string;
  sigla: string;
}

interface IbgeCity {
  id: number;
  nome: string;
}

type FormValues = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  school: string;
  classId: string;
};

export function SettingsMainContent() {
  const [formValues, setFormValues] = useState<FormValues>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    school: "",
    classId: "",
  });
  const [states, setStates] = useState<IbgeState[]>([]);
  const [cities, setCities] = useState<IbgeCity[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [shifts, setShifts] = useState<ShiftOption[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedShiftId, setSelectedShiftId] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingShifts, setLoadingShifts] = useState(false);
  const [classesError, setClassesError] = useState<string | null>(null);
  const [shiftsError, setShiftsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      const session = getSession();

      if (!session) {
        setProfileError("Sessão inválida para carregar perfil.");
        return;
      }

      setLoadingProfile(true);
      setProfileError(null);

      try {
        const { user } = await getProfile(session.uuid, session.token);
        const profileFirstName = user.first_name?.trim() ?? "";

        setFormValues({
          firstName: profileFirstName,
          lastName: user.last_name ?? "",
          phone: user.phone ?? "",
          email: user.email ?? "",
          school: user.school ?? "",
          classId: user.class !== null ? String(user.class) : "",
        });

        updateSession({
          email: user.email ?? session.email,
          firstName: profileFirstName || undefined,
        });

        setSelectedState(user.state ?? "");
        setSelectedCity(user.city ?? "");
        setSelectedShiftId(user.shift !== null ? String(user.shift) : "");
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os dados do perfil.";
        setProfileError(message);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfileData();
  }, []);

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
    () =>
      states.some(
        (stateItem) => stateItem.sigla.toLowerCase() === selectedState.toLowerCase(),
      ),
    [selectedState, states],
  );

  useEffect(() => {
    if (!selectedState || states.length === 0) {
      return;
    }

    const normalizedState = selectedState.toLowerCase();
    const matchedState = states.find(
      (stateItem) =>
        stateItem.sigla.toLowerCase() === normalizedState ||
        stateItem.nome.toLowerCase() === normalizedState,
    );

    if (matchedState && matchedState.sigla !== selectedState) {
      setSelectedState(matchedState.sigla);
    }
  }, [selectedState, states]);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoadingClasses(true);
      setClassesError(null);

      try {
        const response = await getClasses();
        setClasses(response.classes);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Não foi possível carregar as turmas.";
        setClassesError(message);
        setClasses([]);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchShifts = async () => {
      setLoadingShifts(true);
      setShiftsError(null);

      try {
        const response = await getShifts();
        setShifts(response.shifts);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Não foi possível carregar os turnos.";
        setShiftsError(message);
        setShifts([]);
      } finally {
        setLoadingShifts(false);
      }
    };

    fetchShifts();
  }, []);

  useEffect(() => {
    if (!formValues.classId || classes.length === 0) {
      return;
    }

    const matchedClass = classes.find(
      (classItem) =>
        String(classItem.id) === formValues.classId ||
        classItem.name === formValues.classId,
    );

    if (!matchedClass) {
      handleInputChange("classId", "");
      return;
    }

    const matchedClassId = String(matchedClass.id);
    if (formValues.classId !== matchedClassId) {
      handleInputChange("classId", matchedClassId);
    }
  }, [classes, formValues.classId]);

  useEffect(() => {
    if (!selectedShiftId || shifts.length === 0) {
      return;
    }

    const matchedShift = shifts.find(
      (shiftItem) =>
        String(shiftItem.id) === selectedShiftId ||
        shiftItem.name === selectedShiftId,
    );

    if (!matchedShift) {
      setSelectedShiftId("");
      return;
    }

    const matchedShiftId = String(matchedShift.id);
    if (selectedShiftId !== matchedShiftId) {
      setSelectedShiftId(matchedShiftId);
    }
  }, [selectedShiftId, shifts]);

  useEffect(() => {
    const fetchCities = async () => {
      if (!isStateValid) {
        setCities([]);
        if (!selectedState) {
          setSelectedCity("");
        }
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

  const handleInputChange = (field: keyof FormValues, value: string) => {
    setFormValues((previousValues) => ({
      ...previousValues,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const session = getSession();
    if (!session) {
      setSubmitError("Sessão inválida para salvar perfil.");
      setSubmitSuccess(null);
      return;
    }

    const payload = {
      phone: formValues.phone.trim(),
      email: formValues.email.trim(),
      state: selectedState.trim(),
      city: selectedCity.trim(),
      school: formValues.school.trim(),
      class: Number(formValues.classId),
      shift: Number(selectedShiftId),
    };

    const requiredFieldsAreFilled =
      payload.phone &&
      payload.email &&
      payload.state &&
      payload.city &&
      payload.school &&
      formValues.classId &&
      !Number.isNaN(payload.class) &&
      selectedShiftId &&
      !Number.isNaN(payload.shift);

    if (!requiredFieldsAreFilled) {
      setSubmitError("Preencha todos os campos obrigatórios para salvar o perfil.");
      setSubmitSuccess(null);
      return;
    }

    setIsSaving(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      await updateProfile(session.token, payload);
      updateSession({
        profileCompleted: true,
        email: payload.email,
        firstName: formValues.firstName.trim() || undefined,
      });
      setSubmitSuccess("Perfil atualizado com sucesso.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível salvar os dados do perfil.";
      setSubmitError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="flex-1 min-h-0 p-4 pb-24 md:p-6 md:pb-6 lg:p-8 lg:pb-8 overflow-y-auto">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white mb-2 leading-tight">
          Configurações do Perfil
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base">
          Atualize suas informações pessoais e acadêmicas.
        </p>
        {loadingProfile && (
          <p className="mt-2 text-sm font-semibold text-neutral-600 dark:text-neutral-300">
            Carregando dados do perfil...
          </p>
        )}
        {profileError && (
          <p className="mt-2 text-sm font-semibold text-red-600 dark:text-red-300">
            {profileError}
          </p>
        )}
        {submitError && (
          <p className="mt-2 text-sm font-semibold text-red-600 dark:text-red-300">
            {submitError}
          </p>
        )}
        {submitSuccess && (
          <p className="mt-2 text-sm font-semibold text-emerald-600 dark:text-emerald-300">
            {submitSuccess}
          </p>
        )}
        {classesError && (
          <p className="mt-2 text-sm font-semibold text-red-600 dark:text-red-300">
            {classesError}
          </p>
        )}
        {shiftsError && (
          <p className="mt-2 text-sm font-semibold text-red-600 dark:text-red-300">
            {shiftsError}
          </p>
        )}
      </header>

      <form
        className="bg-white dark:bg-neutral-800 p-5 md:p-6 rounded-large shadow-sm border border-neutral-100 dark:border-neutral-700"
        onSubmit={handleSubmit}
      >
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
                  value={formValues[field.field]}
                  onChange={(event) => handleInputChange(field.field, event.target.value)}
                  type={field.type}
                  readOnly={field.readOnly ?? false}
                  required={field.required ?? false}
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
                required
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
                required
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
                  value={formValues[field.field]}
                  onChange={(event) => handleInputChange(field.field, event.target.value)}
                  type={field.type}
                  required={field.required ?? false}
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
            ))}

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Turma</span>
              <select
                id="class"
                value={formValues.classId}
                onChange={(event) => handleInputChange("classId", event.target.value)}
                required
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  {loadingClasses ? "Carregando turmas..." : "Selecione uma turma"}
                </option>
                {classes.map((classItem) => (
                  <option key={classItem.id} value={String(classItem.id)}>
                    {classItem.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Turno</span>
              <select
                id="shift"
                value={selectedShiftId}
                onChange={(event) => setSelectedShiftId(event.target.value)}
                required
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  {loadingShifts ? "Carregando turnos..." : "Selecione um turno"}
                </option>
                {shifts.map((shiftItem) => (
                  <option key={shiftItem.id} value={String(shiftItem.id)}>
                    {shiftItem.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
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
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-blue-500 text-white font-semibold"
          >
            {isSaving ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </form>
    </main>
  );
}
