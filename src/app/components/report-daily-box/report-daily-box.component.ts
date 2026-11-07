import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ReportService } from '../../core/services/report.service';
import { StoreScopeService } from '../../core/services/store-scope.service';
import { DailyBoxReportRequest } from '../../core/interfaces/daily-box-report';
import { DdMmYyyyDateAdapter, DD_MM_YYYY_FORMATS } from '../../core/date-adapters/dd-mm-yyyy-date-adapter';
import { dateToIso } from '../../core/utils/date-iso';
import { ReportShellComponent } from '../report-shared/report-shell.component';
import { StoreScopeFieldComponent } from '../report-shared/store-scope-field.component';

@Component({
  selector: 'app-report-daily-box',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDatepickerModule, ReportShellComponent, StoreScopeFieldComponent],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: DdMmYyyyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_FORMATS },
  ],
  templateUrl: './report-daily-box.component.html'
})
export class ReportDailyBoxComponent {

  private reportService = inject(ReportService);
  private storeScope = inject(StoreScopeService);
  private sanitizer = inject(DomSanitizer);

  /** null = جميع المخازن (multi-store users); a single-store user is locked on their own store */
  storeCode: string | null = this.storeScope.initialCode(true);

  /* The pickers work with Date objects; the request carries yyyy-mm-dd strings.
   * Defaults: from the 1st of this month to today. */
  startDateObj: Date | null = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  endDateObj: Date | null = new Date();

  pdfUrl?: SafeResourceUrl;
  excelReportFlag: number = -1;
  loading = false;
  private lastReqBody?: DailyBoxReportRequest;

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

  private buildRequest(): DailyBoxReportRequest {
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

    this.reportService.getDailyBoxReport(reqBody).subscribe({
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
