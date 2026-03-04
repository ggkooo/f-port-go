import {
  AdministrationLayout,
  AdministrationUsersContent,
} from "./components";

function AdministrationUsers() {
  return (
    <AdministrationLayout activePath="/administration/users">
      <AdministrationUsersContent />
    </AdministrationLayout>
  );
}

export default AdministrationUsers;