"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
  IonIcon,
  IonButton,
  IonButtons,
  IonRefresher,
  IonRefresherContent,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonLabel,
  IonItem,
  IonSkeletonText,
  IonProgressBar,
} from "@ionic/react";
import {
  carSport,
  analytics,
  timeOutline,
  locationOutline,
  alertCircleOutline,
  filterOutline,
  searchOutline,
  flashOutline,
  waterOutline,
  pulseOutline,
} from "ionicons/icons";
import { useHistory } from "react-router";
import "../style/styles.css";

// Define interfaces for our data
interface VehicleData {
  no_pendaftaran_kenderaan: string;
  regNumber: string;
  state: string;
  dailyPurchase: number;
  approvedQuota: number;
  transactionCount: number;
  lastTransaction: string;
  riskLevel: "High Potential" | "medium" | "Low Potential";
}

const VehicleSearch: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [data, setData] = useState<VehicleData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const states = [
    "Selangor",
    "Johor",
    "Pahang",
    "W.P. Kuala Lumpur",
    "Perak",
    "Terengganu",
    "Kedah",
    "Kelantan",
    "Melaka",
    "Pulau Pinang",
    "Negeri Sembilan",
    "Perlis",
    "Sabah",
  ];

  const history = useHistory();

  // Fetch data when search text or selected state changes
  useEffect(() => {
    fetchData();
  }, [searchText, selectedState]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const url = "https://e74d-203-142-6-113.ngrok-free.app/api/vehicle1";
  
      // Create the request body
      const requestBody = {
        state: selectedState || "", // Send empty string if none selected
        no_pendaftaran_kenderaan: searchText || "", // Send empty string if none entered
      };
  
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const json = await response.json();
  
      // Access the high potential vehicles and latest transactions
      const highPotentialVehicles = json.high_potential_vehicles || [];
      const latestTransactions = json.latest_transactions || [];
  
      // Combine the data
      const combinedData = [
        ...highPotentialVehicles,
        ...latestTransactions,
      ];
  

  
      setData(combinedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = (event: CustomEvent) => {
    setTimeout(() => {
      event.detail.complete();
    }, 1000);
  };

  const handleViewDetails = (no_pendaftaran_kenderaan: string) => {
    history.push(`/vehicle/${no_pendaftaran_kenderaan}`);
  };

  const getRiskBadgeColor = (status: string) => {
    switch (status) {
      case "High Potential":
        return "danger";
      case "medium":
        return "warning";
      case "Low Potential":
        return "success";
      default:
        return "medium";
    }
  };

  // Calculate percentage for progress bars
  const calculateVolumePercentage = (volume: number) => {
    const maxVolume = 250; // Assuming this is the max approved quota
    return Math.min((volume / maxVolume) * 100, 100);
  };

  return (
    <IonPage className="futuristic-dashboard light-theme">
      <IonHeader>
        <IonToolbar className="header-toolbar">
          <IonButtons slot="start">
            <IonButton
              className="back-button"
              onClick={() => history.push("/")}
            >
              <span className="back-text">Back</span>
            </IonButton>
          </IonButtons>
          <IonTitle className="main-title">
            <IonIcon icon={flashOutline} className="title-icon pulse-icon" />
            DIESEL TRACKER
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="dashboard-content">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="search-container">
          <IonCard className="search-card">
            <IonCardHeader>
              <IonCardTitle className="search-title">
                <IonIcon icon={searchOutline} className="search-icon" />
                SEARCH VEHICLES
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonSearchbar
                value={searchText}
                onIonChange={(e) => setSearchText(e.detail.value || "")}
                placeholder="Enter vehicle number"
                animated
                className="futuristic-searchbar"
              />

              <div className="state-filter">
                <IonItem lines="none" className="state-select-item">
                  <IonLabel>Filter by State</IonLabel>
                  <IonSelect
                    value={selectedState}
                    onIonChange={(e) => setSelectedState(e.detail.value)}
                    interface="popover"
                    placeholder="Select state"
                    className="state-select"
                  >
                    <IonSelectOption value="">All States</IonSelectOption>
                    {states.map((state) => (
                      <IonSelectOption key={state} value={state}>
                        {state}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
              </div>

              <IonButton
                expand="block"
                onClick={fetchData}
                className="search-button"
              >
                <IonIcon slot="start" icon={filterOutline} />
                SEARCH
              </IonButton>
            </IonCardContent>
          </IonCard>

          <div className="stats-summary">
            <IonChip className="stat-chip high-risk">
              <IonIcon icon={alertCircleOutline} />
              <IonLabel>
                HIGH RISK:{" "}
                {data.filter((v: any) => v.status === "High Potential").length}
              </IonLabel>
            </IonChip>
          </div>

          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <IonCard
                key={`skeleton-${index}`}
                className="vehicle-card skeleton-card"
              >
                <IonCardHeader>
                  <IonSkeletonText
                    animated
                    style={{ width: "60%", height: "24px" }}
                  />
                </IonCardHeader>
                <IonCardContent>
                  <IonSkeletonText
                    animated
                    style={{ width: "100%", height: "100px" }}
                  />
                </IonCardContent>
              </IonCard>
            ))
          ) : data.length > 0 ? (
            data.map((vehicle: any) => (
              <IonCard
                key={vehicle.no_pendaftaran_kenderaan}
                className={`vehicle-card ${
                  vehicle.status === "High Potential"
                    ? "high-risk-card"
                    : "normal-card"
                }`}
              >
                <div className="card-glow"></div>
                <IonCardHeader>
                  <div className="vehicle-header">
                    <IonCardTitle className="vehicle-title">
                      <IonIcon icon={carSport} className="vehicle-icon" />
                      {vehicle.no_pendaftaran_kenderaan}
                    </IonCardTitle>
                    <IonBadge
                      className={`risk-badge ${
                        vehicle.status === "High Potential"
                          ? "high-risk-badge"
                          : "normal-badge"
                      }`}
                    >
                      {vehicle?.status?.toUpperCase()}
                    </IonBadge>
                  </div>
                  <IonCardSubtitle className="vehicle-location">
                    <IonIcon icon={locationOutline} className="location-icon" />
                    {vehicle.state_2}
                  </IonCardSubtitle>
                </IonCardHeader>

                <IonCardContent className="vehicle-content">
                  <IonGrid>
                    <IonRow>
                      <IonCol size="6">
                        <div className="data-section">
                          <div className="data-header">
                            <IonIcon
                              icon={waterOutline}
                              className="data-icon"
                            />
                            <span className="data-label">DAILY PURCHASE</span>
                          </div>
                          <div
                            className="data-value volume-value"
                            style={{ marginLeft: "20px" }}
                          >
                            {vehicle.kuota_guna_liter_sum} L
                          </div>
                          <div className="progress-container">
                            <IonProgressBar
                              value={
                                calculateVolumePercentage(
                                  vehicle.kuota_guna_liter_sum
                                ) / 100
                              }
                              className={`volume-progress ${
                                vehicle.kuota_guna_liter_sum > 250
                                  ? "high-volume"
                                  : "normal-volume"
                              }`}
                            ></IonProgressBar>
                          </div>
                        </div>
                      </IonCol>
                      <IonCol size="6">
                        <div className="data-section">
                          <div className="data-header">
                            <IonIcon
                              icon={pulseOutline}
                              className="data-icon"
                            />
                            <span className="data-label">APPROVED QUOTA</span>
                          </div>
                          <div
                            className="data-value"
                            style={{ marginLeft: "20px" }}
                          >
                            250 L
                          </div>
                        </div>
                      </IonCol>
                    </IonRow>

                    <IonRow>
                      <IonCol size="6">
                        <div className="data-section">
                          <div className="data-header">
                            <IonIcon icon={analytics} className="data-icon" />
                            <span className="data-label">TRANSACTIONS</span>
                          </div>
                          <div className="data-value">-</div>
                        </div>
                      </IonCol>
                      <IonCol size="6">
                        <div className="data-section">
                          <div className="data-header">
                            <IonIcon icon={timeOutline} className="data-icon" />
                            <span className="data-label">LAST ACTIVITY</span>
                          </div>
                          <div
                            className="data-value time-value"
                            style={{ fontSize: "13px", marginLeft: "22px" }}
                          >
                            {new Date(vehicle.fmt_datetime).toLocaleString(
                              "en-MY",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        </div>
                      </IonCol>
                    </IonRow>
                  </IonGrid>

                  <IonButton
                    expand="block"
                    onClick={() =>
                      handleViewDetails(vehicle.no_pendaftaran_kenderaan)
                    }
                    className="view-details-button"
                  >
                    View Details
                  </IonButton>
                </IonCardContent>
              </IonCard>
            ))
          ) : (
            <div className="no-results">
              <IonIcon icon={searchOutline} className="no-results-icon" />
              <h4>No vehicles found</h4>
              <p>Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default VehicleSearch;
