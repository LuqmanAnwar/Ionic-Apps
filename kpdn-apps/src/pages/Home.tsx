"use client"

import type React from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react"
import {
  carSportOutline,
  businessOutline,
  analyticsOutline,
  alertCircleOutline,
  flashOutline,
  arrowForwardOutline,
  waterOutline,
  statsChartOutline,
  timeOutline,
  searchOutline,
  locationOutline,
} from "ionicons/icons"
import { useHistory } from "react-router-dom"
import "./Home.css"
import "./map-styles.css"
import StationMap from "./station-map"

const Home: React.FC = () => {
  const history = useHistory()

  // Mock data for dashboard summary
  const summaryData = {
    highRiskVehicles: 913,
    highRiskStations: 45,
    numberOfStation: 3675,
    numberOfVehicle: 211395,
  }

  return (
    <IonPage className="futuristic-dashboard light-theme">
      <IonHeader>
        <IonToolbar className="header-toolbar">
          <IonTitle className="main-title">
            <IonIcon icon={flashOutline} className="title-icon pulse-icon" />
            DIESEL SUBSIDY ANALYSIS
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="dashboard-content">
        {/* Hero Banner Section */}
        <div className="hero-banner">
          <div className="hero-content">
            <h1 className="hero-title">DIESEL SUBSIDY INVESTIGATION</h1>
            <p className="hero-subtitle">
              Advanced analytics platform for monitoring and investigating diesel subsidy usage patterns
            </p>
            <div className="hero-actions"></div>
          </div>
          <div className="hero-overlay"></div>
        </div>

        {/* Dashboard Summary */}
        <div className="dashboard-summary">
          <h2 className="section-title">
            <IonIcon icon={analyticsOutline} className="section-icon" />
            Dashboard Summary
          </h2>

          <IonGrid>
            <IonRow>
              <IonCol size="6" sizeMd="3">
                <IonCard className="summary-card">
                  <IonCardContent className="summary-content">
                    <div className="summary-icon-container danger">
                      <IonIcon icon={alertCircleOutline} className="summary-icon" />
                    </div>
                    <div className="summary-details">
                      <h3 className="summary-value">{summaryData.highRiskVehicles}</h3>
                      <p className="summary-label">High Risk Vehicles</p>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              <IonCol size="6" sizeMd="3">
                <IonCard className="summary-card">
                  <IonCardContent className="summary-content">
                    <div className="summary-icon-container warning">
                      <IonIcon icon={businessOutline} className="summary-icon" />
                    </div>
                    <div className="summary-details">
                      <h3 className="summary-value">{summaryData.highRiskStations}</h3>
                      <p className="summary-label">High Risk Stations</p>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              <IonCol size="6" sizeMd="3">
                <IonCard className="summary-card">
                  <IonCardContent className="summary-content">
                    <div className="summary-icon-container primary">
                      <IonIcon icon={businessOutline} className="summary-icon" />
                    </div>
                    <div className="summary-details">
                      <h3 className="summary-value">{summaryData.numberOfStation}</h3>
                      <p className="summary-label">Total Stations</p>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              <IonCol size="6" sizeMd="3">
                <IonCard className="summary-card">
                  <IonCardContent className="summary-content">
                    <div className="summary-icon-container success">
                      <IonIcon icon={carSportOutline} className="summary-icon" />
                    </div>
                    <div className="summary-details">
                      <h3 className="summary-value">{summaryData.numberOfVehicle}</h3>
                      <p className="summary-label">Total Vehicles</p>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>

        {/* Petrol Station Map Section */}
        <div className="station-map-section">
          <h2 className="section-title">
            <IonIcon icon={locationOutline} className="section-icon" />
            Petrol Station Risk Map
          </h2>
          <StationMap />
        </div>

        {/* Main Navigation Cards */}
        <div className="main-navigation">
          <h2 className="section-title">
            <IonIcon icon={searchOutline} className="section-icon" />
            Investigation Modules
          </h2>

          <IonGrid>
            <IonRow>
              <IonCol size="12" sizeMd="6">
                <IonCard className="navigation-card" onClick={() => history.push("/petrol")}>
                  <div className="card-image-container">
                    <img src="/assets/images/petrol.png" alt="Station Investigation" className="card-image" />
                    <div className="card-badge-container">
                      <IonBadge color="warning" className="card-badge">
                        {summaryData.highRiskStations} High Risk
                      </IonBadge>
                    </div>
                  </div>
                  <IonCardHeader>
                    <IonCardTitle className="card-title">
                      <IonIcon icon={businessOutline} className="card-title-icon" />
                      Petrol Station Investigations
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p className="card-description">
                      Monitor petrol station activities, analyze transaction volumes, and identify stations with unusual
                      diesel dispensing patterns.
                    </p>
                    <div className="card-features">
                      <div className="feature">
                        <IonIcon icon={statsChartOutline} className="feature-icon" />
                        <span>Volume Statistics</span>
                      </div>
                      <div className="feature">
                        <IonIcon icon={carSportOutline} className="feature-icon" />
                        <span>Vehicle Tracking</span>
                      </div>
                      <div className="feature">
                        <IonIcon icon={waterOutline} className="feature-icon" />
                        <span>Consumption Analysis</span>
                      </div>
                    </div>
                    <IonButton expand="block" className="card-button">
                      View Stations
                      <IonIcon slot="end" icon={arrowForwardOutline} />
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              <IonCol size="12" sizeMd="6">
                <IonCard className="navigation-card" onClick={() => history.push("/investigations")}>
                  <div className="card-image-container">
                    <img src="/assets/images/investigation.png" alt="Vehicle Investigation" className="card-image" />
                    <div className="card-badge-container">
                      <IonBadge color="danger" className="card-badge">
                        {summaryData.highRiskVehicles} High Risk
                      </IonBadge>
                    </div>
                  </div>
                  <IonCardHeader>
                    <IonCardTitle className="card-title">
                      <IonIcon icon={carSportOutline} className="card-title-icon" />
                      Diesel Vehicle Investigation
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p className="card-description">
                      Track and analyze suspicious vehicle activities, monitor fuel consumption patterns, and identify
                      potential subsidy abuse cases.
                    </p>
                    <div className="card-features">
                      <div className="feature">
                        <IonIcon icon={analyticsOutline} className="feature-icon" />
                        <span>Usage Analytics</span>
                      </div>
                      <div className="feature">
                        <IonIcon icon={alertCircleOutline} className="feature-icon" />
                        <span>Risk Detection</span>
                      </div>
                      <div className="feature">
                        <IonIcon icon={timeOutline} className="feature-icon" />
                        <span>Transaction History</span>
                      </div>
                    </div>
                    <IonButton expand="block" className="card-button">
                      View Vehicles
                      <IonIcon slot="end" icon={arrowForwardOutline} />
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Home

