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
  /** null = all stores (multi-store users only) */
  storeCode: string | null;
  startItemCode: string;
  endItemCode: string;
  sysInfo: InventorySalesReportSysInfo;
}
