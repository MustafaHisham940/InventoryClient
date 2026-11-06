import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';
import { MatDateFormats } from '@angular/material/core';

/**
 * Angular Material's NativeDateAdapter.parse() ignores the format you give it and
 * just does `new Date(Date.parse(value))` - that mis-reads "14/09/2026" (day > 12
 * breaks a mm/dd guess, and even when it wouldn't, Date.parse still assumes mm/dd).
 * This override reads typed text as dd/mm/yyyy explicitly, so both the calendar
 * popup and manual typing agree on the same format.
 */
@Injectable()
export class DdMmYyyyDateAdapter extends NativeDateAdapter {
  override parse(value: any): Date | null {
    if (typeof value === 'string' && value.trim()) {
      const match = value.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (match) {
        const day = Number(match[1]);
        const month = Number(match[2]) - 1;
        const year = Number(match[3]);
        const date = new Date(year, month, day);
        return this.isValid(date) ? date : null;
      }
      return null;
    }
    return super.parse(value);
  }
}

/** display.dateInput is passed straight through to Intl.DateTimeFormat by
 * NativeDateAdapter - paired with MAT_DATE_LOCALE 'en-GB' this reliably renders
 * dd/mm/yyyy regardless of the OS/browser's own date-input locale. */
export const DD_MM_YYYY_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'input',
  },
  display: {
    dateInput: { day: '2-digit', month: '2-digit', year: 'numeric' },
    monthYearLabel: { month: 'short', year: 'numeric' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { month: 'long', year: 'numeric' },
  },
};
