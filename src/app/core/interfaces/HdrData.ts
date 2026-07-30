export interface Hdr {
    strCd: string | null;
    trsTy: number;
    trsNo: number;
  }
  
  export interface SysInfo {
    accptMinus: number;
    multiStore: boolean;
    singleStrCd: string;
    companyName: string;
    storeName: string;
  }
  
  export interface DeleteAllHeadersObj {
    hdr: Hdr;
    sysInfo: SysInfo;
  }
  