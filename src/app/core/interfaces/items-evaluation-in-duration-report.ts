export interface ItemsEvaluationInDurationReportSysInfo {
  accptMinus: number;
  multiStore: boolean;
  singleStrCd: string;
  companyName: string;
  storeName: string;
}

export interface ItemsEvaluationInDurationReportRequest {
  storeCode: string;
  startItmCode: string;
  endItmCode: string;
  startDate: string;
  endDate: string;
  sysInfo: ItemsEvaluationInDurationReportSysInfo;
}
