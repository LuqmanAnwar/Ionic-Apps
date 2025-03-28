"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"

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
  IonChip,
  IonLabel,
  IonItem,
  IonSkeletonText,
  IonModal,
  IonList,
  IonDatetime,
  IonPopover,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react"
import {
  locationOutline,
  analyticsOutline,
  timeOutline,
  alertCircleOutline,
  filterOutline,
  searchOutline,
  businessOutline,
  carSportOutline,
  waterOutline,
  closeOutline,
  flashOutline,
  statsChartOutline,
  pulseOutline,
  scanOutline,
  calendarOutline,
  arrowUp,
  arrowDown,
} from "ionicons/icons"
import { useHistory } from "react-router"
import "../style/styles.css"
import { useParams } from "react-router-dom"

// Define interfaces for our data

interface Vehicle {
  no_pendaftaran_kenderaan: string;
  status: string; // Assuming status is a string
}

interface PetrolStationData {
  address: string
  district: string
  formatted_date: string
  quota_approved: number
  no_subsidi: string
  no_pendaftaran_kenderaan: string
  state: string
  status: string
  station_name: string
  total_volume: number
  unique_vehicles: string
  transaction_count: number
  station_id: string
  day_date: string
  vehicles: Vehicle[]
}

interface TransactionData {
  id: string // Ensure this is a unique identifier
  no_pendaftaran_kenderaan: string
  kuota_guna_liter: number
  formatted_date: string
  status: string
  station_name: string // Add this property
}

