export interface PollutionReport {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    pollution: string;
    severity: string;
    aqi: number;
    description: string;
    confidence: number;
    createdAt: string;
  }
  
  const STORAGE_KEY = "ecolens_reports";
  
  export function getReports(): PollutionReport[] {
    if (typeof window === "undefined") return [];
  
    const data = localStorage.getItem(STORAGE_KEY);
  
    return data ? JSON.parse(data) : [];
  }
  
  export function saveReport(report: PollutionReport) {
    if (typeof window === "undefined") return;
  
    const reports = getReports();
  
    reports.unshift(report);
  
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(reports)
    );
  }