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
  /** 1 = مورد, 2 = عميل, 3 = كلاهما */
  customerType: number;
  sysInfo: CustomersSuppliersListReportSysInfo;
}
