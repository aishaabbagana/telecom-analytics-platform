import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getCdrs, filterCdrs } from "../services/cdrService";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 shadow-lg">
      <p className="text-white font-semibold text-sm mb-1">{label}</p>
      <p className="text-red-400 text-sm">
        Calls: <span className="font-bold">{payload[0].value}</span>
      </p>
    </div>
  );
}

function CityChart({ filters }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        let records;

        if (filters) {
          const response = await filterCdrs(filters);
          records = response.data || response;
        } else {
          const response = await getCdrs(1, 1000);
          records = response.data || response;
        }

        const cityCounts = {};
        records.forEach((record) => {
          const city = record.city;
          cityCounts[city] = (cityCounts[city] || 0) + 1;
        });

        const chartData = Object.entries(cityCounts)
          .map(([city, calls]) => ({ city, calls }))
          .sort((a, b) => a.calls - b.calls);

        setData(chartData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching city data:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, [filters]);

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading chart...</div>;
  }

  return (
    <Card className="bg-red-500/5 border-white/10">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-white text-sm font-semibold text-center">
          Calls by City
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="city"
                tick={{ fill: "#9ca3af", fontSize: 8 }}
                angle={-45}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                label={{ value: "Calls", angle: -90, position: "insideLeft", fill: "#9ca3af", fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(239, 68, 68, 0.1)" }} />
              <Bar dataKey="calls" fill="#ef4444" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default CityChart;