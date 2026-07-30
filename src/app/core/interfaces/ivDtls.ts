// iv-dto.model.ts
export interface IVDtlsspecsFilter {
  _StrCd: string;
  _TrsTy: string;
  _TrsNo: string;
  _LnNo: number;
  _TrsDt: string;
  _CstId: string;
  _ItmCd: string;
  _Qty: number;
  _Pric: number;
  _BCd: string;
  _Bck: string;
  _ONo: string;
  _GQty: number;
  _Own: string;
  _LUsr: string;
  _CTm: string;
  _LTm: string;
  _Cst: string;
  _Sort: string;
  _pageIndex: number;
  _pageSize: number;
}


export interface Details {
  pageSize: number
  pageIndex: number
  count: number
  totalCount: number
  data: Dtls[]
}

export interface Dtls {
  storeName: string
  strCd: string
  trsTy: number
  trsNo: number
  lnNo: number
  trsDt: string
  customerName: string
  cstId: number
  itemName: string
  itmCd: string
  qty: number
  pric: number
  bCd: number
  bck: number
  oNo: number
  gQty: number
  own: string
  lUsr: string
  cTm: string
  lTm: string
  cst: number
  id: any
}



/********************************************************************** */


export interface IHeaders {
  pageSize: number
  pageIndex: number
  count: number
  totalCount: number
  data: Header[]
}

export interface Header {


  
  strCd: string | null
  trsTy: number
  trsNo: number
  trsDt: Date
  customerName:string
  cstId: number
  val: number
  disc: string
  ovrPrc: string
  rem: string
  ref: number
  dTy: number
  oNo: number
  sCd: string
  pStat: number
  knd: number
  oWn: string
  lUsr: string
  cTm: string
  lTm: string
  sPrc: number
  cashRef: number
  id: any


}



export interface editeHeaderMEta{
  hdr:Header|undefined,
  cur_StoreName:string,
  cur_Trstys:String
}


export interface updateHeader{
  
  cstId: number,
  dTy: number|undefined,
  lUsr: String|null,
  lTm: Date
}


export interface KeyHdrs {
  strCd: string|undefined;
  trsTy: number|undefined;
  trsNo: number|undefined;
}
