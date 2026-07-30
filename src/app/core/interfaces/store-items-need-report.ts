export interface StoreItemsNeedReportSysInfo {
  accptMinus: number;
  multiStore: boolean;
  singleStrCd: string;
  companyName: string;
  storeName: string;
}

export interface StoreItemsNeedReportRequest {
  storeCode: string;
  startItem: string;
  endtItem: string;
  sysInfo: StoreItemsNeedReportSysInfo;
}
