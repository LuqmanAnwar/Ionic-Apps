"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
} from "@ionic/react"
import {
  carSport,
  timeOutline,
  locationOutline,
  alertCircleOutline,
  filterOutline,
  searchOutline,
  flashOutline,
  waterOutline,
  pulseOutline,
} from "ionicons/icons"
import { useHistory } from "react-router"
import "../style/styles.css"

// Define interfaces for our data
interface VehicleData {
  no_vehicle_registration: string
  state: string
  status: "High Potential" | "medium" | "Low Potential" // Changed from riskLevel to status
  total_volume: number // Added this line
  formatted_date: { $date: string } // Added this line
}

const VehicleSearch: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("")
  const [selectedState, setSelectedState] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [data, setData] = useState<VehicleData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
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
  ]

  const statusOptions = [
    { value: "High Potential", label: "High Potential" },
    { value: "Low Potential", label: "Low Potential" },
    { value: "", label: "None" },
  ]

  const history = useHistory()

  // Fetch data when search text or selected state changes
  useEffect(() => {
    fetchData()
  }, [searchText, selectedState, selectedStatus])

  const fetchData = async () => {
    setIsLoading(true)
    setData([])
    try {
      const url = "https://e74d-203-142-6-113.ngrok-free.app/api/vehicle1"

      // Create the request body
      const requestBody = {
        state: selectedState, // Send empty string if none selected
        no_vehicle_registration: searchText, // Send empty string if none entered
        status: selectedStatus, // Add status to request body
      }
      console.log("Request Body:", requestBody) // Log request body

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const json = await response.json()
      setData(json || []) // ✅ Ensure state updates with new data
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = (event: CustomEvent) => {
    setTimeout(() => {
      event.detail.complete()
    }, 1000)
  }

  const handleViewDetails = (no_vehicle_registration: string) => {
    history.push(`/vehicle/${no_vehicle_registration}`)
  }

  const getRiskBadgeColor = (status: string) => {
    switch (status) {
      case "High Potential":
        return "high-risk-badge"
      case "medium":
        return "warning"
      case "normal-badge":
        return "success"
      default:
        return "normal-badge"
    }
  }

  // Calculate percentage for progress bars
  const calculateVolumePercentage = (volume: number) => {
    const maxVolume = 250 // Assuming this is the max approved quota
    return Math.min((volume / maxVolume) * 100, 100)
  }

  return (
    <IonPage className="futuristic-dashboard light-theme">
      <IonHeader>
        <IonToolbar className="header-toolbar">
          <IonButtons slot="start">
            <IonButton className="back-button" onClick={() => history.push("/")}>
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

              <div className="filter-container">
                <IonItem lines="none" className="filter-item">
                  <IonLabel>Filter by State</IonLabel>
                  <IonSelect
                    value={selectedState}
                    onIonChange={(e) => setSelectedState(e.detail.value)}
                    interface="popover"
                    placeholder="Select state"
                    className="filter-select"
                  >
                    <IonSelectOption value="">All States</IonSelectOption>
                    {states.map((state) => (
                      <IonSelectOption key={state} value={state}>
                        {state}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>

                <IonItem lines="none" className="filter-item">
                  <IonLabel>Filter by Status</IonLabel>
                  <IonSelect
                    value={selectedStatus}
                    onIonChange={(e) => setSelectedStatus(e.detail.value)}
                    interface="popover"
                    placeholder="Select status"
                    className="filter-select"
                  >
                    <IonSelectOption value="">All Status</IonSelectOption>
                    {statusOptions.map((option) => (
                      <IonSelectOption key={option.value} value={option.value}>
                        {option.label}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
              </div>

              <IonButton expand="block" onClick={fetchData} className="search-button">
                <IonIcon slot="start" icon={filterOutline} />
                SEARCH
              </IonButton>
            </IonCardContent>
          </IonCard>

          <div className="stats-summary">
            <IonChip className="stat-chip high-risk">
              <IonIcon icon={alertCircleOutline} />
              <IonLabel>HIGH RISK: {data.filter((v: any) => v.status === "High Potential").length}</IonLabel>
            </IonChip>
          </div>

          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <IonCard key={`skeleton-${index}`} className="vehicle-card skeleton-card">
                <IonCardHeader>
                  <IonSkeletonText animated style={{ width: "60%", height: "24px" }} />
                </IonCardHeader>
                <IonCardContent>
                  <IonSkeletonText animated style={{ width: "100%", height: "100px" }} />
                </IonCardContent>
              </IonCard>
            ))
          ) : data.length > 0 ? (
            data.map((vehicle: any) => (
              <IonCard
                key={`${vehicle.no_vehicle_registration}-${vehicle.day_date}`} // Unique key
                className={`vehicle-card ${getRiskBadgeColor(vehicle.status)}`} // Keeps the styling
              >
                <div className="card-glow"></div>
                <IonCardHeader>
                  <div className="vehicle-header">
                    <IonCardTitle className="vehicle-title">
                      <IonIcon icon={carSport} className="vehicle-icon" />
                      {vehicle.no_vehicle_registration}
                    </IonCardTitle>
                    <IonBadge
                      className={`risk-badge ${getRiskBadgeColor(vehicle.status)}`} // Changed to use getRiskBadgeColor
                    >
                      {console.log("Vehicle Status:", vehicle.status)} {/* Log the status */}
                      {vehicle.status.toUpperCase()}
                    </IonBadge>
                  </div>
                  <IonCardSubtitle className="vehicle-location">
                    <IonIcon icon={locationOutline} className="location-icon" />
                    {vehicle.state}
                  </IonCardSubtitle>
                </IonCardHeader>

                <IonCardContent className="vehicle-content">
                  <IonGrid>
                    <IonRow>
                      <IonCol size="6">
                        <div className="data-section">
                          <div className="data-header">
                            <IonIcon icon={waterOutline} className="data-icon" />
                            <span className="data-label">DAILY PURCHASE</span>
                          </div>
                          <div className="data-value volume-value" style={{ marginLeft: "20px" }}>
                            {vehicle.total_volume} L
                          </div>
                          <div className="progress-container">
                            <IonProgressBar
                              value={calculateVolumePercentage(vehicle.total_volume) / 100}
                              className={`volume-progress ${vehicle.total_volume > 250 ? "high-volume" : "normal-volume"
                                }`}
                            ></IonProgressBar>
                          </div>
                        </div>
                      </IonCol>
                      <IonCol size="6">
                        <div className="data-section">
                          <div className="data-header">
                            <IonIcon icon={pulseOutline} className="data-icon" />
                            <span className="data-label">APPROVED QUOTA</span>
                          </div>
                          <div className="data-value" style={{ marginLeft: "20px" }}>
                            250 L
                          </div>
                        </div>
                      </IonCol>
                    </IonRow>

                    <IonRow>
                      {/* <IonCol size="6">
                        <div className="data-section">
                          <div className="data-header">
                            <IonIcon icon={analytics} className="data-icon" />
                            <span className="data-label">TRANSACTIONS</span>
                          </div>
                          <div className="data-value">-</div>
                        </div>
                      </IonCol> */}
                      <IonCol size="6">
                        <div className="data-section">
                          <div className="data-header">
                            <IonIcon icon={timeOutline} className="data-icon" />
                            <span className="data-label">LAST ACTIVITY</span>
                          </div>
                          <div className="data-value time-value" style={{ fontSize: "13px", marginLeft: "22px" }}>
                            {new Date(vehicle.day_date).toLocaleString("en-MY", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                      </IonCol>
                    </IonRow>
                  </IonGrid>

                  <IonButton
                    expand="block"
                    onClick={() => handleViewDetails(vehicle.no_vehicle_registration)}
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
  )
}

export default VehicleSearch

