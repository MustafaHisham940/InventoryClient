export interface ICheckupBalRep {

        specs: HeadersSpecsParams;
        sysInfo: SysInfo;      
      
}


export interface HeadersSpecsParams {
    strCd_Search?: string;
  
    _TrsTy?: number | null;
    _TrsNo?: number | null;
  
    _TrsDt?: string | null;   // ISO string
    cstId?: number | null;
    _Val?: number | null;
  
    disc_search?: string;
    ovrPrc_search?: string;
  
    _DTy?: number | null;
  
    sCd_search?: string;
    oWn_search?: string;
    lUsr_search?: string;
  
    _CTm?: string | null;     // ISO string
    _LTm?: string | null;     // ISO string
  
    _SPrc?: number | null;
  
    sort?: string;
  
    pageSize: number;
    pageIndex: number;
  
    startDate?: string | null; // ISO string
    endDate?: string | null;   // ISO string
  }
  

  export interface SysInfo {
    accptMinus: number;
    multiStore: boolean;
    singleStrCd?: string;
    companyName?: string;
    storeName?: string;
  }
  