import { AbstractControl, ValidationErrors } from '@angular/forms';

/** The smallest quantity / price the database can hold: its columns are decimal(18, 3). */
export const MIN_AMOUNT = 0.001;

/** True when the value is a real number of at least MIN_AMOUNT: null, '', 0, negative and NaN are all rejected. */
export function isPositiveAmount(value: unknown): boolean {
  if (value === null || value === undefined || value === '') {
    return false;
  }
  const n = Number(value);
  return Number.isFinite(n) && n >= MIN_AMOUNT;
}

/** Reactive-forms validator: the field is required AND must be greater than zero. Error key: `positiveAmount`. */
export function positiveAmountValidator(control: AbstractControl): ValidationErrors | null {
  return isPositiveAmount(control.value) ? null : { positiveAmount: true };
}
