export interface DetailedItemSalesReportSysInfo {
  accptMinus: number;
  multiStore: boolean;
  singleStrCd: string;
  companyName: string;
  storeName: string;
}

export interface DetailedItemSalesReportRequest {
  itemCode: string;
  storeCode: string;
  startDate: string;
  endDate: string;
  sysInfo: DetailedItemSalesReportSysInfo;
}
