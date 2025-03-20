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
  no_pendaftaran_kenderaan: string;
  regNumber: string;
  state_2: string; // <-- Add this line for state_2
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
  pemegang_akaun1: string; // <-- Added this property
  sektor_kenderaan1: string;
  status: string;
  kuota_guna_liter_sum: number; // <-- Added this property
}

interface Transaction {
  address: string;
  district: string;
  fmt_datetime: string;
  jenis_fleet_card1: string;
  kategori_kenderaan: string;
  kuota_guna_liter: number;
  kuota_lulus_liter: number;
  lat: number;
  lng: number;
  masa_transaksi: string;
  nama__lokasi_stesen_minyak: string;
  nama_lokasi_stesen_minyak1: string;
  negeri: string;
  no_subsidi: string;
  no_pendaftaran_kenderaan: string;
  pemegang_akaun1: string;
  sektor_kenderaan1: string;
  state_2: string;
  status: string;
  status_df1: string;
  status_df2: string;
  tarikh1: string;
  transaction_count_daily: number;
}

interface Flag {
  no_pendaftaran_kenderaan: string;
  type: string;
  description: string;
  date: string;
  severity: "high" | "medium" | "low";
}

const VehicleDetails: React.FC = () => {
  const [vehicle, setVehicle] = useState<VehicleDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Using `useParams` to get the route parameter
  const { no_pendaftaran_kenderaan } = useParams<{
    no_pendaftaran_kenderaan: string;
  }>();

  // Fetch vehicle data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const url = "https://e74d-203-142-6-113.ngrok-free.app/api/vehicle2";

      const requestBody = {
        no_pendaftaran_kenderaan: no_pendaftaran_kenderaan || "", // Use no_pendaftaran_kenderaan
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

      // Filter transactions based on no_pendaftaran_kenderaan
      const filteredTransactions = json.filter(
        (transaction: Transaction) =>
          transaction.no_pendaftaran_kenderaan === no_pendaftaran_kenderaan
      );

      if (filteredTransactions.length > 0) {
        // Create a vehicle object with the filtered transactions
        const vehicleData: VehicleDetails = {
          no_pendaftaran_kenderaan: no_pendaftaran_kenderaan || "", // Change this line
          regNumber: no_pendaftaran_kenderaan || "",
          state_2: filteredTransactions[0].state_2 || "N/A",
          state: filteredTransactions[0].negeri || "N/A",
          dailyPurchase: filteredTransactions.reduce(
            (sum: number, transaction: Transaction) =>
              sum + transaction.kuota_guna_liter,
            0
          ),
          approvedQuota: filteredTransactions[0].kuota_lulus_liter || 0,
          transactionCount: filteredTransactions.length,
          lastTransaction: filteredTransactions[0].fmt_datetime || "N/A",
          riskLevel:
            filteredTransactions[0].status === "High Potential"
              ? "high"
              : filteredTransactions[0].status === "Low Potential"
                ? "medium"
                : "low",
          owner: filteredTransactions[0].pemegang_akaun1 || "N/A",
          vehicleType: filteredTransactions[0].sektor_kenderaan1 || "N/A",
          registrationDate: filteredTransactions[0].tarikh1 || "N/A",
          transactions: filteredTransactions, // Set the filtered transactions
          flags: [], // You can add flags if needed
          pemegang_akaun1: filteredTransactions[0].pemegang_akaun1 || "N/A",
          sektor_kenderaan1: filteredTransactions[0].sektor_kenderaan1 || "N/A",
          status: filteredTransactions[0].status || "N/A",
          kuota_guna_liter_sum: filteredTransactions.reduce(
            (sum: number, transaction: Transaction) =>
              sum + transaction.kuota_guna_liter,
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
    if (no_pendaftaran_kenderaan) {
      fetchData();
    }
  }, [no_pendaftaran_kenderaan]);

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
                        {vehicle.state_2 || "N/A"}
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
                        {vehicle.sektor_kenderaan1 || "N/A"}
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
                        {vehicle.pemegang_akaun1 || "N/A"}
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
                          {vehicle.kuota_guna_liter_sum} L
                        </div>
                        <div className="progress-container">
                          <IonProgressBar
                            value={
                              calculateVolumePercentage(
                                vehicle.kuota_guna_liter_sum
                              ) / 100
                            }
                            className={`volume-progress ${vehicle.kuota_guna_liter_sum > 250
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
                        <h3>{transaction.kuota_guna_liter} L</h3>
                        <p>{transaction.address}</p>
                        <p className="transaction-date">
                          {new Date(transaction.fmt_datetime).toLocaleString(
                            "en-MY",
                            {
                              month: "short",
                              day: "numeric",
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
                      >
                        {transaction.nama_lokasi_stesen_minyak1}
                      </IonBadge>
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
