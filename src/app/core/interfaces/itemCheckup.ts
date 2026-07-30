
export interface Specs {
    strCd_search: string;
    _TrsTy: number;
    _TrsNo: number;
    _LnNo: number; 
    _CstId: number;
    itmCd_search: string;
    _Qty: number;
    _Pric: number;
    _BCd: number;
    _Bck: number;
    _ONo: number;
    _GQty: number;
    own_search: string;
    lUsr_search: string;
    
    _Cst: number;
    _Sort: string;
    _pageIndex: number;
    _pageSize: number;
    startDate: string;   // ISO date string
    endDate: string;     // ISO date string
  }


  export interface SysInfo {
    accptMinus: number;
    multiStore: boolean;
    singleStrCd: string;
    companyName: string;
    storeName: string;
  }

  export interface ItemCheckUpRequest {
    specs: Specs;
    sysInfo: SysInfo;
  }