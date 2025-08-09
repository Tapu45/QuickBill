import React, { useEffect, useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend, ArcElement);

function getCssVarValue(variable: string) {
  if (typeof window === "undefined") return variable;
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim() || variable;
}

type InventoryChartsProps = {
  stockDistribution: {
    inStock: number;
    lowStock: number;
    outOfStock: number;
    damagedLost: number;
  };
  topMovingProducts: { name: string; count: number }[];
};

export const InventoryCharts: React.FC<InventoryChartsProps> = ({
  stockDistribution,
  topMovingProducts,
}) => {
  const [chartColors, setChartColors] = useState({
    chart1: "#4f46e5",
    chart2: "#6366f1",
    chart3: "#22c55e",
    chart4: "#f59e42",
    chart5: "#ef4444",
    destructive: "#ef4444",
    accent: "#f59e42",
    primary: "#4f46e5",
    cardForeground: "#222",
    popover: "#fff",
    popoverForeground: "#222",
    border: "#eee",
    mutedForeground: "#888",
  });

  useEffect(() => {
    setChartColors({
      chart1: getCssVarValue("--color-chart-1"),
      chart2: getCssVarValue("--color-chart-2"),
      chart3: getCssVarValue("--color-chart-3"),
      chart4: getCssVarValue("--color-chart-4"),
      chart5: getCssVarValue("--color-chart-5"),
      destructive: getCssVarValue("--color-destructive"),
      accent: getCssVarValue("--color-accent"),
      primary: getCssVarValue("--color-primary"),
      cardForeground: getCssVarValue("--color-card-foreground"),
      popover: getCssVarValue("--color-popover"),
      popoverForeground: getCssVarValue("--color-popover-foreground"),
      border: getCssVarValue("--color-border"),
      mutedForeground: getCssVarValue("--color-muted-foreground"),
    });
  }, []);

  const stockDistributionData = {
    labels: ["In Stock", "Low Stock", "Out of Stock", "Damaged/Lost"],
    datasets: [
      {
        data: [
          stockDistribution.inStock,
          stockDistribution.lowStock,
          stockDistribution.outOfStock,
          stockDistribution.damagedLost,
        ],
        backgroundColor: [
          chartColors.chart3,
          chartColors.chart4,
          chartColors.destructive,
          chartColors.chart5,
        ],
        borderColor: [
          chartColors.chart3,
          chartColors.chart4,
          chartColors.destructive,
          chartColors.chart5,
        ],
        borderWidth: 2,
      },
    ],
  };

  const productMovementData = {
    labels: topMovingProducts.map((p) => p.name),
    datasets: [
      {
        label: "Movement Count",
        data: topMovingProducts.map((p) => p.count),
        backgroundColor: chartColors.chart1,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div
        className="rounded-xl shadow-md p-5 border lg:col-span-1"
        style={{
          background: "var(--color-card)",
          borderColor: "var(--color-border)",
          color: "var(--color-card-foreground)",
        }}
      >
        <h2 className="text-lg font-semibold mb-4">Stock Distribution</h2>
        <div className="flex justify-center">
          <div className="w-52 h-52">
            <Doughnut
              data={stockDistributionData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      usePointStyle: true,
                      color: chartColors.cardForeground,
                    },
                  },
                  tooltip: {
                    backgroundColor: chartColors.popover,
                    titleColor: chartColors.popoverForeground,
                    bodyColor: chartColors.popoverForeground,
                    borderColor: chartColors.border,
                    borderWidth: 1,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
      <div
        className="rounded-xl shadow-md p-5 border lg:col-span-2"
        style={{
          background: "var(--color-card)",
          borderColor: "var(--color-border)",
          color: "var(--color-card-foreground)",
        }}
      >
        <h2 className="text-lg font-semibold mb-4">Top Moving Products</h2>
        <Bar
          data={productMovementData}
          options={{
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: "y",
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: chartColors.popover,
                titleColor: chartColors.popoverForeground,
                bodyColor: chartColors.popoverForeground,
                borderColor: chartColors.border,
                borderWidth: 1,
              },
            },
            scales: {
              x: {
                grid: {
                  color: chartColors.border,
                },
                ticks: {
                  color: chartColors.mutedForeground,
                },
              },
              y: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: chartColors.mutedForeground,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};