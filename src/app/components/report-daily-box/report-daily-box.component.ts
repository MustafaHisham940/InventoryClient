import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ReportService } from '../../core/services/report.service';
import { TokenService } from '../../core/services/token.service';
import { StoresService } from '../../core/services/stores.service';
import { DailyBoxReportRequest } from '../../core/interfaces/daily-box-report';
import { DdMmYyyyDateAdapter, DD_MM_YYYY_FORMATS } from '../../core/date-adapters/dd-mm-yyyy-date-adapter';
import { dateToIso } from '../../core/utils/date-iso';

@Component({
  selector: 'app-report-daily-box',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDatepickerModule],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: DdMmYyyyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_FORMATS },
  ],
  templateUrl: './report-daily-box.component.html',
  styleUrl: './report-daily-box.component.css'
})
export class ReportDailyBoxComponent {

  private reportService = inject(ReportService);
  private _TokenService = inject(TokenService);
  private _StoresService = inject(StoresService);
  private sanitizer = inject(DomSanitizer);

  /** null = جميع المخازن */
  storeCode: string | null = null;
  storesList: { strCd: string, strNm: string }[] = [];

  /* The pickers work with Date objects; the request carries yyyy-mm-dd strings.
   * Defaults: from the 1st of this month to today. */
  startDateObj: Date | null = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  endDateObj: Date | null = new Date();

  singleStoreCode: string | undefined;
  singleStoreName: string | undefined;
  multiStoreFlag: string | undefined;

  pdfUrl?: SafeResourceUrl;
  excelReportFlag: number = -1;
  private lastReqBody?: DailyBoxReportRequest;

  ngOnInit(): void {
    this.multiStoreFlag = this._TokenService.GetUserStoreSettings()?.MultiStore;
    this.singleStoreCode = this._TokenService.GetUserStoreSettings()?.SingleStoreCode;
    this.singleStoreName = this._TokenService.GetUserStoreSettings()?.SingleStoreName;

    this._StoresService.GetStoresLookupList().subscribe({
      next: (res) => {
        this.storesList = res.data;
      }
    });
  }

  hasStartDateError(): boolean {
    return !this.startDateObj;
  }

  hasEndDateError(): boolean {
    return !this.endDateObj;
  }

  hasDateOrderError(): boolean {
    return !!this.startDateObj && !!this.endDateObj && this.startDateObj > this.endDateObj;
  }

  isFormInvalid(): boolean {
    return this.hasStartDateError() || this.hasEndDateError() || this.hasDateOrderError();
  }

  private buildRequest(): DailyBoxReportRequest {
    return {
      startDate: dateToIso(this.startDateObj!),
      endDate: dateToIso(this.endDateObj!),
      storeCode: this.storeCode,
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

    this.reportService.getDailyBoxReport(reqBody).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.excelReportFlag = 1;
    });
  }

  downloadExcel(): void {
    if (!this.lastReqBody) {
      return;
    }

    this.reportService.ExcelReport_getDailyBoxReport(this.lastReqBody).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'DailyBoxReport.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
