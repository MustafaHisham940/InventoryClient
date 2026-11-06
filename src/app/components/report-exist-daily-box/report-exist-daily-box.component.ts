import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ReportService } from '../../core/services/report.service';
import { TokenService } from '../../core/services/token.service';
import { StoresService } from '../../core/services/stores.service';
import { ExistDailyBoxReportRequest } from '../../core/interfaces/exist-daily-box-report';
import { DdMmYyyyDateAdapter, DD_MM_YYYY_FORMATS } from '../../core/date-adapters/dd-mm-yyyy-date-adapter';
import { dateToIso } from '../../core/utils/date-iso';

@Component({
  selector: 'app-report-exist-daily-box',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDatepickerModule],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: DdMmYyyyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_FORMATS },
  ],
  templateUrl: './report-exist-daily-box.component.html',
  styleUrl: './report-exist-daily-box.component.css'
})
export class ReportExistDailyBoxComponent {

  private reportService = inject(ReportService);
  private _TokenService = inject(TokenService);
  private _StoresService = inject(StoresService);
  private sanitizer = inject(DomSanitizer);

  /* The pickers work with Date objects; the request carries yyyy-mm-dd strings (dates only, no time).
   * Defaults: today. */
  startDateObj: Date | null = new Date();
  endDateObj: Date | null = new Date();

  /** null = جميع المخازن */
  storeCode: string | null = null;
  storesList: { strCd: string, strNm: string }[] = [];

  singleStoreCode: string | undefined;
  singleStoreName: string | undefined;
  multiStoreFlag: string | undefined;

  /** multi-store users pick the store, single-store users are fixed to their own store (from the login token) */
  get canPickStore(): boolean {
    return this.multiStoreFlag === 'True';
  }

  pdfUrl?: SafeResourceUrl;
  excelReportFlag: number = -1;
  private lastReqBody?: ExistDailyBoxReportRequest;

  ngOnInit(): void {
    const settings = this._TokenService.GetUserStoreSettings();
    this.multiStoreFlag = settings?.MultiStore;
    this.singleStoreCode = settings?.SingleStoreCode;
    this.singleStoreName = settings?.SingleStoreName;

    if (this.canPickStore) {
      this._StoresService.GetStoresLookupList().subscribe({
        next: (res) => {
          this.storesList = res.data;
        }
      });
    } else {
      this.storeCode = this.singleStoreCode ?? null;
    }
  }

  hasStartError(): boolean {
    return !this.startDateObj;
  }

  hasEndError(): boolean {
    return !this.endDateObj;
  }

  hasOrderError(): boolean {
    return !!this.startDateObj && !!this.endDateObj && this.startDateObj > this.endDateObj;
  }

  isFormInvalid(): boolean {
    return this.hasStartError() || this.hasEndError() || this.hasOrderError();
  }

  private buildRequest(): ExistDailyBoxReportRequest {
    return {
      startDate: dateToIso(this.startDateObj!),
      endDate: dateToIso(this.endDateObj!),
      storeCode: this.canPickStore ? this.storeCode : (this.singleStoreCode ?? null),
      sysInfo: {
        accptMinus: 0,
        multiStore: this.multiStoreFlag === 'True',
        singleStrCd: this.singleStoreCode ?? '',
        companyName: '',
        storeName: this.singleStoreName ?? ''
      }
    };
  }

  search(): void {
    if (this.isFormInvalid()) {
      return;
    }

    const reqBody = this.buildRequest();
    this.lastReqBody = reqBody;

    this.reportService.getExistDailyBoxReport(reqBody).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.excelReportFlag = 1;
    });
  }

  downloadExcel(): void {
    if (!this.lastReqBody) {
      return;
    }

    this.reportService.ExcelReport_getExistDailyBoxReport(this.lastReqBody).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ExistDailyBoxReport.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
