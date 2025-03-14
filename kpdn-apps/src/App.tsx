import { IonApp } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import AppRoutes from "./routes"; // ✅ Import centralized routes

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <AppRoutes /> {/* ✅ Centralized routing */}
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
