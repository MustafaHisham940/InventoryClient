import { HttpResponse } from '@angular/common/http';

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
