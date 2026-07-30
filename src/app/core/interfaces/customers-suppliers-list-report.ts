export interface CustomersSuppliersListReportSysInfo {
  accptMinus: number;
  multiStore: boolean;
  singleStrCd: string;
  companyName: string;
  storeName: string;
}

export interface CustomersSuppliersListReportRequest {
  startCstmr: number;
  endCstmr: number;
  sysInfo: CustomersSuppliersListReportSysInfo;
}
