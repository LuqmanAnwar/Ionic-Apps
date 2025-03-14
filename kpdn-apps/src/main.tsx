import React from "react";
import ReactDOM from "react-dom";
import { setupIonicReact } from "@ionic/react";
import App from "./App";
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

setupIonicReact(); // ✅ Ensure Ionic is initialized

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root") // ✅ Ensure it matches <div id="root"></div>
);
