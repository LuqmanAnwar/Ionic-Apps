"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import * as L from "leaflet"
import "leaflet/dist/leaflet.css"
import { IonCard, IonCardContent, IonSelect, IonSelectOption } from "@ionic/react"

// Define the structure of a station
interface Station {
    address: string
    district: string
    state: string
    syarikat_id?: string
    location: {
        coordinates: [number, number] // [lng, lat]
    }
}

// Map station types to display names
const stationTypeMap = {
    CLTX: "Caltex Station",
    SHELL: "Shell Station",
    PTRN: "Petron Station",
    BHP: "BHP Station",
}

// Custom styles for select components
const customSelectStyles = {
    "--backdrop-filter": "none",
    "--backdrop-opacity": "1",
    "--background": "#ffffff",
    "--color": "#000000",
    "--font-weight": "500",
    "--border-radius": "8px",
    "--box-shadow": "0 4px 12px rgba(0, 0, 0, 0.15)",
    "--width": "250px",
    "--max-width": "90%",
}

const StationMap: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null)
    const [mapInstance, setMapInstance] = useState<L.Map | null>(null)
    const [stations, setStations] = useState<Station[]>([])
    const [allStates, setAllStates] = useState<string[]>([
        "Johor",
        "Kedah",
        "Kelantan",
        "Melaka",
        "Negeri Sembilan",
        "Pahang",
        "Perak",
        "Perlis",
        "Pulau Pinang",
        "Sabah",
        "Sarawak",
        "Selangor",
        "Terengganu",
        "W.P. Kuala Lumpur",
        "W.P. Labuan",
        "W.P. Putrajaya",
    ]);
    const [selectedState, setSelectedState] = useState<string>("W.P. Kuala Lumpur")
    const [selectedStationType, setSelectedStationType] = useState<string>("SHELL")
    const markersRef = useRef<L.LayerGroup | null>(null)




    useEffect(() => {
        console.log("Fetching stations for:", selectedState, "Station Type:", selectedStationType); // Debug log
        const fetchAllStations = async () => {
            try {
                const response = await fetch("https://e74d-203-142-6-113.ngrok-free.app/api/get_stations", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        state: selectedState || "W.P. Kuala Lumpur",  // ✅ Default state
                        syarikat_id: selectedStationType,
                    }),
                });

                const data = await response.json();
                console.log("API Response:", data); // Debug log

                if (data.status === "success") {
                    setStations(data.data);
                } else {
                    console.error("Error fetching states:", data.message);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        fetchAllStations();
    }, [selectedState, selectedStationType]);
    // Re-fetch when station type changes

    // Ensure this runs when selectedState changes

    // Initialize Leaflet Map
    useEffect(() => {
        if (!mapContainerRef.current || mapInstance) return

        setTimeout(() => {
            const map = L.map(mapContainerRef.current as HTMLDivElement, {
                center: [3.139, 101.6869],
                zoom: 10,
                dragging: true,
                touchZoom: true,
                scrollWheelZoom: true,
            })

            L.tileLayer(
                "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            ).addTo(map)

            setMapInstance(map)
            markersRef.current = L.layerGroup().addTo(map)

            setTimeout(() => {
                map.invalidateSize()
            }, 500)
        }, 500)
    }, [mapInstance])

    // Add & Update Markers when stations change
    useEffect(() => {
        if (!mapInstance || stations.length === 0) return

        markersRef.current?.clearLayers()

        const bounds = L.latLngBounds([])

        stations.forEach((station) => {
            if (station.location && station.location.coordinates) {
                const [lng, lat] = station.location.coordinates
                const marker = L.marker([lat, lng]).bindPopup(
                    `<b>${station.address}</b><br>${station.district}, ${station.state}`,
                )

                markersRef.current?.addLayer(marker)
                bounds.extend([lat, lng])
            }
        })

        if (stations.length > 0) {
            mapInstance.fitBounds(bounds, { padding: [50, 50] })
        }

        setTimeout(() => {
            mapInstance.invalidateSize()
        }, 1000)
    }, [mapInstance, stations])

    return (
        <IonCard className="map-card">
            {/* Filter section above the map */}
            <div className="filters-container">
                <div className="filter-item">
                    <label>State</label>
                    <IonSelect
                        value={selectedState || "W.P. Kuala Lumpur"}
                        placeholder="Select State"
                        onIonChange={(e) => setSelectedState(e.detail.value || "W.P. Kuala Lumpur")}
                        interface="alert"
                        style={customSelectStyles as any}
                        interfaceOptions={{
                            cssClass: "custom-select-alert",
                            backdropDismiss: true,
                            translucent: false,  // ❌ Ensures full visibility (No blur)
                        }}
                    >

                        {allStates.map((state, index) => (
                            <IonSelectOption
                                key={index}
                                value={state}
                                style={{
                                    fontWeight: "500",
                                    fontSize: "14px",
                                    padding: "10px",
                                }}
                            >
                                {state}
                            </IonSelectOption>
                        ))}
                    </IonSelect>
                </div>

                <div className="filter-item">
                    <label>Station Type</label>
                    <IonSelect
                        value={selectedStationType}
                        placeholder="Select Station Type"
                        onIonChange={(e) => setSelectedStationType(e.detail.value)}
                        interface="alert"
                        style={customSelectStyles as any}
                        interfaceOptions={{
                            cssClass: "custom-select-alert",
                            backdropDismiss: true,
                            translucent: false,
                        }}
                    >
                        {Object.entries(stationTypeMap).map(([code, name]) => (
                            <IonSelectOption
                                key={code}
                                value={code}
                                style={{
                                    fontWeight: "500",
                                    fontSize: "14px",
                                    padding: "10px",
                                }}
                            >
                                {name}
                            </IonSelectOption>
                        ))}
                    </IonSelect>
                </div>
            </div>

            <IonCardContent style={{ height: "500px", padding: "0", position: "relative" }}>
                <div ref={mapContainerRef} className="map-container" style={{ height: "100%", width: "100%" }}></div>
            </IonCardContent>
        </IonCard>
    )
}

export default StationMap

