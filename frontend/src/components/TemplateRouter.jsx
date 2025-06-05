// components/templates/TemplateRouter.jsx
import { useParams } from "react-router-dom";
import ModernProfessional from "./templates/ModernProfessional";
import CleanAndMinimal from "./templates/CleanAndMinimal";
import Elegant from "./templates/Elegant";

const TemplateRouter = () => {
  const { templateName } = useParams();

  switch (templateName) {
    case "ModernProfessional":
      return <ModernProfessional />;
    case "CleanAndMinimal":
      return <CleanAndMinimal />;
    case "Elegant":
      return <Elegant />;
    default:
      return <div className="text-center mt-20 text-xl">Template Not Found</div>;
  }
};

export default TemplateRouter;
