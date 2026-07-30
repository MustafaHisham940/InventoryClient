// مدفوعات العملاء transactions have no related store, so StrCd is always null
// for these headers and the user is never routed through /SelectStore.
export const CLIENT_PAYMENTS_TRSTY = 21;
