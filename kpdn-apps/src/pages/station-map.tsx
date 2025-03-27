import type React from "react";
import { useEffect, useRef, useState } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { IonCard, IonCardContent, IonSelect, IonSelectOption } from "@ionic/react";
import POIMarkers from "./POIMarkers";

"use client"

interface Station {
    address: string;
    district: string;
    state: string;
    syarikat_id?: string;
    location: { coordinates: [number, number] };
}

// Map station types to display names
const stationTypeMap = {
    CLTX: "Caltex Station",
    SHELL: "Shell Station",
    PTRN: "Petron Station",
    BHP: "BHP Station",
};

// Default center positions for states
const stateCenters: { [key: string]: [number, number] } = {
    "Johor": [1.4854, 103.7612],
    "Kedah": [6.1184, 100.3687],
    "Kelantan": [6.1254, 102.2385],
    "Melaka": [2.1896, 102.2501],
    "Negeri Sembilan": [2.7252, 101.9424],
    "Pahang": [3.8126, 103.3256],
    "Perak": [4.5975, 101.0901],
    "Perlis": [6.4452, 100.1975],
    "Pulau Pinang": [5.4164, 100.3327],
    "Sabah": [5.9804, 116.0735],
    "Sarawak": [1.5533, 110.3593],
    "Selangor": [3.0738, 101.5183],
    "Terengganu": [5.3117, 103.1324],
    "W.P. Kuala Lumpur": [3.139, 101.6869],
    "W.P. Labuan": [5.2831, 115.2305],
    "W.P. Putrajaya": [2.9264, 101.6964],
};

const StationMap: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
    const [stations, setStations] = useState<Station[]>([]);
    const [selectedState, setSelectedState] = useState<string>("W.P. Kuala Lumpur");
    const [selectedStationType, setSelectedStationType] = useState<string>("SHELL");

    useEffect(() => {
        const fetchAllStations = async () => {
            try {
                const response = await fetch("https://e74d-203-142-6-113.ngrok-free.app/api/get_stations", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        state: selectedState,
                        syarikat_id: selectedStationType,
                    }),
                });

                const data = await response.json();
                console.log("API Response:", data);

                if (data.status === "success") {
                    setStations(data.data);
                } else {
                    console.error("Error fetching stations:", data.message);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        fetchAllStations();
    }, [selectedState, selectedStationType]);

    // Initialize Leaflet Map
    useEffect(() => {
        if (!mapContainerRef.current || mapInstance) return;

        const map = L.map(mapContainerRef.current as HTMLDivElement, {
            center: stateCenters[selectedState] || [3.139, 101.6869],
            zoom: 3,
            dragging: true,
            touchZoom: true,
            scrollWheelZoom: true,
        });

        L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        ).addTo(map);

        setMapInstance(map);

        return () => {
            map.remove();
        };
    }, []);


    useEffect(() => {
        if (!mapInstance) return;

        return () => {
            mapInstance.eachLayer((layer) => {
                if (layer instanceof L.TileLayer) return;
                mapInstance.removeLayer(layer); // ✅ Ensure old layers are removed
            });
        };
    }, [mapInstance]);

    // ✅ Auto-move map to selected state
    useEffect(() => {
        if (!mapInstance) return; // ✅ Ensure mapInstance is available

        const newCenter = stateCenters[selectedState] || [3.139, 101.6869];

        // ✅ Wait for next frame to ensure the map is ready
        setTimeout(() => {
            mapInstance.invalidateSize();
            mapInstance.setView(newCenter, 10);
        }, 300);
    }, [selectedState, mapInstance]);

    return (
        <IonCard className="map-card">
            <div className="filters-container">
                <div className="filter-item">
                    <label>State</label>
                    <IonSelect
                        value={selectedState}
                        placeholder="Select State"
                        onIonChange={(e) => setSelectedState(e.detail.value)}
                    >
                        {Object.keys(stateCenters).map((state) => (
                            <IonSelectOption key={state} value={state}>
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
                    >
                        {Object.entries(stationTypeMap).map(([code, name]) => (
                            <IonSelectOption key={code} value={code}>
                                {name}
                            </IonSelectOption>
                        ))}
                    </IonSelect>
                </div>
            </div>

            <IonCardContent style={{ height: "500px", padding: "0", position: "relative" }}>
                <div ref={mapContainerRef} className="map-container" style={{ height: "100%", width: "100%" }}></div>
                {mapInstance && <POIMarkers stations={stations} mapInstance={mapInstance} />}
            </IonCardContent>
        </IonCard>
    );
};

export default StationMap;
