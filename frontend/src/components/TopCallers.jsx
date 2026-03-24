import { useEffect, useState } from "react";
import { getTopCallers } from "../services/cdrService";
import { useAuth } from "../context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Crown, Lock } from "lucide-react";

function TopCallers() {
  const { role } = useAuth();
  const [callers, setCallers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== "admin") {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const data = await getTopCallers();
        setCallers(data.topCallers || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching top callers:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, [role]);

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading...</div>;
  }

  if (role !== "admin") {
    return (
      <Card className="border-white/10">
        <CardContent className="p-6 flex flex-col items-center justify-center h-48">
          <Lock size={24} className="text-gray-600 mb-3" />
          <p className="text-gray-500 text-sm font-medium">Admin Access Only</p>
          <p className="text-gray-600 text-xs mt-1">Top Callers data requires admin privileges</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-white/10">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
          <Crown size={14} className="text-yellow-500" />
          Top 10 Callers
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="overflow-hidden rounded-lg border border-gray-800">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-400 font-medium py-2 px-3 border-r border-gray-800">#</th>
                <th className="text-left text-gray-400 font-medium py-2 px-3 border-r border-gray-800">Caller Name</th>
                <th className="text-left text-gray-400 font-medium py-2 px-3">Total Calls</th>
              </tr>
            </thead>
            <tbody>
              {callers.map((caller, index) => (
                <tr key={caller._id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                  <td className="py-2 px-3 text-yellow-500 font-semibold border-r border-gray-800">{index + 1}</td>
                  <td className="py-2 px-3 text-white border-r border-gray-800">{caller._id}</td>
                  <td className="py-2 px-3 text-gray-300">{caller.totalCalls}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default TopCallers;