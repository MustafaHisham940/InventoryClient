export interface ItemsListReportSysInfo {
  accptMinus: number;
  multiStore: boolean;
  singleStrCd: string;
  companyName: string;
  storeName: string;
}

export interface ItemsListReportRequest {
  firstItem: string;
  endItem: string;
  storeCode: string;
  sysInfo: ItemsListReportSysInfo;
}
