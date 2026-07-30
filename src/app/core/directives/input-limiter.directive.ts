// input-limiter.directive.ts
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appInputLimiter]',
  standalone: true
})
export class InputLimiterDirective {
  @Input() appInputLimiter: number = 50; // Default limit is 50

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const maxLength = this.appInputLimiter;

    // Check if the input is a number
    const isNumberInput = input.type === 'number' || !isNaN(Number(value));

    if (isNumberInput) {
      // For numbers, limit the digits
      const numericValue = value.replace(/[^0-9]/g, '');
      if (numericValue.length > maxLength) {
        input.value = numericValue.slice(0, maxLength);
        input.dispatchEvent(new Event('input')); // Trigger Angular's change detection
      }
    } else {
      // For text, limit the characters
      if (value.length > maxLength) {
        input.value = value.slice(0, maxLength);
        input.dispatchEvent(new Event('input')); // Trigger Angular's change detection
      }
    }
  }

  @HostListener('blur', ['$event']) onBlur(event: Event) {
    this.validateInput(event);
  }

  private validateInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const maxLength = this.appInputLimiter;

   
    if (value.length > maxLength) {
      input.value = value.slice(0, maxLength);
      input.dispatchEvent(new Event('input'));
    }
  }


}