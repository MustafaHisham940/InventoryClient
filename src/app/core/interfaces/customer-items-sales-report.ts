export interface CustomerItemsSalesReportSysInfo {
  accptMinus: number;
  multiStore: boolean;
  singleStrCd: string;
  companyName: string;
  storeName: string;
}

export interface CustomerItemsSalesReportRequest {
  startItem: string;
  endItem: string;
  startDate: string;
  endDate: string;
  sysInfo: CustomerItemsSalesReportSysInfo;
}
