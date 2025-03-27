"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonGrid,
  IonRow,
  IonCol,
  IonSkeletonText,
  IonProgressBar,
} from "@ionic/react";
import {
  carSport,
  timeOutline,
  locationOutline,
  alertCircleOutline,
  trendingUpOutline,
  warningOutline,
  checkmarkCircleOutline,
  flagOutline,
  flashOutline,
  waterOutline,
  pulseOutline,
} from "ionicons/icons";
import { useParams } from "react-router-dom";
import "../style/styles.css";
import "./Home.css"
import VehicleMap from "./vehicle-map";


// Define interfaces for our data
interface VehicleDetails {
  no_vehicle_registration: string;
  regNumber: string; // <-- Add this line for state
  state: string;
  dailyPurchase: number;
  approvedQuota: number;
  transactionCount: number;
  lastTransaction: string;
  riskLevel: "high" | "medium" | "low";
  owner: string;
  vehicleType: string;
  registrationDate: string;
  transactions: Transaction[];
  flags: Flag[];
  account_name: string;
  vehicle_sector: string;
  status: string;
  volume_liter: number;
}

interface Transaction {

  formatted_date: { $date: string };
  kategori_kenderaan: string;
  volume_liter: number;
  kuota_lulus_liter: number;
  time_transaction: string;
  station_name: string;
  no_vehicle_registration: string;
  account_name: string;
  vehicle_sector: string;
  state: string;
  status: string;
}

interface Flag {
  no_vehicle_registration: string;
  type: string;
  description: string;
  date: string;
  severity: "high" | "medium" | "low";
}

