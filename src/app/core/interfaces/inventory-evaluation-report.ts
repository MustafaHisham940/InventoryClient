export interface InventoryEvaluationReportSysInfo {
  accptMinus: number;
  multiStore: boolean;
  singleStrCd: string;
  companyName: string;
  storeName: string;
}

export interface InventoryEvaluationReportRequest {
  startItem: string;
  endItem: string;
  storeCode: string;
  sysInfo: InventoryEvaluationReportSysInfo;
}
