export interface itemBAlance {
    pageSize: number
    pageIndex: number
    count: number
    totalCount: number
    data: Balnce[]
  }
  
  export interface Balnce {
    bCd: string
    itmCd: string
    bBal: number
    iQty: number
    oQty: number
    rOrdr: number
    cst: number
    id: any
  }
  