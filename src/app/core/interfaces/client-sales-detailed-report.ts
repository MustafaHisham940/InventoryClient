export interface ClientSalesDetailedReportSysInfo {
  accptMinus: number;
  multiStore: boolean;
  singleStrCd: string;
  companyName: string;
  storeName: string;
}

export interface ClientSalesDetailedReportRequest {
  cstmrCode: number;
  startDate: string;
  endDate: string;
  sysInfo: ClientSalesDetailedReportSysInfo;
}
