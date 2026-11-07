import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ReportService } from '../../core/services/report.service';
import { StoreScopeService } from '../../core/services/store-scope.service';
import { ExistDailyBoxReportRequest } from '../../core/interfaces/exist-daily-box-report';
import { DdMmYyyyDateAdapter, DD_MM_YYYY_FORMATS } from '../../core/date-adapters/dd-mm-yyyy-date-adapter';
import { dateToIso } from '../../core/utils/date-iso';
import { ReportShellComponent } from '../report-shared/report-shell.component';
import { StoreScopeFieldComponent } from '../report-shared/store-scope-field.component';

@Component({
  selector: 'app-report-exist-daily-box',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDatepickerModule, ReportShellComponent, StoreScopeFieldComponent],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: DdMmYyyyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_FORMATS },
  ],
  templateUrl: './report-exist-daily-box.component.html'
})
export class ReportExistDailyBoxComponent {

  private reportService = inject(ReportService);
  private storeScope = inject(StoreScopeService);
  private sanitizer = inject(DomSanitizer);

  /** null = جميع المخازن (multi-store users); a single-store user is locked on their own store */
  storeCode: string | null = this.storeScope.initialCode(true);

  /* The pickers work with Date objects; the request carries yyyy-mm-dd strings (dates only, no time).
   * Defaults: today. */
  startDateObj: Date | null = new Date();
  endDateObj: Date | null = new Date();

  pdfUrl?: SafeResourceUrl;
  excelReportFlag: number = -1;
  loading = false;
  private lastReqBody?: ExistDailyBoxReportRequest;

  hasStartDateError(): boolean {
    return !this.startDateObj;
  }

  hasEndDateError(): boolean {
    return !this.endDateObj;
  }

  hasDateOrderError(): boolean {
    return !!this.startDateObj && !!this.endDateObj && this.startDateObj > this.endDateObj;
  }

  hasStoreCodeError(): boolean {
    return this.storeScope.storeError(this.storeCode, true);
  }

  isFormInvalid(): boolean {
    return this.hasStartDateError() || this.hasEndDateError() || this.hasDateOrderError() || this.hasStoreCodeError();
  }

  private buildRequest(): ExistDailyBoxReportRequest {
    return {
      startDate: dateToIso(this.startDateObj!),
      endDate: dateToIso(this.endDateObj!),
      storeCode: this.storeScope.effectiveCode(this.storeCode),
      sysInfo: this.storeScope.sysInfo()
    };
  }

  search(): void {
    if (this.isFormInvalid()) {
      return;
    }

    const reqBody = this.buildRequest();
    this.lastReqBody = reqBody;
    this.loading = true;

    this.reportService.getExistDailyBoxReport(reqBody).subscribe({
      next: blob => {
        const url = window.URL.createObjectURL(blob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.excelReportFlag = 1;
        this.loading = false;
      },
      error: () => this.loading = false
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
