export interface ExistDailyBoxReportSysInfo {
  accptMinus: number;
  multiStore: boolean;
  singleStrCd: string;
  companyName: string;
  storeName: string;
}

export interface ExistDailyBoxReportRequest {
  /** yyyy-mm-dd, the whole day is covered */
  startDate: string;
  endDate: string;
  /** null = all stores (multi-store users); a single-store user always sends their own store */
  storeCode: string | null;
  sysInfo: ExistDailyBoxReportSysInfo;
}
