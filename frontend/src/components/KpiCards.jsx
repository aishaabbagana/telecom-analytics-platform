import { useEffect, useState } from "react";
import { Phone, Clock, PoundSterling, PhoneIncoming, PhoneOff } from "lucide-react";
import { getTotalCalls, getTotalDuration, getCdrs, filterCdrs } from "../services/cdrService";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

function KpiCards({ filters }) {
  const [totalCalls, setTotalCalls] = useState(0);
  const [avgDuration, setAvgDuration] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [successful, setSuccessful] = useState(0);
  const [failed, setFailed] = useState(0);
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

        setTotalCalls(records.length);

        const durations = records.map((r) => r.callDuration);
        const totalDur = durations.reduce((sum, d) => sum + d, 0);
        setAvgDuration(records.length > 0 ? Math.round(totalDur / records.length) : 0);

        const cost = records.reduce((sum, r) => sum + parseFloat(r.callCost || 0), 0);
        setTotalCost(cost);

        const successCount = records.filter((r) => r.callStatus === true).length;
        const failCount = records.filter((r) => r.callStatus === false).length;
        setSuccessful(successCount);
        setFailed(failCount);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching KPI data:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, [filters]);

  function formatNumber(num) {
    return num.toLocaleString();
  }

  const cards = [
    {
      title: "Total Calls",
      value: formatNumber(totalCalls),
      icon: Phone,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      title: "Avg Duration",
      value: `${formatNumber(avgDuration)}s`,
      icon: Clock,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Total Cost",
      value: `£${formatNumber(parseFloat(totalCost.toFixed(2)))}`,
      icon: PoundSterling,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      title: "Successful",
      value: formatNumber(successful),
      icon: PhoneIncoming,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Failed",
      value: formatNumber(failed),
      icon: PhoneOff,
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
  ];

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading KPIs...</div>;
  }

  return (
    <div className="grid grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className={`${card.bg} border-white/10`}>
            <CardHeader className="p-4 pb-2">
              <CardTitle className={`${card.color} flex items-center gap-2 text-sm font-medium`}>
                <Icon size={16} />
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-2xl font-bold text-white">{card.value}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default KpiCards;