import { IonRouterOutlet } from "@ionic/react";
import { Route, Switch, Redirect } from "react-router-dom"; // ✅ Use Switch and Redirect
import Home from "./pages/Home";
import Petron from "./pages/Petron";
import Shell from "./pages/Shell"; // ✅ Import Shell correctly
import RedFlag from "./pages/red-flag";
import AdvanceSearch from "./pages/advance-search";
import VehicleSearch from "./pages/vehicle-search";
import VehicleDetails from "./pages/vehicle-details";
import PetrolStationDashboard from "./pages/petrol-search";
import StationStatistics from "./pages/station-statistic";


const AppRoutes: React.FC = () => (
  <IonRouterOutlet>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route
        exact
        path="/vehicle/:no_vehicle_registration"
        component={VehicleDetails}
      />{" "}
      <Route path="/red-flag" component={RedFlag} />
      <Route path="/investigations" component={VehicleSearch} />{" "}
      <Route path="/petrol" component={PetrolStationDashboard} />{" "}
      <Route path="/statistic/:station_id" component={StationStatistics} />



    </Switch>
  </IonRouterOutlet>
);

export default AppRoutes;
