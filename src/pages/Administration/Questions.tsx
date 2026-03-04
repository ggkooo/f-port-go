import {
  AdministrationLayout,
  AdministrationQuestionsContent,
} from "./components";

function AdministrationQuestions() {
  return (
    <AdministrationLayout activePath="/administration/questions">
      <AdministrationQuestionsContent />
    </AdministrationLayout>
  );
}

export default AdministrationQuestions;