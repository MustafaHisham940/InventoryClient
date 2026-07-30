// المصروفات transactions DO belong to a real store: the user is routed through
// /SelectStore first, and StrCd is whatever store they picked there (unlike
// ClientPayments/ClientCash, which use the "Null" sentinel and skip /SelectStore).
export const EXPENSES_TRSTY = 22;
