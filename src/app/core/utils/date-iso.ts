/** Date -> 'yyyy-mm-dd' using the LOCAL calendar day (toISOString() would shift the day for users ahead of UTC). */
export function dateToIso(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/** 'yyyy-mm-dd' (or a longer ISO date-time string) -> local Date at midnight, or null if it doesn't parse.
 *  Built from the parts rather than new Date('yyyy-mm-dd'), which is parsed as UTC and can land on the previous day. */
export function isoToDate(iso: string | null | undefined): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? '');
  if (!match) {
    return null;
  }
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}
