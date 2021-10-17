import React from "react";
import { Bar, Doughnut, Line, PolarArea } from "react-chartjs-2";
import chartStyles from "../../../styles/components/gov/Charts.module.css";

interface MedicalDataType {
  id: string;
  on: number;
  fees: number;
  medicines: number;
  issue: string;
  patientID: string;
}

interface ChartsProps {
  citizensMedicalData: MedicalDataType[];
  chartData: {
    labels: string[];
    datasets: { data: number[] }[];
  };
}

const Charts = ({ citizensMedicalData, chartData }: ChartsProps) => {
  return (
    <div className={chartStyles.charts}>
      {citizensMedicalData?.length ? (
        <>
          <div className={chartStyles.chart}>
            <Doughnut data={chartData} className={chartStyles.chartCanvas} />
          </div>
          <div className={chartStyles.chart}>
            <PolarArea data={chartData} className={chartStyles.chartCanvas} />
          </div>
          <div className={chartStyles.chart}>
            <Line data={chartData} className={chartStyles.chartCanvas} />
          </div>
          <div className={chartStyles.chart}>
            <Bar data={chartData} className={chartStyles.chartCanvas} />
          </div>
        </>
      ) : (
        <p style={{ color: "white" }}>No previous records</p>
      )}
    </div>
  );
};

export default Charts;
