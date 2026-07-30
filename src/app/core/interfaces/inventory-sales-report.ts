export interface InventorySalesReportSysInfo {
  accptMinus: number;
  multiStore: boolean;
  singleStrCd: string;
  companyName: string;
  storeName: string;
}

export interface InventorySalesReportRequest {
  startDate: string;
  endTime: string;
  storeCode: string;
  startItemCode: string;
  endItemCode: string;
  sysInfo: InventorySalesReportSysInfo;
}
