import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { getCdrs } from "../services/cdrService";

function Filters({ onFilter, onReset }) {
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [cities, setCities] = useState([]);

  useEffect(() => {
    async function fetchCities() {
      try {
        const response = await getCdrs(1, 1000);
        const records = response.data || response;
        const uniqueCities = [...new Set(records.map((r) => r.city))].sort();
        setCities(uniqueCities);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    }
    fetchCities();
  }, []);

  function handleFilter() {
    const filters = {};
    if (city) filters.city = city;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    onFilter(filters);
  }

  function handleReset() {
    setCity("");
    setStartDate("");
    setEndDate("");
    onReset();
  }

  const hasFilters = city || startDate || endDate;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
      >
        <option value="">All Cities</option>
        {cities.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <div className="flex items-center gap-2">
        <label className="text-gray-500 text-xs">From:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:outline-none focus:border-purple-500 transition-colors"
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-gray-500 text-xs">To:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:outline-none focus:border-purple-500 transition-colors"
        />
      </div>

      <button
        onClick={handleFilter}
        className="flex items-center gap-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
      >
        <Search size={12} />
        Filter
      </button>

      {hasFilters && (
        <button
          onClick={handleReset}
          className="flex items-center gap-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium rounded-lg border border-gray-700 transition-colors cursor-pointer"
        >
          <X size={12} />
          Clear
        </button>
      )}
    </div>
  );
}

export default Filters;