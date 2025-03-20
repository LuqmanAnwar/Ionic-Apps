import React, { useRef, useState, useEffect } from 'react'; // Import hooks from React
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IonCard, IonCardContent, IonSelect, IonSelectOption } from '@ionic/react';

// Define the structure of a station
interface Station {
    address: string;
    district: string;
    state: string;
    location: {
        coordinates: [number, number]; // [lng, lat]
    };
}

// Custom styles to fix blurry text
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
};

const VehicleMap: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
    const [stations, setStations] = useState<Station[]>([]);
    const [allStates, setAllStates] = useState<string[]>([]);
    const [selectedState, setSelectedState] = useState<string>("W.P. Kuala Lumpur");
    const markersRef = useRef<L.LayerGroup | null>(null);

    // Fetch all stations initially & extract unique states
    useEffect(() => {
        const fetchAllStations = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/get_stations", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({}),
                });

                const data = await response.json();
                if (data.status === "success") {
                    const stationsData: Station[] = data.data;
                    const states = [...new Set(stationsData.map((station) => station.state))].sort();
                    setAllStates(states);
                } else {
                    console.error("Error fetching states:", data.message);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        fetchAllStations();
    }, []);

    // Fetch station data for selected state
    useEffect(() => {
        const fetchStations = async () => {
            try {
                const response = await fetch("https://e74d-203-142-6-113.ngrok-free.app/api/get_stations", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ params: selectedState, isState: true }),
                });

                const data = await response.json();
                if (data.status === "success") {
                    setStations(data.data);
                } else {
                    console.error("Error fetching stations:", data.message);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        if (selectedState) fetchStations();
    }, [selectedState]);

    // Initialize Leaflet Map
    useEffect(() => {
        if (!mapContainerRef.current || mapInstance) return;

        setTimeout(() => {
            const map = L.map(mapContainerRef.current as HTMLDivElement, {
                center: [3.139, 101.6869],
                zoom: 10,
                dragging: true,
                touchZoom: true,
                scrollWheelZoom: true,
            });

            L.tileLayer(
                "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            ).addTo(map);

            setMapInstance(map);
            markersRef.current = L.layerGroup().addTo(map);

            setTimeout(() => {
                map.invalidateSize();
            }, 500);
        }, 500);
    }, [mapInstance]);

    // Add & Update Markers when stations change
    useEffect(() => {
        if (!mapInstance || stations.length === 0) return;

        markersRef.current?.clearLayers();

        const bounds = L.latLngBounds([]);

        stations.forEach((station: Station) => {
            if (station.location && station.location.coordinates) {
                const [lng, lat] = station.location.coordinates;
                const marker = L.marker([lat, lng]).bindPopup(
                    `<b>${station.address}</b><br>${station.district}, ${station.state}`,
                );

                markersRef.current?.addLayer(marker);
                bounds.extend([lat, lng]);
            }
        });

        if (stations.length > 0) {
            mapInstance.fitBounds(bounds, { padding: [50, 50] });
        }

        setTimeout(() => {
            mapInstance.invalidateSize();
        }, 1000);
    }, [mapInstance, stations]);

    return (
        <IonCard className="map-card">
            <IonCardContent style={{ height: "500px", padding: "0", position: "relative" }}>
                <div className="filter-box">
                    <IonSelect
                        value={selectedState}
                        placeholder="Select State"
                        onIonChange={(e) => setSelectedState(e.detail.value)}
                        interface="alert"
                        style={customSelectStyles as any}
                        interfaceOptions={{
                            cssClass: "custom-select-alert",
                            backdropDismiss: true,
                            translucent: false,
                        }}
                    >
                        {allStates.map((state: string, index: number) => (
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

                <div ref={mapContainerRef} className="map-container" style={{ height: "100%", width: "100%" }}></div>
            </IonCardContent>
        </IonCard>
    );
};

export default VehicleMap;