import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import KpiCards from "../components/KpiCards";
import DurationChart from "../components/DurationChart";
import CostChart from "../components/CostChart";
import ActivityChart from "../components/ActivityChart";
import CityChart from "../components/CityChart";
import CallLogsTable from "../components/CallLogsTable";
import Filters from "../components/Filters";
import TopCallers from "../components/TopCallers";

function DashboardPage() {
  const { role, logout } = useAuth();
  const [filters, setFilters] = useState(null);

  function handleFilter(newFilters) {
    setFilters(newFilters);
  }

  function handleReset() {
    setFilters(null);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Telecom Analytics Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">Role: {role}</span>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      <Filters onFilter={handleFilter} onReset={handleReset} />

      <div className="mt-6">
        <KpiCards filters={filters} />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <DurationChart filters={filters} />
        <CostChart filters={filters} />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <ActivityChart filters={filters} />
        <CityChart filters={filters} />
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="col-span-2">
          <CallLogsTable filters={filters} />
        </div>
        <TopCallers />
      </div>
    </div>
  );
}

export default DashboardPage;