"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonIcon,
  IonButton,
  IonButtons,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonSkeletonText,
} from "@ionic/react";
import {
  locationOutline,
  analyticsOutline,
  timeOutline,
  alertCircleOutline,
  businessOutline,
  carSportOutline,
  waterOutline,
  flashOutline,
  statsChartOutline,
  arrowBackOutline,
  downloadOutline,
} from "ionicons/icons";
import { useParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../style/styles.css";
import { useHistory } from "react-router";

// Define interfaces for our data
interface StationStatistics {
  formatted_date: string;
  quota_approved: number;
  station_name: string;
  state: string;
  status: string;
  total_volume: number;
  unique_vehicles: string;
  transaction_count: number;
  station_id: string;
  day_date: string;
}

interface TransactionData {
  id: string;
  no_pendaftaran_kenderaan: string;
  kuota_guna_liter: number;
  fmt_datetime: string;
  status: string;
  nama_lokasi_stesen_minyak1: string;
}

const StationStatistics: React.FC = () => {
  const { station_id } = useParams<{ station_id: string }>();
  const { station_name } = useParams<{ station_name: string }>();
  const [statistics, setStatistics] = useState<StationStatistics | null>(null);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState<boolean>(true);
  const history = useHistory();
  const [volumeData, setVolumeData] = useState<any[]>([]); // State to hold volume data
  const [transactionData, setTransactionsByHour] = useState<any[]>([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const [selectedDate, setSelectedDate] = useState<string | null>(query.get('date'));




  useEffect(() => {
    console.log("Station ID:", station_id);
    console.log("Selected Date:", selectedDate);

    const fetchDataAndTransactions = async () => {
      if (station_id) {
        // Fetch station data
        await fetchData(station_id, selectedDate || ""); // Pass selectedDate here
      }
    };

    fetchDataAndTransactions();
  }, [station_id, selectedDate]);// Only depend on station ID

  useEffect(() => {
    if (statistics && statistics.station_id) {
      const stationName = statistics.station_name;
      console.log("Statistic", statistics)
      console.log("Station Name:", stationName);

      if (stationName) {
        fetchTransactions(stationName); // Fetch transactions when statistics are updated
        fetchVolumePerDay(stationName); // Fetch volume per day when statistics are updated
        fetchBarPerDay(stationName); // Fetch transactions per day when statistics are updated

      }
    }
  }, [statistics]); // Add statistics to the dependency array





  const fetchData = async (station_id: string, day_date: string) => {
    setIsLoading(true);
    try {
      const url = "https://e74d-203-142-6-113.ngrok-free.app/api/petrol2"; // Update with the correct endpoint
      const requestBody = {
        station_id: station_id,
        day_date: day_date,
      };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json: StationStatistics[] = await response.json();
      setStatistics(json.length > 0 ? json[0] : null); // Set to the first item or null
    } catch (error) {
      console.error("Error fetching station data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactions = async (stationName: string) => {
    console.log("Fetching transactions for:", stationName); // Log the request body

    setIsLoadingTransactions(true);
    try {
      const url = "https://e74d-203-142-6-113.ngrok-free.app/api/vehicle2"; // Update with the correct endpoint
      const requestBody = {
        station_name: stationName

      };
      console.log("Fetching transactions for:", requestBody); // Log the request body


      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json: TransactionData[] = await response.json();
      console.log("Fetched Transactions:", json); // Log the fetched transactions
      setTransactions(json);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoadingTransactions(false);
    }
  };


  const getRiskBadgeColor = (status: string | undefined) => {
    switch (status) {
      case "High Potential":
        return "danger";
      case "Medium Potential":
        return "warning";
      case "Low Potential":
        return "success";
      default:
        return "medium";
    }
  };


  const fetchVolumePerDay = async (stationName: string) => {
    setIsLoading(true);
    try {
      const url = "https://e74d-203-142-6-113.ngrok-free.app/api/volume_per_day"; // Update with the correct endpoint
      const requestBody = { station_name: stationName };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      console.log("Fetched Volume Per Day:", json); // Log the fetched data
      setVolumeData(json); // Set the volume data
    } catch (error) {
      console.error("Error fetching volume data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBarPerDay = async (stationName: string) => {
    setIsLoading(true);
    try {
      const url = "https://e74d-203-142-6-113.ngrok-free.app/api/transactions_per_day"; // Update with the correct endpoint
      const requestBody = { station_name: stationName };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      console.log("Fetched Transactions Per Day:", json); // Log the fetched data
      setTransactionsByHour(json); // Assuming you have a state to hold this data
    } catch (error) {
      console.error("Error fetching transactions per day:", error);
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return (
      <IonPage className="futuristic-dashboard light-theme">
        <IonHeader>
          <IonToolbar className="header-toolbar">
            <IonButtons slot="start">
              <IonButton className="back-button" onClick={() => history.goBack()}>
                <IonIcon icon={arrowBackOutline} />
                <span className="back-text">Back</span>
              </IonButton>
            </IonButtons>
            <IonTitle className="main-title">
              <IonIcon icon={flashOutline} className="title-icon pulse-icon" />
              LOADING STATISTICS...
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="dashboard-content">
          <div className="search-container">
            <IonCard className="station-card skeleton-card">
              <IonCardHeader>
                <IonSkeletonText animated style={{ width: "60%", height: "24px" }} />
              </IonCardHeader>
              <IonCardContent>
                <IonSkeletonText animated style={{ width: "100%", height: "200px" }} />
              </IonCardContent>
            </IonCard>
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
            <IonButton className="back-button" onClick={() => history.goBack()}>
              <IonIcon icon={arrowBackOutline} />
              <span className="back-text">Back</span>
            </IonButton>
          </IonButtons>
          <IonTitle className="main-title">
            <IonIcon icon={flashOutline} className="title-icon pulse-icon" />
            STATION STATISTICS
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="dashboard-content">
        <div className="search-container">
          <IonCard className="station-card">
            <IonCardHeader>
              <IonCardTitle className="station-title">
                <IonIcon icon={businessOutline} className="station-icon" />
                {statistics?.station_name}
              </IonCardTitle>
              <div className="station-location">
                <IonIcon icon={locationOutline} className="location-icon" />
                {statistics?.state}
              </div>
            </IonCardHeader>

            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol size="6" sizeMd="3">
                    <div className="data-section">
                      <div className="data-header">
                        <IonIcon icon={waterOutline} className="data-icon" />
                        <span className="data-label">TOTAL VOLUME</span>
                      </div>
                      <div className="data-value volume-value">{statistics?.total_volume ? statistics.total_volume.toLocaleString() : "N/A"} L</div>
                    </div>
                  </IonCol>
                  <IonCol size="6" sizeMd="3">
                    <div className="data-section">
                      <div className="data-header">
                        <IonIcon icon={carSportOutline} className="data-icon" />
                        <span className="data-label">UNIQUE VEHICLES</span>
                      </div>
                      <div className="data-value">{statistics?.unique_vehicles}</div>
                    </div>
                  </IonCol>
                  <IonCol size="6" sizeMd="3">
                    <div className="data-section">
                      <div className="data-header">
                        <IonIcon icon={analyticsOutline} className="data-icon" />
                        <span className="data-label">TRANSACTIONS</span>
                      </div>
                      <div className="data-value">{statistics?.transaction_count}</div>
                    </div>
                  </IonCol>
                  <IonCol size="6" sizeMd="3">
                    <div className="data-section">
                      <div className="data-header">
                        <IonIcon icon={alertCircleOutline} className="data-icon" />
                        <span className="data-label">STATUS</span>
                      </div>
                      <div className="data-value risk-value">
                        <IonBadge className={`transaction-badge ${getRiskBadgeColor(statistics?.status)}`}>
                          {statistics?.status}
                        </IonBadge>
                      </div>
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>

          {/* Volume by Hour Chart */}
          <IonCard className="chart-card">
            <IonCardHeader>
              <IonCardTitle className="chart-title">
                <IonIcon icon={waterOutline} className="chart-icon" />
                Daily Volume by Petrol Station
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="chart-content">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={volumeData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={false} />
                  <YAxis tick={{ fill: "#666666" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="total_volume" stroke="#0072ff" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </IonCardContent>
          </IonCard>

          {/* Transactions by Hour Chart */}
          <IonCard className="chart-card">
            <IonCardHeader>
              <IonCardTitle className="chart-title">
                <IonIcon icon={statsChartOutline} className="chart-icon" />
                Transactions by Hour
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="chart-content">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={transactionData} margin={{ top: 5, right: 15, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fill: "#666666" }} tickFormatter={(value) => value.split(":")[0]} />
                  <YAxis tick={{ fill: "#666666" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="transaction_count" name="Transaction Count" fill="#0072ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </IonCardContent>
          </IonCard>

          {/* Transactions Table */}
          <IonCard className="transactions-card">
            <IonCardHeader>
              <div className="transactions-header">
                <IonCardTitle className="transactions-title">
                  <IonIcon icon={timeOutline} className="transactions-icon" />
                  Recent Transactions
                </IonCardTitle>
                <IonButton className="export-button" size="small">
                  <IonIcon icon={downloadOutline} slot="start" />
                  Export
                </IonButton>
              </div>
            </IonCardHeader>
            <IonCardContent>
              {isLoadingTransactions ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <IonItem key={`skeleton-${index}`} className="transaction-skeleton">
                    <IonSkeletonText animated style={{ width: "100%", height: "60px" }} />
                  </IonItem >))
              ) : (
                <IonList className="transaction-list">
                  {transactions.map((transaction, index) => (
                    <IonItem key={index} className="transaction-item">
                      <IonGrid className="transaction-grid">
                        <IonRow>
                          <IonCol size="6">
                            <div className="transaction-car">
                              <IonIcon icon={carSportOutline} className="transaction-icon" />
                              <strong>{transaction.no_pendaftaran_kenderaan}</strong>
                            </div>
                          </IonCol>
                          <IonCol size="6" className="ion-text-end">
                            <IonBadge className={`transaction-badge ${getRiskBadgeColor(transaction.status)}`}>
                              {transaction.status}
                            </IonBadge>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size="6">
                            <div className="transaction-volume">
                              <IonIcon icon={waterOutline} className="transaction-icon" />
                              {transaction.kuota_guna_liter} L
                            </div>
                          </IonCol>
                          <IonCol size="6" className="ion-text-end">
                            <div className="transaction-time">
                              <IonIcon icon={timeOutline} className="transaction-icon" />
                              {new Date(transaction.fmt_datetime).toLocaleString("en-MY", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonItem>
                  ))}
                </IonList>
              )}
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default StationStatistics;