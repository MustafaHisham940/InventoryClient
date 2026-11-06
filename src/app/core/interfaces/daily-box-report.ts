export interface DailyBoxReportSysInfo {
  accptMinus: number;
  multiStore: boolean;
  singleStrCd: string;
  companyName: string;
  storeName: string;
}

export interface DailyBoxReportRequest {
  startDate: string;
  endDate: string;
  /** null = all stores (جميع المخازن) */
  storeCode: string | null;
  sysInfo: DailyBoxReportSysInfo;
}
