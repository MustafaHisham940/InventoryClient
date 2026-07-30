export interface ItemsBalancesReportSysInfo {
  accptMinus: number;
  multiStore: boolean;
  singleStrCd: string;
  companyName: string;
  storeName: string;
}

export interface ItemsBalancesReportRequest {
  firstItem: string;
  endItem: string;
  storeCode: string;
  sysInfo: ItemsBalancesReportSysInfo;
}
