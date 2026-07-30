export interface Categories {
    status: boolean
    errors: any
    message: string
    data: DataCtg
  }
  
  export interface DataCtg {
    pageSize: number
    pageIndex: number
    count: number
    data: Ctg[]
  }
  
  export interface Ctg {
    ctgName: string
    id: number
    createAt: string
    lastUpdate: string
  }
  