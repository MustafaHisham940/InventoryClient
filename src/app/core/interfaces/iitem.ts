export interface IItems {
    pageSize: number
    pageIndex: number
    count: number
    data: item[]
  }
  
  export interface item {
    id: string
    itmNm: string
    bCst: number
    lPrc: number
    pric: number
    mUnt: string
    back: number
    tax: number
    barCod: string
    gPrc: number
    ctgName: string
  }


  export interface ICreateItemDto {
    id: string
    itmNm: string
    bCst?: number
    lPrc?: number
    pric?: number
    mUnt?: string
    back?: number
    tax?: number
    barCod?: string
    gPrc?: number
    ctgId?: number
  }


  export interface IediteItemDto {
    itmNm?: string
    bCst?: number
    lPrc?: number
    pric?: number
    mUnt?: string
    back?: number
    tax?: number
    barCod?: string
    gPrc?: number
    ctgId?: number
  }
  