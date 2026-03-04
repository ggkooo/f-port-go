import {
  AdministrationLayout,
  AdministrationMainContent,
} from "./components";

function Administration() {
  return (
    <AdministrationLayout activePath="/administration">
      <AdministrationMainContent />
    </AdministrationLayout>
  );
}

export default Administration;