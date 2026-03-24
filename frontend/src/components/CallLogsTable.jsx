import { useEffect, useState } from "react";
import { getCdrs, filterCdrs } from "../services/cdrService";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

function CallLogsTable({ filters }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);

  const limit = 10;

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        let data;
        let pages;

        if (filters) {
          const response = await filterCdrs(filters);
          const allRecords = response.data || response;
          pages = Math.ceil(allRecords.length / limit);
          data = allRecords.slice((page - 1) * limit, page * limit);
        } else {
          const response = await getCdrs(page, limit);
          data = response.data || response;
          pages = response.totalPages || Math.ceil((response.total || data.length) / limit);
        }

        setRecords(data);
        setTotalPages(pages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching call logs:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, [page, filters]);

  useEffect(() => {
    if (!search) {
      setFilteredRecords(records);
      return;
    }

    const term = search.toLowerCase();
    const filtered = records.filter((record) =>
      record.callerName?.toLowerCase().includes(term) ||
      record.callerNumber?.toLowerCase().includes(term) ||
      record.receiverNumber?.toLowerCase().includes(term) ||
      record.city?.toLowerCase().includes(term)
    );
    setFilteredRecords(filtered);
  }, [search, records]);

  function formatTime(dateString) {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  function cleanNumber(number) {
    if (!number) return "";
    return number.split(" ")[0].replace(/x\d+$/, "");
  }

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading call logs...</div>;
  }

  return (
    <Card className="border-white/10">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white text-sm font-semibold">
            Recent Call Logs
          </CardTitle>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search calls..."
              className="pl-8 pr-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:outline-none focus:border-purple-500 transition-colors w-48"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="overflow-hidden rounded-lg border border-gray-800">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-400 font-medium py-2 px-3 border-r border-gray-800">Caller Name</th>
                <th className="text-left text-gray-400 font-medium py-2 px-3 border-r border-gray-800">Caller Number</th>
                <th className="text-left text-gray-400 font-medium py-2 px-3 border-r border-gray-800">Receiver Number</th>
                <th className="text-left text-gray-400 font-medium py-2 px-3 border-r border-gray-800">City</th>
                <th className="text-left text-gray-400 font-medium py-2 px-3 border-r border-gray-800">Duration</th>
                <th className="text-left text-gray-400 font-medium py-2 px-3 border-r border-gray-800">Cost</th>
                <th className="text-left text-gray-400 font-medium py-2 px-3">Start Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record._id || record.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                  <td className="py-2 px-3 text-white border-r border-gray-800">{record.callerName}</td>
                  <td className="py-2 px-3 text-gray-300 border-r border-gray-800">{cleanNumber(record.callerNumber)}</td>
                  <td className="py-2 px-3 text-gray-300 border-r border-gray-800">{cleanNumber(record.receiverNumber)}</td>
                  <td className="py-2 px-3 text-gray-300 border-r border-gray-800">{record.city}</td>
                  <td className="py-2 px-3 text-gray-300 border-r border-gray-800">{record.callDuration}s</td>
                  <td className="py-2 px-3 text-purple-400 font-semibold border-r border-gray-800">£{parseFloat(record.callCost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="py-2 px-3 text-gray-300">{formatTime(record.callStartTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-gray-500 text-xs">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-xs hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={14} />
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-xs hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CallLogsTable;