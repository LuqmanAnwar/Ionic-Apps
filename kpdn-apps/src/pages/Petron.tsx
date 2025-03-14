import React, { useEffect, useRef, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from "@ionic/react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as echarts from "echarts"; // ✅ Import ECharts
import type { ECharts } from "echarts";

const MAP_API_URL = "http://203.142.6.113:5000/api/data"; // Petron Location Data
const CHART_API_URL = "http://203.142.6.113:5000/api/fleet"; // Fleet Card Data

const Petron: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [chartInstance, setChartInstance] = useState<ECharts | null>(null);

  // ✅ Fetch & Display Map Data (Fix: Ensure Container Exists)
  useEffect(() => {
    if (!mapContainerRef.current) {
      console.warn("Map container not available yet. Retrying...");
      return;
    }

    // ✅ Fix: Delay initialization to ensure container is available
    setTimeout(() => {
      if (mapInstance) return; // Avoid reinitializing

      const map = L.map(mapContainerRef.current! as HTMLElement, {
        center: [4.2105, 101.9758], // Malaysia coordinates
        zoom: 6,
        dragging: true,
        touchZoom: true,
        scrollWheelZoom: true,
      });

      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      ).addTo(map);

      setMapInstance(map);

      fetch(MAP_API_URL)
        .then((response) => response.json())
        .then((data) => {
          if (!Array.isArray(data)) {
            throw new Error("API response is not an array");
          }

          console.log("Fetched Map Data:", data);

          data.forEach((station: any) => {
            if (station.Lat && station.Lng) {
              L.circleMarker(
                [parseFloat(station.Lat), parseFloat(station.Lng)],
                {
                  radius: 6,
                  color: "#007bff",
                  fillColor: "#007bff",
                  fillOpacity: 0.8,
                  weight: 2,
                }
              )
                .addTo(map)
                .bindPopup(`<b>${station.location}</b><br>${station.Address}`);
            }
          });
        })
        .catch((error) => console.error("Error fetching map data:", error));
    }, 500); // ✅ Small delay to avoid issues

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [mapContainerRef.current]); // ✅ Ensure it runs when the container is ready

  // ✅ Fetch & Display Chart Data
  useEffect(() => {
    fetch(CHART_API_URL)
      .then((response) => response.json())
      .then((data) => {
        if (!data.labels || !data.values) {
          throw new Error("Invalid API response format");
        }

        console.log("Fetched Chart Data:", data);

        if (chartContainerRef.current) {
          const instance = echarts.init(chartContainerRef.current);
          setChartInstance(instance);

          const chartOption: echarts.EChartsOption = {
            title: {
              text: "Fleet Card Usage",
              subtext: "Total Vehicles",
              left: "center",
            },
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b} : {c} ({d}%)",
            },
            legend: {
              left: "center",
              bottom: "5%",
              orient: "horizontal",
              data: data.labels,
            },
            toolbox: {
              show: true,
              feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true },
              },
            },
            series: [
              {
                name: "Fleet Card Usage",
                type: "pie",
                radius: ["40%", "70%"], // ✅ Adjusted radius to fit within container
                center: ["50%", "50%"],
                roseType: "radius",
                itemStyle: {
                  borderRadius: 5,
                },
                label: {
                  show: true,
                },
                emphasis: {
                  focus: "series",
                },
                data: data.labels.map((label: string, index: number) => ({
                  value: data.values[index],
                  name: label,
                })),
              },
            ],
          };

          instance.setOption(chartOption);
        }
      })
      .catch((error) => console.error("Error fetching chart data:", error));

    return () => {
      if (chartInstance) {
        chartInstance.dispose();
      }
    };
  }, []);

  // Handle window resize to make the chart responsive
  useEffect(() => {
    const handleResize = () => {
      if (chartInstance) {
        chartInstance.resize();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [chartInstance]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar
          style={{ background: "linear-gradient(90deg, #0057b7, #0047ab)" }}
        >
          <IonTitle
            style={{
              textAlign: "center",
              fontSize: "24px",
              fontWeight: "bold",
              padding: "10px",
            }}
          >
            Petron
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {/* 🔹 Map Container */}
        <div
          ref={mapContainerRef}
          style={{
            width: "90%",
            height: "600px",
            margin: "20px auto",
            borderRadius: "15px",
            overflow: "hidden",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          }}
        />

        {/* 🔹 Chart Section */}
        <div style={{ width: "90%", margin: "20px auto" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: "20px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Data Analysis Charts
          </h2>

          {/* ✅ First Row (Chart on Left, Empty Box on Right) */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            {/* 🔹 Chart 1 (Fleet Card Usage) */}
            <div
              style={{
                width: "48%",
                height: "400px",
                backgroundColor: "#fff",
                borderRadius: "15px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                position: "relative",
              }}
            >
              <div
                ref={chartContainerRef}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              ></div>
            </div>

            {/* 🔹 Empty Container (Placeholder) */}
            <div style={chartBoxStyle}> {/* 🔹 Chart 2 Placeholder */} </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

/* 🔹 Chart Box Style */
const chartBoxStyle: React.CSSProperties = {
  width: "48%",
  height: "400px",
  backgroundColor: "#fff",
  borderRadius: "15px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default Petron;
