export interface stores {
    pageSize: number
    pageIndex: number
    count: number
    totalCount: number
    data: storedata[]
  }
  
  export interface storedata {
    strNm: string
    pNam: string
    id: string
  }
  