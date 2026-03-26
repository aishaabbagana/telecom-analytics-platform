import api from "./api";

export async function getCdrs(page = 1, limit = 10, search = "") {
  const response = await api.get(`/cdrs?page=${page}&limit=${limit}&search=${search}`);
  return response.data;
}

export async function filterCdrs(filters) {
  const params = new URLSearchParams();
  if (filters.city) params.append("city", filters.city);
  if (filters.callerNumber) params.append("callerNumber", filters.callerNumber);
  if (filters.receiverNumber) params.append("receiverNumber", filters.receiverNumber);
  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);
  const response = await api.get(`/cdrs/filter?${params.toString()}`);
  return response.data;
}

export async function getTotalCalls() {
  const response = await api.get("/cdrs/analytics/total-calls");
  return response.data;
}

export async function getTotalDuration() {
  const response = await api.get("/cdrs/analytics/total-duration");
  return response.data;
}

export async function getCallDistribution() {
  const response = await api.get("/cdrs/analytics/call-distribution");
  return response.data;
}

export async function getTopCallers() {
  const response = await api.get("/cdrs/analytics/top-callers");
  return response.data;
}