import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { getCdrs, filterCdrs } from "../services/cdrService";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 shadow-lg">
      <p className="text-white font-semibold text-sm mb-1">{label}</p>
      <p className="text-purple-400 text-sm">
        Duration: <span className="font-bold">{payload[0].value.toLocaleString()}s</span>
      </p>
    </div>
  );
}

function DurationChart({ filters }) {
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

        if (records.length === 0) {
          setData([]);
          setLoading(false);
          return;
        }

        const durations = records.map((record) => record.callDuration);
        const longest = Math.max(...durations);
        const shortest = Math.min(...durations);
        const average = Math.round(durations.reduce((sum, d) => sum + d, 0) / durations.length);

        const chartData = [
          { name: "Longest Call", duration: longest },
          { name: "Shortest Call", duration: shortest },
          { name: "Average Duration", duration: average },
        ];

        setData(chartData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching duration data:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, [filters]);

  const colors = ["#8b5cf6", "#6d28d9", "#a78bfa"];

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading chart...</div>;
  }

  return (
    <Card className="bg-purple-500/5 border-white/10">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-white text-sm font-semibold text-center">
          Call Duration
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                label={{ value: "Seconds", angle: -90, position: "insideLeft", fill: "#9ca3af", fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(139, 92, 246, 0.1)" }} />
              <Bar dataKey="duration" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default DurationChart;