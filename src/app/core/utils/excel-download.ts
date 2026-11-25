import { HttpResponse } from '@angular/common/http';
import { Observer } from 'rxjs';

/**
 * Reads the download file name the server sent in Content-Disposition.
 * ASP.NET sends Arabic names as  filename*=UTF-8''<percent-encoded>,
 * with a plain  filename="..."  next to it for old browsers.
 */
export function fileNameFromResponse(res: HttpResponse<Blob>, fallbackName: string): string {
  const header = res.headers.get('Content-Disposition');
  if (!header) {
    return fallbackName;
  }

  const utf8 = /filename\*\s*=\s*UTF-8''([^;]+)/i.exec(header);
  if (utf8) {
    try {
      return decodeURIComponent(utf8[1].trim().replace(/^"|"$/g, ''));
    } catch {
      // badly encoded value: fall through to the plain name
    }
  }

  const plain = /filename\s*=\s*"?([^";]+)"?/i.exec(header);
  return plain ? plain[1].trim() : fallbackName;
}

/** Saves an Excel response, using the server's file name (Arabic) when it is there. */
export function saveExcelResponse(res: HttpResponse<Blob>, fallbackName: string): void {
  if (!res.body) {
    return;
  }

  const url = window.URL.createObjectURL(res.body);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileNameFromResponse(res, fallbackName);
  a.click();
  window.URL.revokeObjectURL(url);
}

/**
 * Subscriber for the Excel download buttons:
 *   this.reportService.ExcelReport_x(body).subscribe(excelDownload('X.xlsx'));
 * On success it saves the file. On failure the error interceptor has already
 * shown the server's message, so here the error is only logged; without this
 * handler it would be an uncaught error.
 */
export function excelDownload(fallbackName: string): Partial<Observer<HttpResponse<Blob>>> {
  return {
    next: res => saveExcelResponse(res, fallbackName),
    error: err => console.error('Excel download failed', err)
  };
}
