import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSelect,
  IonSelectOption,
  IonButtons,
  IonButton,
} from "@ionic/react";
import * as echarts from "echarts"; // Import ECharts
import { useHistory } from "react-router";

// Define an interface for the first API response
interface ApiResponse {
  CAR_REG: string[];
  SVOL: number[];
  state: string[];
}

// Define an interface for the second API response
interface ApiResponseInvest2 {
  CAR_REG: string[];
  approved_quota: number[];
  daily_purchase: number[];
  state: string[];
}

// Define an interface for the third API response
interface ApiResponseInvest3 {
  "Car Registration": string[];
  "number of transaction": number[];
  state: string[];
}

const RedFlag: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>("JOHOR");
  const [chartData, setChartData] = useState<ApiResponse>({
    CAR_REG: [],
    SVOL: [],
    state: [],
  }); // Store the fetched data
  const [chartDataInvest2, setChartDataInvest2] = useState<ApiResponseInvest2>({
    CAR_REG: [],
    approved_quota: [],
    daily_purchase: [],
    state: [],
  }); // Store the second fetched data
  const [chartDataInvest3, setChartDataInvest3] = useState<ApiResponseInvest3>({
    "Car Registration": [],
    "number of transaction": [],
    state: [],
  }); // Store the third fetched data
  const [chartInstance, setChartInstance] = useState<any>(null); // Store the ECharts instance
  const [chartInstanceInvest2, setChartInstanceInvest2] = useState<any>(null); // Store the second ECharts instance
  const [chartInstanceInvest3, setChartInstanceInvest3] = useState<any>(null); // Store the third ECharts instance
  const [states, setStates] = useState<string[]>([]); // Store unique states from the first API

  // Define a function to generate a color based on the index
  const generateColor = (index: number): string => {
    const colors = [
      "#FF5733", // Red
      "#33FF57", // Green
      "#3357FF", // Blue
      "#FF33A1", // Pink
      "#FF8C33", // Orange
      "#33FFF5", // Cyan
      "#A133FF", // Purple
      "#FFC300", // Yellow
      "#DAF7A6", // Light Green
      "#581845", // Dark Purple
    ];
    return colors[index % colors.length]; // Cycle through colors
  };

  // Fetch data from the first API
  useEffect(() => {
    fetch("http://203.142.6.113:5000/api/invest1")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data: ApiResponse) => {
        console.log("Fetched data from invest1:", data);
        setChartData(data);
        createChart(data);

        const uniqueStates = Array.from(new Set(data.state));
        setStates(uniqueStates);
      })
      .catch((error) =>
        console.error("Error fetching data from invest1:", error)
      );
  }, []);

  // Fetch data from the second API
  useEffect(() => {
    fetch("http://203.142.6.113:5000/api/invest2")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data: ApiResponseInvest2) => {
        console.log("Fetched data from invest2:", data);
        setChartDataInvest2(data);
        createChartInvest2(data);
      })
      .catch((error) =>
        console.error("Error fetching data from invest2:", error)
      );
  }, []);

  // Fetch data from the third API
  useEffect(() => {
    fetch("http://203.142.6.113:5000/api/invest3")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data: ApiResponseInvest3) => {
        console.log("Fetched data from invest3:", data);
        setChartDataInvest3(data);
        createChartInvest3(data);
      })
      .catch((error) =>
        console.error("Error fetching data from invest3:", error)
      );
  }, []);

  // Create the first chart
  const createChart = (data: ApiResponse) => {
    if (chartInstance) {
      chartInstance.dispose();
    }

    if (
      !data ||
      !Array.isArray(data.CAR_REG) ||
      !Array.isArray(data.SVOL) ||
      !Array.isArray(data.state) ||
      data.CAR_REG.length !== data.SVOL.length ||
      data.CAR_REG.length !== data.state.length
    ) {
      console.error("Invalid data structure:", data);
      return;
    }

    const filteredData = data.CAR_REG.map((label: string, index: number) => ({
      label,
      value: data.SVOL[index],
      state: data.state[index],
    })).filter((item) => item.state === selectedState);

    if (filteredData.length === 0) {
      console.error("No data to display");
      return;
    }

    const chartDom = document.getElementById("chartContainer");
    const instance = echarts.init(chartDom);
    setChartInstance(instance);

    const option = {
      title: {
        text: "Red Flag Vehicles Exceed Limit in One Transaction",
        left: "center",
        top: "10px",
        textStyle: {
          fontSize: 12,
          fontWeight: "bold",
          color: "#333",
        },
      },
      tooltip: {
        trigger: "item",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
      },
      yAxis: {
        type: "category",
        data: filteredData.map((item) => item.label),
      },
      series: [
        {
          name: "SVOL",
          type: "bar",
          data: filteredData.map((item, index) => ({
            value: item.value,
            itemStyle: {
              color: generateColor(index),
            },
          })),
        },
      ],
    };

    instance.setOption(option);
    window.addEventListener("resize", () => instance.resize());
  };

  // Create the second chart as a stacked bar chart
  const createChartInvest2 = (data: ApiResponseInvest2) => {
    if (chartInstanceInvest2) {
      chartInstanceInvest2.dispose();
    }

    if (
      !data ||
      !Array.isArray(data.CAR_REG) ||
      !Array.isArray(data.approved_quota) ||
      !Array.isArray(data.daily_purchase) ||
      !Array.isArray(data.state) ||
      data.CAR_REG.length !== data.approved_quota.length ||
      data.CAR_REG.length !== data.daily_purchase.length ||
      data.CAR_REG.length !== data.state.length
    ) {
      console.error("Invalid data structure:", data);
      return;
    }

    const filteredData = data.CAR_REG.map((label: string, index: number) => ({
      label,
      approved_quota: data.approved_quota[index],
      daily_purchase: data.daily_purchase[index],
      state: data.state[index],
    })).filter((item) => item.state === selectedState);

    if (filteredData.length === 0) {
      console.error("No data to display");
      return;
    }

    const chartDomInvest2 = document.getElementById("chartContainerInvest2");
    const instanceInvest2 = echarts.init(chartDomInvest2);
    setChartInstanceInvest2(instanceInvest2);

    const optionInvest2 = {
      title: {
        text: "Approved Quota vs Daily Purchase",
        left: "center",
        top: "25px",
        textStyle: {
          fontSize: 12,
          fontWeight: "bold",
          color: "#333",
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow", // Use shadow for tooltip
        },
      },
      legend: {
        data: ["Approved Quota", "Daily Purchase"],
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
      },
      yAxis: {
        type: "category",
        data: filteredData.map((item) => item.label),
      },
      series: [
        {
          name: "Approved Quota",
          type: "bar",
          stack: "total", // Stack the bars
          label: {
            show: true,
          },
          emphasis: {
            focus: "series",
          },
          data: filteredData.map((item) => item.approved_quota),
        },
        {
          name: "Daily Purchase",
          type: "bar",
          stack: "total", // Stack the bars
          label: {
            show: true,
          },
          emphasis: {
            focus: "series",
          },
          data: filteredData.map((item) => item.daily_purchase),
        },
      ],
    };

    instanceInvest2.setOption(optionInvest2);
    window.addEventListener("resize", () => instanceInvest2.resize()); // ✅ Ensure chart resizes when window size changes
  };

  // Create the third chart as a treemap
  const createChartInvest3 = (data: ApiResponseInvest3) => {
    if (
      !data ||
      !Array.isArray(data["Car Registration"]) ||
      !Array.isArray(data["number of transaction"]) ||
      !Array.isArray(data.state) ||
      data["Car Registration"].length !==
        data["number of transaction"].length ||
      data["Car Registration"].length !== data.state.length
    ) {
      console.error("Invalid data structure:", data);
      return;
    }

    // Filter and aggregate data based on selected state
    const filteredData = data["Car Registration"]
      .map((label: string, index: number) => ({
        label,
        value: data["number of transaction"][index],
        state: data.state[index],
      }))
      .filter((item) => item.state === selectedState);

    if (filteredData.length === 0) {
      console.error("No data to display");
      return;
    }

    // Aggregate values for the same car registration
    const treemapData = filteredData.reduce((acc: any[], item) => {
      const existingNode = acc.find((node) => node.name === item.label);
      if (existingNode) {
        existingNode.value += item.value; // Sum the values for the same car registration
        existingNode.freq = (existingNode.freq || 0) + 1; // Count frequency
      } else {
        acc.push({ name: item.label, value: item.value, freq: 1 }); // Initialize frequency
      }
      return acc;
    }, []);

    const chartDomInvest3 = document.getElementById("chartContainerFull");
    const instanceInvest3 = echarts.init(chartDomInvest3);
    setChartInstanceInvest3(instanceInvest3);

    const optionInvest3 = {
      title: {
        text: "Repeated more than 3 Transactions in the same Petrol in 9 Hours Period",
        left: "center",
        top: "10px",
        textStyle: {
          fontSize: 12,
          fontWeight: "bold",
          color: "#333",
        },
      },
      tooltip: {
        formatter: function (params: any) {
          return `${params.name}<br/>Number of Transactions: ${params.value}`;
        },
      },
      series: [
        {
          type: "treemap",
          data: treemapData,
        },
      ],
    };

    instanceInvest3.setOption(optionInvest3);
    window.addEventListener("resize", () => instanceInvest3.resize()); // ✅ Ensure chart resizes when window size changes
  };

  // Update chart when state changes
  useEffect(() => {
    if (chartData.CAR_REG.length > 0) {
      createChart(chartData);
    }
    if (chartDataInvest2.CAR_REG.length > 0) {
      createChartInvest2(chartDataInvest2);
    }
    if (chartDataInvest3["Car Registration"].length > 0) {
      createChartInvest3(chartDataInvest3);
    }

    // ✅ Ensure the chart resizes on window resize
    const handleResize = () => {
      if (chartInstance) {
        chartInstance.resize();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [selectedState, chartData, chartDataInvest2, chartDataInvest3]);
  const history = useHistory();

  const handleBackButtonClick = () => {
    history.push("/"); // Navigate to the root path
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar
          style={{ background: "linear-gradient(90deg, #ffcc00, #ff9900)" }}
        >
          <IonButtons slot="start">
            <IonButton onClick={handleBackButtonClick}>Back</IonButton>
          </IonButtons>

          <IonTitle
            style={{
              textAlign: "center",

              fontSize: "24px",

              fontWeight: "bold",

              padding: "10px",
            }}
          >
            Red Flag Indicator
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div style={{ width: "90%", margin: "20px auto" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: "20px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Diesel Consumption Analysis
          </h2>

          {/* Filter Box (Dropdown for State Selection) */}
          <div style={filterBoxStyle}>
            <label style={labelStyle}>State</label>
            <IonSelect
              value={selectedState}
              onIonChange={(e) => setSelectedState(e.detail.value)}
              interface="popover"
              style={dropdownStyle}
            >
              {states.map((state) => (
                <IonSelectOption key={state} value={state}>
                  {state}
                </IonSelectOption>
              ))}
            </IonSelect>
          </div>

          {/* First Row (Chart Container) */}
          <div style={fullContainerStyle}>
            <div
              id="chartContainer"
              style={{ width: "100%", height: "100%" }}
            ></div>
          </div>
          <div style={fullContainerStyle}>
            <div
              id="chartContainerInvest2"
              style={{ width: "100%", height: "100%" }}
            ></div>
          </div>

          {/* Second Row (Full Width Container for the third chart) */}
          <div style={fullContainerStyle}>
            <div
              id="chartContainerFull"
              style={{ width: "100%", height: "100%" }}
            ></div>
          </div>

          {/* <div style={fullContainerStyle}></div> */}

          {/* Fourth Row (2 Side-by-Side Containers) */}
          {/* <div style={rowStyle}>
            <div style={halfContainerStyle}></div>
            <div style={halfContainerStyle}></div>
          </div>*/}
        </div>
      </IonContent>
    </IonPage>
  );
};

/* Styles */
const filterBoxStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#fff",
  borderRadius: "10px",
  padding: "10px 15px",
  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  marginBottom: "20px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const labelStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "bold",
};

const dropdownStyle: React.CSSProperties = {
  width: "200px",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "20px",
  marginBottom: "20px",
};

const halfContainerStyle: React.CSSProperties = {
  width: "48%",
  height: "400px",
  backgroundColor: "#fff",
  borderRadius: "15px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
};

const fullContainerStyle: React.CSSProperties = {
  width: "100%",
  height: "400px",
  backgroundColor: "#fff",
  borderRadius: "15px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  marginBottom: "20px",
};

export default RedFlag;
