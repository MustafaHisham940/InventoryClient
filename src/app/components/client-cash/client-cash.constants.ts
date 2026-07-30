// تسديد الموردين (supplier settlements) transactions have no related store, so StrCd is
// the fixed sentinel string "Null" and the user is never routed through /SelectStore.
export const CLIENT_CASH_TRSTY = 23;
export const CLIENT_CASH_STR_CD = 'Null';
