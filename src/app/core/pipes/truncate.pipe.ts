import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {

  transform(value: any, length: number = 8): string {
    if (value === null || value === undefined) {
      return '';
    }

    const strValue = typeof value === 'number' ? value.toString() : String(value);
    return strValue.length > length ? `${strValue.substring(0, length)}...` : strValue;
  }

}