const PetrolStationDashboard: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("")
  const [searchId, station_id] = useState<string>("")
  const [selectedState, setSelectedState] = useState<string>("")
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)
  const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false)
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false)
  const [data, setData] = useState<PetrolStationData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showTransactions, setShowTransactions] = useState<boolean>(false)
  const [selectedStation, setSelectedStation] = useState<string>("")
  const [transactions, setTransactions] = useState<TransactionData[]>([])
  const [isLoadingTransactions, setIsLoadingTransactions] = useState<boolean>(false)

  const [sortBy, setSortBy] = useState<string>("total_volume")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

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

  const history = useHistory()


  const formatDateForBackend = (dateString: string | null) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]  // ✅ Ensures 'YYYY-MM-DD'
  }

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const requestBody = {
        state: selectedState,
        search: searchText,
        searchid: station_id,
        start_date: formatDateForBackend(startDate),
        end_date: formatDateForBackend(endDate),
      }

      console.log("Fetching data with:", requestBody)

      const response = await fetch("https://e74d-203-142-6-113.ngrok-free.app/api/petrol1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json: PetrolStationData[] = await response.json()
      console.log("Received data:", json)

      setData(json)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [selectedState, searchText, startDate, endDate, searchId])

  useEffect(() => {
    fetchData()
  }, [fetchData, searchText, searchId])


  const handleRefresh = (event: CustomEvent) => {
    setTimeout(() => {
      fetchData()
      event.detail.complete()
    }, 1000)
  }

  const handleViewTransactions = (station: PetrolStationData) => {
    setSelectedStation(station.station_id);
    // Use the day_date from the station data
    const date = station.day_date; // Assuming this is the date you want to pass
    history.push(`/statistic/${station.station_id}?date=${date}`); // Pass the day_date as a query parameter
    setShowTransactions(true);
  }


  const clearDateFilters = () => {
    setStartDate(null)
    setEndDate(null)
  }

  const getRiskBadgeColor = (status: string) => {
    switch (status) {
      case "High Potential":
        return "danger"
      case "medium":
        return "warning"
      case "Low Potential":
        return "warning"
      default:
        return "warning"
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-MY", { day: "2-digit", month: "short", year: "numeric" })
  }

  const handleDateChange =
    (setDateFunc: React.Dispatch<React.SetStateAction<string | null>>, closePopover: () => void) =>
      (e: CustomEvent) => {
        const selectedDate = e.detail.value
        if (typeof selectedDate === "string") {
          console.log("Selected date:", selectedDate)
          setDateFunc(selectedDate)
          closePopover()
        }
      }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  const sortedData = [...data].sort((a, b) => {
    let comparison = 0
    switch (sortBy) {
      case "total_volume":
        comparison = a.total_volume - b.total_volume
        break
      case "unique_vehicles":
        comparison = Number.parseInt(a.unique_vehicles) - Number.parseInt(b.unique_vehicles)
        break
      case "transaction_count":
        comparison = a.transaction_count - b.transaction_count
        break
      case "status":
        comparison = a.status.localeCompare(b.status)
        break
      case "last_activity":
        comparison = new Date(a.formatted_date).getTime() - new Date(b.formatted_date).getTime()
        break
    }
    return sortOrder === "asc" ? comparison : -comparison
  })

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
            PETROL STATION
          </IonTitle>
        </IonToolbar>
      </IonHeader>


      <IonContent fullscreen className="dashboard-content">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="search-container">
          <IonCard className="search-card">
            <IonCardHeader>
              <IonCardTitle className="search-title">
                <IonIcon icon={scanOutline} className="search-icon" />
                SEARCH STATIONS
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonSearchbar
                value={searchText}
                onIonChange={(e) => setSearchText(e.detail.value || "")}
                placeholder="Enter station name"
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

              {/* Date Filter Section */}
              <div className="date-filters">
                <IonItem lines="none" className="date-select-item">
                  <IonIcon icon={calendarOutline} slot="start" />
                  <IonLabel>Start Date</IonLabel>
                  <IonButton fill="clear" onClick={() => setShowStartDatePicker(true)} className="date-button">
                    {startDate ? formatDate(startDate) : "Select"}
                  </IonButton>
                  <IonPopover
                    isOpen={showStartDatePicker}
                    onDidDismiss={() => setShowStartDatePicker(false)}
                    className="date-popover"
                  >
                    <IonDatetime
                      value={startDate}
                      onIonChange={handleDateChange(setStartDate, () => setShowStartDatePicker(false))}
                      presentation="date"
                      preferWheel={true} // Enables a more user-friendly selection
                      showDefaultButtons={true}
                      className="custom-datetime"
                    />
                  </IonPopover>
                </IonItem>
                <IonItem lines="none" className="date-select-item">
                  <IonIcon icon={calendarOutline} slot="start" />
                  <IonLabel>End Date</IonLabel>
                  <IonButton fill="clear" onClick={() => setShowEndDatePicker(true)} className="date-button">
                    {endDate ? formatDate(endDate) : "Select"}
                  </IonButton>
                  <IonPopover
                    isOpen={showEndDatePicker}
                    onDidDismiss={() => setShowEndDatePicker(false)}
                    className="date-popover"
                  >
                    <IonDatetime
                      value={endDate}
                      onIonChange={handleDateChange(setEndDate, () => setShowEndDatePicker(false))}
                      presentation="date"
                      preferWheel={true} // Enables a more user-friendly selection
                      showDefaultButtons={true}
                      className="custom-datetime"
                    />
                  </IonPopover>
                </IonItem>

                {(startDate || endDate) && (
                  <IonButton fill="clear" size="small" onClick={clearDateFilters} className="clear-dates-button">
                    Clear Dates
                  </IonButton>
                )}
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
              <IonLabel>
                HIGH RISK: {data.filter((station) => {
                  // Ensure 'vehicles' is an array
                  if (!Array.isArray(station.vehicles)) {
                    return false; // Skip this station if vehicles is not an array
                  }

                  // Filter the unique vehicles with status 'High Potential'
                  const highPotentialVehicles = station.vehicles.filter((vehicle: Vehicle) => vehicle.status === 'High Potential');

                  // Count unique vehicle registrations
                  const uniqueCount = new Set(highPotentialVehicles.map(vehicle => vehicle.no_pendaftaran_kenderaan)).size;

                  // Check if the unique vehicle count is greater than 5
                  return uniqueCount > 5;
                }).length}
              </IonLabel>
            </IonChip>



            {(startDate || endDate) && (
              <IonChip className="stat-chip date-filter-active">
                <IonIcon icon={calendarOutline} />
                <IonLabel>
                  Date Filter: {formatDate(startDate) || "Start"} - {formatDate(endDate) || "End"}
                </IonLabel>
              </IonChip>
            )}
          </div>

          {/* Sorting buttons */}
          <IonSegment value={sortBy} onIonChange={(e) => handleSort(e.detail.value as string)}>
            <IonSegmentButton value="total_volume">
              <IonLabel>Volume</IonLabel>
              {sortBy === "total_volume" && <IonIcon icon={sortOrder === "asc" ? arrowUp : arrowDown} />}
            </IonSegmentButton>
            <IonSegmentButton value="transaction_count">
              <IonLabel>Transactions</IonLabel>
              {sortBy === "transaction_count" && <IonIcon icon={sortOrder === "asc" ? arrowUp : arrowDown} />}
            </IonSegmentButton>
            <IonSegmentButton value="unique_vehicles">
              <IonLabel>Vehicles</IonLabel>
              {sortBy === "unique_vehicles" && <IonIcon icon={sortOrder === "asc" ? arrowUp : arrowDown} />}
            </IonSegmentButton>
          </IonSegment>

          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <IonCard key={`skeleton-${index}`} className="station-card skeleton-card">
                <IonCardHeader>
                  <IonSkeletonText animated style={{ width: "60%", height: "24px" }} />
                </IonCardHeader>
                <IonCardContent>
                  <IonSkeletonText animated style={{ width: "100%", height: "100px" }} />
                </IonCardContent>
              </IonCard>
            ))
          ) : sortedData.length > 0 ? (
            sortedData.map((station, index) => (
              <IonCard
                key={`${station.no_pendaftaran_kenderaan}-${index}`} // Ensure uniqueness
                className="station-card"
              >
                <IonCardHeader>
                  <IonCardTitle className="station-title">
                    <IonIcon icon={businessOutline} className="station-icon" />
                    {station.station_name}
                  </IonCardTitle>
                  <IonCardSubtitle className="station-location">
                    <IonIcon icon={locationOutline} className="location-icon" />
                    {station.state}
                  </IonCardSubtitle>
                </IonCardHeader>

                <IonCardContent className="station-content">
                  <div className="data-grid">
                    <div className="data-section">
                      <div className="data-header">
                        <IonIcon icon={waterOutline} className="data-icon" />
                        <span className="data-label">TOTAL VOLUME</span>
                      </div>
                      <div className="data-value volume-value">
                        {station.total_volume.toLocaleString()} L
                      </div>
                    </div>

                    <div className="data-section">
                      <div className="data-header">
                        <IonIcon icon={carSportOutline} className="data-icon" />
                        <span className="data-label">UNIQUE VEHICLES</span>
                      </div>
                      <div className="data-value">{station.unique_vehicles}</div>
                    </div>

                    <div className="data-section">
                      <div className="data-header">
                        <IonIcon icon={analyticsOutline} className="data-icon" />
                        <span className="data-label">TRANSACTIONS</span>
                      </div>
                      <div className="data-value">{station.transaction_count}</div>
                    </div>

                    <div className="data-section">
                      <div className="data-header">
                        <IonIcon icon={pulseOutline} className="data-icon" />
                        <span className="data-label">STATUS</span>
                      </div>
                      <div className="data-value risk-value">
                        <IonBadge className={`transaction-badge ${getRiskBadgeColor(station.status)}`}>
                          {station.status}
                        </IonBadge>
                      </div>
                    </div>

                    {/* NEW: LAST ACTIVITY (Latest Transaction Time) */}
                    <div className="data-section">
                      <div className="data-header">
                        <IonIcon icon={timeOutline} className="data-icon" />
                        <span className="data-label">TRANSACTION</span>
                      </div>
                      <div className="data-value time-value" style={{ fontSize: "13px", marginLeft: "22px" }}>
                        {new Date(station.day_date).toLocaleString("en-MY", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  <IonButton
                    expand="block"
                    onClick={() => handleViewTransactions(station)}
                    className="view-transactions-button"
                  >
                    <IonIcon icon={statsChartOutline} slot="start" />
                    VIEW TRANSACTIONS
                  </IonButton>
                </IonCardContent>
              </IonCard>
            ))
          ) : (
            <div className="no-results">
              <IonIcon icon={searchOutline} className="no-results-icon" />
              <h4>No petrol stations found</h4>
              <p>Try adjusting your search criteria</p>
            </div>
          )}
        </div>

        {/* Transactions Modal */}
        <IonModal
          isOpen={showTransactions}
          onDidDismiss={() => setShowTransactions(false)}
          className="transactions-modal"
        >
          <IonHeader>
            <IonToolbar className="modal-header">
              <IonTitle className="modal-title">
                <IonIcon icon={statsChartOutline} className="modal-title-icon" />
                {selectedStation}
              </IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowTransactions(false)} className="close-button">
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="modal-content">
            {/* Date filter controls for transactions */}
            <div className="transaction-filters">
              <IonItem lines="none" className="transaction-filter-item">
                <IonIcon icon={calendarOutline} slot="start" />
                <IonLabel>Filter by Date</IonLabel>
              </IonItem>

              <div className="transaction-date-filters">
                <IonItem lines="none" className="transaction-date-item">
                  <IonLabel>From</IonLabel>
                  <IonButton fill="clear" onClick={() => setShowStartDatePicker(true)} size="small">
                    {formatDate(startDate) || "Select"}
                  </IonButton>
                </IonItem>

                <IonItem lines="none" className="transaction-date-item">
                  <IonLabel>To</IonLabel>
                  <IonButton fill="clear" onClick={() => setShowEndDatePicker(true)} size="small">
                    {formatDate(endDate) || "Select"}
                  </IonButton>
                </IonItem>


              </div>
            </div>

            {/* Transaction list */}
            <IonList className="transaction-list">
              {isLoadingTransactions ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <IonItem key={`skeleton-${index}`} className="transaction-skeleton">
                    <IonSkeletonText animated style={{ width: "100%", height: "60px" }} />
                  </IonItem>
                ))
              ) : transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <IonItem key={transaction.id} className="transaction-item">
                    <div className="transaction-details">
                      <div className="transaction-vehicle">
                        <IonIcon icon={carSportOutline} className="transaction-icon" />
                        <span>{transaction.no_pendaftaran_kenderaan}</span>
                      </div>
                      <div className="transaction-volume">
                        <IonIcon icon={waterOutline} className="transaction-icon" />
                        <span>{transaction.kuota_guna_liter} L</span>
                      </div>
                      <div className="transaction-date">
                        <IonIcon icon={timeOutline} className="transaction-icon" />
                        <span>{new Date(transaction.formatted_date).toLocaleString()}</span>
                      </div>
                      <div className="transaction-status">
                        <IonBadge className={`transaction-badge ${getRiskBadgeColor(transaction.status)}`}>
                          {transaction.status}
                        </IonBadge>
                      </div>
                    </div>
                  </IonItem>
                ))
              ) : (
                <div className="no-transactions">
                  <IonIcon icon={searchOutline} className="no-transactions-icon" />
                  <h4>No transactions found</h4>
                  <p>Try adjusting your date filters</p>
                </div>
              )}
            </IonList>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  )
}

export default PetrolStationDashboard

