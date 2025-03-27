import { useEffect } from "react";
import L from "leaflet";

interface POIMarkersProps {
    stations: {
        address: string;
        district: string;
        state: string;
        syarikat_id?: string;
        location: { coordinates: [number, number] };
    }[];
    mapInstance: L.Map | null;
}

// Define icons based on `syarikat_id`
const iconMapping: { [key: string]: string } = {
    "CLTX": "/assets/images/caltex_icon.png",
    "SHELL": "/assets/images/shell_icon.png",
    "PTRN": "/assets/images/petron_icon.png",
    "BHP": "/assets/images/bhp_icon.png",
    "default": "/assets/images/default_icon.png"
};

// Function to get the icon dynamically
const getIcon = (syarikatId: string | undefined) => {
    return new L.Icon({
        iconUrl: iconMapping[syarikatId || "default"],
        iconSize: [40, 60],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
    });
};

const POIMarkers: React.FC<POIMarkersProps> = ({ stations, mapInstance }) => {
    useEffect(() => {
        if (!mapInstance) return;

        const markersGroup = L.layerGroup().addTo(mapInstance); // Create a new layer group

        stations.forEach((station) => {
            if (station.location && station.location.coordinates) {
                const [lng, lat] = station.location.coordinates; // Ensure the correct order [lat, lng]
                const marker = L.marker([lat, lng], { icon: getIcon(station.syarikat_id) }).bindPopup(
                    `<b>${station.address}</b><br>${station.district}, ${station.state}`
                );

                markersGroup.addLayer(marker);
            }
        }, 300);

        // ✅ Fix: Ensure markers are removed when updating
        return () => {
            markersGroup.clearLayers();
            mapInstance.removeLayer(markersGroup);
        };
    }, [stations, mapInstance]);

    return null; // No need to render anything
};

export default POIMarkers;
