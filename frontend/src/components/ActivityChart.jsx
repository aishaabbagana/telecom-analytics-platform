import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getCdrs, filterCdrs } from "../services/cdrService";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 shadow-lg">
      <p className="text-white font-semibold text-sm mb-1">{label}</p>
      <p className="text-green-400 text-sm">
        Calls: <span className="font-bold">{payload[0].value}</span>
      </p>
    </div>
  );
}

function ActivityChart({ filters }) {
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

        const hourCounts = {};
        for (let i = 0; i < 24; i++) {
          const label = `${i.toString().padStart(2, "0")}:00`;
          hourCounts[label] = 0;
        }

        records.forEach((record) => {
          const hour = new Date(record.callStartTime).getHours();
          const label = `${hour.toString().padStart(2, "0")}:00`;
          hourCounts[label]++;
        });

        const chartData = Object.entries(hourCounts).map(([hour, calls]) => ({
          hour,
          calls,
        }));

        setData(chartData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching activity data:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, [filters]);

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading chart...</div>;
  }

  return (
    <Card className="bg-green-500/5 border-white/10">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-white text-sm font-semibold text-center">
          Call Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="hour"
                tick={{ fill: "#9ca3af", fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                interval={0}
                label={{ value: "Hour of Day", position: "insideBottom", offset: -20, fill: "#9ca3af", fontSize: 11 }}
              />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                label={{ value: "Calls", angle: -90, position: "insideLeft", fill: "#9ca3af", fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="calls"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: "#22c55e", r: 3 }}
                activeDot={{ fill: "#22c55e", r: 5, stroke: "#fff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default ActivityChart;