const VehicleDetails: React.FC = () => {
  const [vehicle, setVehicle] = useState<VehicleDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Using `useParams` to get the route parameter
  const { no_vehicle_registration } = useParams<{
    no_vehicle_registration: string;
  }>();

  // Fetch vehicle data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const url = "https://e74d-203-142-6-113.ngrok-free.app/api/vehicle2";

      const requestBody = {
        no_vehicle_registration: no_vehicle_registration || "", // Use no_vehicle_registration
      };
      console.log("number of data fetch")

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
      console.log("API Response:", json); // Log the response

      // Filter transactions based on no_vehicle_registration
      const filteredTransactions = json.filter(
        (transaction: Transaction) =>
          transaction.no_vehicle_registration === no_vehicle_registration
      );

      if (filteredTransactions.length > 0) {
        // Create a vehicle object with the filtered transactions
        const vehicleData: VehicleDetails = {
          no_vehicle_registration: no_vehicle_registration || "", // Change this line
          regNumber: no_vehicle_registration || "",
          state: filteredTransactions[0].state || "N/A",
          dailyPurchase: filteredTransactions.reduce(
            (sum: number, transaction: Transaction) =>
              sum + transaction.volume_liter,
            0
          ),
          approvedQuota: filteredTransactions[0].kuota_lulus_liter || 0,
          transactionCount: filteredTransactions.length,
          lastTransaction: filteredTransactions[0].formatted_date || "N/A",
          riskLevel:
            filteredTransactions[0].status === "High Potential"
              ? "high"
              : filteredTransactions[0].status === "Low Potential"
                ? "medium"
                : "low",
          owner: filteredTransactions[0].account_name || "N/A",
          vehicleType: filteredTransactions[0].vehicle_sector || "N/A",
          registrationDate: filteredTransactions[0].tarikh1 || "N/A",
          transactions: filteredTransactions, // Set the filtered transactions
          flags: [], // You can add flags if needed
          account_name: filteredTransactions[0].account_name || "N/A",
          vehicle_sector: filteredTransactions[0].vehicle_sector || "N/A",
          status: filteredTransactions[0].status || "N/A",
          volume_liter: filteredTransactions.reduce(
            (sum: number, transaction: Transaction) =>
              sum + transaction.volume_liter,
            0
          ),
        };

        setVehicle(vehicleData); // Set the vehicle state
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (no_vehicle_registration) {
      fetchData();
    }
  }, [no_vehicle_registration]);

  // Calculate percentage for progress bars
  const calculateVolumePercentage = (volume: number) => {
    const maxVolume = 250; // Assuming this is the max approved quota
    return Math.min((volume / maxVolume) * 100, 100);
  };

  if (isLoading) {
    return (
      <IonPage className="futuristic-dashboard light-theme">
        <IonHeader>
          <IonToolbar className="header-toolbar">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/vehicle-search" />
            </IonButtons>
            <IonTitle className="main-title">Loading...</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="dashboard-content">
          <IonCard className="vehicle-card skeleton-card">
            <IonCardHeader>
              <IonSkeletonText
                animated
                style={{ width: "60%", height: "24px" }}
              />
            </IonCardHeader>
            <IonCardContent>
              <IonSkeletonText
                animated
                style={{ width: "100%", height: "200px" }}
              />
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    );
  }


  if (!vehicle) {
    return (
      <IonPage className="futuristic-dashboard light-theme">
        <IonHeader>
          <IonToolbar className="header-toolbar">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/vehicle-search" />
            </IonButtons>
            <IonTitle className="main-title">Vehicle Not Found</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="dashboard-content">
          <div className="no-results">
            <h2>Vehicle not found</h2>
            <p>The requested vehicle information could not be found.</p>
            <IonButton routerLink="/vehicle-search" className="search-button">
              Back to Search
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage className="futuristic-dashboard light-theme">
      <IonHeader>
        <IonToolbar className="header-toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/vehicle-search" />
          </IonButtons>
          <IonTitle className="main-title">
            <IonIcon icon={flashOutline} className="title-icon pulse-icon" />
            VEHICLE DETAILS
          </IonTitle>
        </IonToolbar>
      </IonHeader>



      <IonContent className="dashboard-content">
        <div className="content-container">

          <IonCard>
            <div className="station-map-section">
              <h2 className="section-title">
                <IonIcon icon={locationOutline} className="section-icon" />
                Petrol Station Risk Map
              </h2>
              <VehicleMap />
            </div></IonCard>


          {/* Vehicle Header Card */}
          <IonCard className="vehicle-card">
            <IonCardHeader>
              <div className="vehicle-header">
                <IonCardTitle className="vehicle-title">
                  <IonIcon icon={carSport} className="vehicle-icon" />
                  {vehicle.regNumber}
                </IonCardTitle>
                <IonBadge
                  className={`risk-badge ${vehicle.status === "High Potential"
                    ? "high-risk-badge"
                    : "normal-badge"
                    }`}
                >
                  {vehicle.status ? vehicle.status.toUpperCase() : "UNKNOWN"}{" "}
                  RISK
                </IonBadge>
              </div>
            </IonCardHeader>



            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol size="6">
                    <div className="data-section">
                      <div className="data-header">
                        <IonIcon icon={locationOutline} className="data-icon" />
                        <span className="data-label">STATE</span>
                      </div>
                      <div className="data-value">
                        {vehicle.state || "N/A"}
                      </div>
                    </div>
                  </IonCol>
                  <IonCol size="6">
                    <div className="data-section">
                      <div className="data-header">
                        <IonIcon icon={carSport} className="data-icon" />
                        <span className="data-label">VEHICLE TYPE</span>
                      </div>
                      <div className="data-value">
                        {vehicle.vehicle_sector || "N/A"}
                      </div>
                    </div>
                  </IonCol>
                </IonRow>

                <IonRow>
                  <IonCol size="12">
                    <div className="data-section">
                      <div className="data-header">
                        <IonIcon icon={flagOutline} className="data-icon" />
                        <span className="data-label">OWNER</span>
                      </div>
                      <div className="data-value">
                        {vehicle.account_name || "N/A"}
                      </div>
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>

              <div className="consumption-summary">
                <h4 className="summary-title">
                  <IonIcon icon={trendingUpOutline} className="summary-icon" />
                  Consumption Summary
                </h4>

                <IonGrid>
                  <IonRow>
                    <IonCol size="6">
                      <div className="data-section">
                        <div
                          className="data-header"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <IonIcon
                            icon={waterOutline}
                            className="data-icon"
                            style={{ marginLeft: "-5px" }}
                          />
                          <span
                            className="data-label"
                            style={{ marginLeft: "5px" }}
                          >
                            DAILY PURCHASE
                          </span>
                        </div>
                        <div
                          className="data-value volume-value"
                          style={{ marginLeft: "20px" }}
                        >
                          {vehicle.volume_liter} L
                        </div>
                        <div className="progress-container">
                          <IonProgressBar
                            value={
                              calculateVolumePercentage(
                                vehicle.volume_liter
                              ) / 100
                            }
                            className={`volume-progress ${vehicle.volume_liter > 250
                              ? "high-volume"
                              : "normal-volume"
                              }`}
                          ></IonProgressBar>
                        </div>
                      </div>
                    </IonCol>
                    <IonCol size="6">
                      <div className="data-section">
                        <div
                          className="data-header"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <IonIcon icon={pulseOutline} className="data-icon" />
                          <span
                            className="data-label"
                            style={{ marginLeft: "5px" }}
                          >
                            APPROVED QUOTA
                          </span>
                        </div>
                        <div
                          className="data-value"
                          style={{ marginLeft: "25px" }}
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
                          <IonIcon icon={timeOutline} className="data-icon" />
                          <span className="data-label">
                            NUMBER OF TRANSACTIONS
                          </span>
                        </div>
                        <div
                          className="data-value"
                          style={{ marginLeft: "15px" }}
                        >
                          {vehicle.transactionCount}
                        </div>
                      </div>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Recent Transactions */}
          <IonCard className="transactions-card">
            <IonCardHeader>
              <IonCardTitle className="card-title">
                <IonIcon icon={timeOutline} className="card-title-icon" />
                Recent Transactions
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <IonList className="transaction-list">
                {Array.isArray(vehicle.transactions) &&
                  vehicle.transactions.length > 0 ? (
                  vehicle.transactions.map((transaction, index) => (
                    <IonItem key={index} className="transaction-item">
                      <IonLabel>
                        <h3>{transaction.volume_liter} L</h3>
                        <p>{transaction.station_name}</p>
                        <p className="transaction-date">
                          {new Date(transaction.formatted_date?.$date).toLocaleString(
                            "en-MY",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",

                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </IonLabel>
                      <IonBadge
                        color="medium"
                        slot="end"
                        className="station-badge"
                      ></IonBadge>
                    </IonItem>
                  ))
                ) : (
                  <IonItem>
                    <IonLabel>No transactions available.</IonLabel>
                  </IonItem>
                )}
              </IonList>
            </IonCardContent>
          </IonCard>

          {/* Action Buttons */}
          <div className="action-buttons">
            <IonButton expand="block" className="export-button">
              Export Report
            </IonButton>
            <IonButton expand="block" className="flag-button">
              Flag for Investigation
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default VehicleDetails;
