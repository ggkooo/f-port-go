import {
  AdministrationChallengesContent,
  AdministrationLayout,
} from "./components";

function AdministrationChallenges() {
  return (
    <AdministrationLayout activePath="/administration/challenges">
      <AdministrationChallengesContent />
    </AdministrationLayout>
  );
}

export default AdministrationChallenges;