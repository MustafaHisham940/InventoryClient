interface iloginSend{
    "email": "string",
    "password": "string"
  }

 

  export interface Users {
    status: boolean
    message: string
    data: userData[]
  }
  
  export interface userData {
    displayName: string
    address: any
    id: string
    userName: string
    normalizedUserName: string
    email: string
    normalizedEmail: string
    emailConfirmed: boolean
    passwordHash: string
    securityStamp: string
    concurrencyStamp: string
    phoneNumber: string
    phoneNumberConfirmed: boolean
    twoFactorEnabled: boolean
    lockoutEnd: any
    lockoutEnabled: boolean
    accessFailedCount: number
    isActive: boolean
    userSimpleId: number,
  }
  



  export interface Roles {
    data: role[]
    count: number
  }
  
  export interface role {
    id: string
    name: string
    normalizedName: string
    concurrencyStamp?: string
    isActive:boolean
  }




  export interface UserRoles {
    status:boolean
    data: string[]
    count: number
  }
  
 
  /**************************************************** */

  export interface UserData {
    status: boolean
    message: string
    data: Data
  }
  
  export interface Data {
    displayName: string
    address: Address
    isActive: boolean
    userSimpleId: number
    id: string
    userName: string
    normalizedUserName: string
    email: string
    normalizedEmail: string
    emailConfirmed: boolean
    passwordHash: string
    securityStamp: string
    concurrencyStamp: string
    phoneNumber: string
    phoneNumberConfirmed: boolean
    twoFactorEnabled: boolean
    lockoutEnd: any
    lockoutEnabled: boolean
    accessFailedCount: number
  }
  
  export interface Address {
    id: number
    fName: string
    lName: string
    city: string
    street: string
    country: string
    appUserId: string
    appUser: any
  }
  /********************************** */
  export interface MappedGroupFormUpdateDataUser{
    email: string,
    dsiplayName: string,
    phoneNumber: string,
    userName: string,
    userAddress:_userAddress
  }

 export interface _userAddress {
    fName: string,
    lName: string,
    city: string,
    street: string,
    country: string
  }